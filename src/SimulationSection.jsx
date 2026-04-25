import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Terminal = ({ logs }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white/10 border border-white/20 rounded-lg p-4 font-mono text-sm sm:text-base shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-3">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-500 text-xs ml-2 font-bold tracking-wider">TERMINAL / root@nmap-scanner:~</span>
      </div>
      <div ref={containerRef} className="h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-2 scroll-smooth">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-400 flex"
          >
            <span className="text-blue-500 mr-3 select-none">{'>_'}</span>
            <span className="break-words w-full">{log}</span>
          </motion.div>
        ))}
        <div className="h-6 flex items-center mt-1">
          <span className="text-blue-500 mr-3 select-none">{'>_'}</span>
          <motion.div 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="w-2.5 h-5 bg-green-400"
          />
        </div>
      </div>
    </div>
  );
};

const ProbeAnimation = ({ activePortIndex }) => {
  if (activePortIndex < 0) return null;

  // Generate an array of particles to create a "burst" effect
  const particles = Array.from({ length: 8 });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={`${activePortIndex}-${i}`}
          initial={{ x: -180, y: (Math.random() - 0.5) * 60, opacity: 0, scale: 0.5 }}
          animate={{ x: 180, y: (Math.random() - 0.5) * 30, opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.2, 0.5] }}
          transition={{ 
            duration: 0.4 + Math.random() * 0.2, 
            delay: i * 0.05, 
            ease: "easeIn" 
          }}
          className="absolute w-4 h-1 bg-cyan-400 rounded-full"
          style={{
            boxShadow: '0 0 12px 3px rgba(34, 211, 238, 0.9), -15px 0 15px 2px rgba(34, 211, 238, 0.4)'
          }}
        />
      ))}
    </div>
  );
};



const SimulationSection = ({ scanData, isScanning, onRunScan, scanLogs = [], activePortIndex = -1, scanType, setScanType }) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-8 overflow-hidden border-b border-white/10">
      
      {/* Background CSS grid / Network Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Ambient center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="z-10 max-w-7xl w-full flex flex-col items-center">
        
        <div className="mb-16 text-center relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 blur-md"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            Live Scan Simulation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            Observe the digital interaction between the attacker system and the target machine in real-time.
          </p>
        </div>

        {/* 3D Scene Container */}
        <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 mb-10">
          
          {/* Attacker Laptop */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full md:w-[35%] flex flex-col items-center"
          >
            <div className="relative group">
              {/* Subtle screen glow on background */}
              <div className="absolute inset-0 bg-green-500/10 blur-[60px] rounded-full transition-opacity duration-1000 group-hover:bg-green-500/20" />
              <img 
                src="/attacker-laptop.png" 
                alt="Attacker Laptop" 
                className="relative z-10 w-full max-w-[400px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] object-contain mix-blend-screen"
                style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 90%)' }}
              />
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-cyan-400 font-bold text-xl uppercase tracking-[0.2em] font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Attacker</h3>
            </div>
          </motion.div>

          {/* Center Action Area */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full md:w-[30%] min-h-[150px] gap-4">
            {/* Signal Animations Background Layer */}
            {isScanning && <ProbeAnimation activePortIndex={activePortIndex} />}

            <select 
              value={scanType} 
              onChange={(e) => setScanType(e.target.value)}
              disabled={isScanning}
              className="relative z-30 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-mono rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3 outline-none cursor-pointer shadow-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="host_discovery" className="bg-[#0A1128]">Host Discovery (-sn)</option>
              <option value="basic_port" className="bg-[#0A1128]">Basic Port Scan (-sS -p)</option>
              <option value="os_detect" className="bg-[#0A1128]">OS Detection (-O)</option>
              <option value="aggressive" className="bg-[#0A1128]">Aggressive Scan (-A)</option>
            </select>

            <button
              onClick={onRunScan}
              disabled={isScanning}
              className={`relative z-30 px-10 py-4 rounded-xl font-bold text-lg text-white uppercase tracking-widest transition-all duration-300 overflow-hidden group ${
                isScanning 
                  ? 'bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-500 shadow-inner' 
                  : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-cyan-600 hover:to-blue-500 hover:-translate-y-1 border border-blue-400/30 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)]'
              }`}
            >
              {isScanning ? (
                <span className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  Scanning...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Run Scan
                </span>
              )}
            </button>
            
            <div className="mt-2 text-center w-full">
              <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-gray-300 text-xs font-mono">Target: 127.0.0.1 (Local Loopback)</p>
              </span>
            </div>
          </div>

          {/* Victim Laptop */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative w-full md:w-[35%] flex flex-col items-center"
          >
            <div className="relative group">
              {/* Subtle screen glow on background */}
              <div className="absolute inset-0 bg-blue-400/5 blur-[60px] rounded-full transition-opacity duration-1000 group-hover:bg-blue-400/15" />
              <img 
                src="/victim-laptop.png" 
                alt="Victim Laptop" 
                className="relative z-10 w-full max-w-[400px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] object-contain mix-blend-screen"
                style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 90%)' }}
              />
              
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-gray-100 font-bold text-xl uppercase tracking-[0.2em] font-mono">Target Network</h3>
            </div>
          </motion.div>

        </div>

        {/* Terminal Status Bar */}
        <Terminal logs={scanLogs} />

      </div>
    </section>
  );
};

export default SimulationSection;
