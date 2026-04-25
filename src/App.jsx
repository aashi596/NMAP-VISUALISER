import React, { useState } from 'react'
import SimulationSection from './SimulationSection'
import ResultsSection from './ResultsSection'
import './App.css'

const initialPorts = [];

function App() {
  const [scanData, setScanData] = useState(initialPorts);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [activePortIndex, setActivePortIndex] = useState(-1);

  const [scanType, setScanType] = useState('aggressive');
  const [osDetails, setOsDetails] = useState(null);
  const [osAccuracy, setOsAccuracy] = useState(null);
  const [hostInfo, setHostInfo] = useState({ ip: '127.0.0.1', latency: null, uptime: null });

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanCompleted(false);
    
    let commandStr = "";
    if (scanType === 'host_discovery') commandStr = "nmap -sn 127.0.0.1";
    else if (scanType === 'basic_port') commandStr = "nmap -sS -T4 -p 22,80,443,21,23,3306,8080 127.0.0.1";
    else if (scanType === 'os_detect') commandStr = "nmap -O 127.0.0.1";
    else if (scanType === 'aggressive') commandStr = "nmap -A 127.0.0.1";

    setScanLogs([
      `Initializing scan sequence...`,
      `root@nmap-scanner:~# ${commandStr}`
    ]);
    
    setActivePortIndex(0); // Start animation
    setScanData([]);
    setOsDetails(null);
    setOsAccuracy(null);
    setHostInfo({ ip: '127.0.0.1', latency: null, uptime: null });
    
    const progressMessages = [
      "Sending probes...",
      "Awaiting response...",
      "Analyzing packets...",
      "Running scripts...",
      "Resolving signatures..."
    ];
    let msgIdx = 0;
    
    // Fake progress interval to keep terminal active while waiting for backend
    const progressInterval = setInterval(() => {
      setScanLogs(prev => [...prev, progressMessages[msgIdx % progressMessages.length]]);
      msgIdx++;
      setActivePortIndex(prev => (prev + 1) % 5); // Keep animation moving
    }, 2000);

    try {
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType })
      });

      if (!response.ok) {
        throw new Error('Scan failed or backend unreachable');
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setScanLogs(prev => [...prev, "Scan complete. Parsing results..."]);

      if (data.os) {
        setOsDetails(data.os);
        setOsAccuracy(data.osAccuracy);
        setScanLogs(prev => [...prev, `OS Detected: ${data.os}`]);
      }
      
      setHostInfo({
        ip: data.host || '127.0.0.1',
        latency: data.latency,
        uptime: data.uptime
      });

      const mappedPorts = (data.ports || []).map(p => {
        let value = 0;
        let color = '#6b7280';
        if (p.state === 'Open') { value = 3; color = '#22c55e'; }
        else if (p.state === 'Filtered') { value = 2; color = '#eab308'; }
        else if (p.state === 'Closed') { value = 1; color = '#ef4444'; }
        
        return {
          port: p.port.toString(),
          service: p.service,
          product: p.product,
          version: p.version,
          extrainfo: p.extrainfo,
          status: p.state,
          value,
          color
        };
      });

      setScanData(mappedPorts);
      setScanCompleted(true);
      setActivePortIndex(-1);
      setScanLogs(prev => [...prev, `Found ${mappedPorts.length} interesting ports.`]);

    } catch (err) {
      clearInterval(progressInterval);
      setScanLogs(prev => [...prev, `ERROR: ${err.message}`]);
      setActivePortIndex(-1);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-[#0A1128] min-h-screen">
      <SimulationSection 
        scanData={scanData} 
        isScanning={isScanning} 
        onRunScan={handleRunScan}
        scanLogs={scanLogs}
        activePortIndex={activePortIndex}
        scanType={scanType}
        setScanType={setScanType}
      />
      
      <ResultsSection 
        scanData={scanData} 
        showResults={scanCompleted || isScanning} 
        osDetails={osDetails} 
        osAccuracy={osAccuracy}
        hostInfo={hostInfo}
      />
    </div>
  )
}

export default App
