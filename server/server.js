import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { parseStringPromise } from 'xml2js';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const TARGET_IP = '127.0.0.1';

// Predefined Nmap commands mapping to ensure safety
const SCAN_COMMANDS = {
  host_discovery: `nmap -sn -oX - ${TARGET_IP}`,
  basic_port: `nmap -sS -T4 -p 22,80,443,21,23,3306,8080 -oX - ${TARGET_IP}`,
  os_detect: `nmap -O -oX - ${TARGET_IP}`,
  aggressive: `nmap -A -oX - ${TARGET_IP}`
};

app.post('/api/scan', async (req, res) => {
  const { scanType } = req.body;
  
  if (!scanType || !SCAN_COMMANDS[scanType]) {
    return res.status(400).json({ error: 'Invalid or missing scan type' });
  }

  const command = SCAN_COMMANDS[scanType];
  console.log(`Executing: ${command}`);

  // Using a large buffer because Nmap -A output can be quite large
  exec(command, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
    // Note: Nmap may throw a non-zero exit code if some scripts fail or if run without sudo/admin
    // but it typically still outputs valid XML on stdout.
    if (!stdout) {
      console.error('Nmap execution failed:', error || stderr);
      return res.status(500).json({ error: 'Nmap execution failed', details: stderr });
    }

    try {
      const parsed = await parseStringPromise(stdout);
      
      const host = parsed.nmaprun?.host?.[0];
      
      // If host is not found in the XML, it's likely down or unreachable
      if (!host) {
        return res.json({ status: 'down', ports: [], os: null });
      }

      const status = host.status?.[0]?.$?.state || 'unknown';
      
      // Attempt to extract OS fingerprint
      let osMatch = null;
      let osAccuracy = null;
      if (host.os && host.os[0] && host.os[0].osmatch && host.os[0].osmatch[0]) {
        osMatch = host.os[0].osmatch[0].$?.name;
        osAccuracy = host.os[0].osmatch[0].$?.accuracy;
      }

      // Attempt to extract Host details (latency, uptime)
      let latency = host.times?.[0]?.$?.srtt || null;
      // srtt is in microseconds, convert to ms: (microseconds / 1000)
      if (latency) {
        latency = (parseInt(latency) / 1000).toFixed(2);
      }
      
      let uptime = host.uptime?.[0]?.$?.lastboot || null;
      
      // Attempt to extract Ports
      const ports = [];
      if (host.ports && host.ports[0] && host.ports[0].port) {
        host.ports[0].port.forEach(p => {
          let state = 'Unknown';
          if (p.state && p.state[0] && p.state[0].$) {
            state = p.state[0].$.state;
            // capitalize first letter for consistency with frontend
            state = state.charAt(0).toUpperCase() + state.slice(1);
          }
          
          let service = 'unknown';
          let product = null;
          let version = null;
          let extrainfo = null;
          if (p.service && p.service[0] && p.service[0].$) {
            service = p.service[0].$.name;
            product = p.service[0].$.product || null;
            version = p.service[0].$.version || null;
            extrainfo = p.service[0].$.extrainfo || null;
          }

          ports.push({
            port: parseInt(p.$?.portid),
            state: state,
            service: service,
            product: product,
            version: version,
            extrainfo: extrainfo
          });
        });
      }

      const resultObj = {
        timestamp: new Date().toISOString(),
        scanType: scanType,
        command: command,
        host: TARGET_IP,
        status: status,
        os: osMatch,
        osAccuracy: osAccuracy,
        latency: latency,
        uptime: uptime,
        ports: ports
      };

      // Append results to a local log file
      fs.appendFile('scan_logs.json', JSON.stringify(resultObj) + '\n', (err) => {
        if (err) console.error('Failed to write to scan_logs.json:', err);
      });

      return res.json(resultObj);

    } catch (parseErr) {
      console.error('XML parsing error:', parseErr);
      return res.status(500).json({ error: 'Failed to parse Nmap output' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend Scanner running on http://localhost:${PORT}`);
  console.log(`Target locked to: ${TARGET_IP} only.`);
});
