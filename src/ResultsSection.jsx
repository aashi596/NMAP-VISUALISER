import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.status === 'Unknown') return null;
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-white">
        <p className="font-bold text-lg mb-1">Port {data.port}</p>
        <p>Service: <span className="font-semibold text-blue-400">{data.service}</span></p>
        <p>Status: <span className="font-semibold" style={{ color: data.color }}>{data.status}</span></p>
      </div>
    );
  }
  return null;
};

const ThreeDBar = (props) => {
  const { fill, x, y, width, height } = props;
  const depth = 12; // 3D extrusion depth

  if (!height || height <= 0) return null;

  return (
    <g filter="drop-shadow(4px 10px 6px rgba(0,0,0,0.6))">
      {/* Front Face */}
      <path 
        d={`M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height} Z`} 
        fill={fill} 
        stroke="rgba(255,255,255,0.4)" 
        strokeWidth={1} 
      />
      {/* Top Face */}
      <path 
        d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} 
        fill={fill} 
        opacity={0.8}
        stroke="rgba(255,255,255,0.6)" 
        strokeWidth={1} 
      />
      {/* Right Side Face (darker to simulate shading) */}
      <path 
        d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} 
        fill={fill} 
        opacity={0.4}
        stroke="rgba(0,0,0,0.3)" 
        strokeWidth={1} 
      />
    </g>
  );
};

const ResultsSection = ({ scanData, showResults, osDetails, osAccuracy, hostInfo }) => {
  // Calculate dynamic data
  const { pieData, total, open, closed, filtered } = useMemo(() => {
    let o = 0, c = 0, f = 0, t = 0;
    scanData.forEach(p => {
      if (p.status !== 'Unknown') t++;
      if (p.status === 'Open') o++;
      if (p.status === 'Closed') c++;
      if (p.status === 'Filtered') f++;
    });
    
    const pData = [
      { name: 'Open', value: o, color: '#22c55e' },
      { name: 'Closed', value: c, color: '#ef4444' },
      { name: 'Filtered', value: f, color: '#eab308' },
    ].filter(item => item.value > 0); // Only show segments with > 0

    return { pieData: pData, total: t, open: o, closed: c, filtered: f };
  }, [scanData]);

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="w-full min-h-screen text-gray-100 py-16 px-6 sm:px-12 font-sans overflow-hidden relative">
      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12 border-b border-white/20 pb-6">
          <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
            Scan Results & Analysis
          </h2>
          <p className="text-white/70 text-lg">Visual breakdown of the target machine's port states.</p>
        </motion.div>

        {/* Summary Panel */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-white/10 transition-all">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Ports Scanned</h3>
            <p className="text-4xl font-bold text-white">{total} / {scanData.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-green-500/20 transition-all">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Open Ports</h3>
            <p className="text-4xl font-bold text-green-400">{open}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-red-500/20 transition-all">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Closed Ports</h3>
            <p className="text-4xl font-bold text-red-400">{closed}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-500/20 transition-all">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Filtered Ports</h3>
            <p className="text-4xl font-bold text-yellow-400">{filtered}</p>
          </div>
        </motion.div>

        {/* Port States Guide */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-green-400 shadow-lg">
            <h4 className="font-bold text-green-400 mb-1">Open</h4>
            <p className="text-sm text-white/70">Open ports can accept connections.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-red-400 shadow-lg">
            <h4 className="font-bold text-red-400 mb-1">Closed</h4>
            <p className="text-sm text-white/70">Closed ports reject connections.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-yellow-400 shadow-lg">
            <h4 className="font-bold text-yellow-400 mb-1">Filtered</h4>
            <p className="text-sm text-white/70">Filtered ports may be blocked by firewall.</p>
          </div>
        </motion.div>

        {/* Host Information Panel */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-blue-400 shadow-lg">
            <h4 className="font-bold text-blue-400 mb-1">Target IP</h4>
            <p className="text-xl text-white font-mono">{hostInfo?.ip || 'Unknown'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-purple-400 shadow-lg">
            <h4 className="font-bold text-purple-400 mb-1">Latency (SRTT)</h4>
            <p className="text-xl text-white font-mono">{hostInfo?.latency ? `${hostInfo.latency} ms` : 'N/A'}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 border-l-4 border-l-pink-400 shadow-lg">
            <h4 className="font-bold text-pink-400 mb-1">Last Boot / Uptime</h4>
            <p className="text-xl text-white font-mono">{hostInfo?.uptime ? new Date(hostInfo.uptime).toLocaleString() : 'N/A'}</p>
          </div>
        </motion.div>

        {/* OS Detection Panel */}
        {osDetails && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-white/10 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 border-l-4 border-l-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    OS Fingerprint Detected
                  </h3>
                  <p className="text-2xl font-mono text-white mt-2">{osDetails}</p>
                </div>
                {osAccuracy && (
                  <div className="text-right">
                    <p className="text-sm text-cyan-400/80 mb-1">Confidence</p>
                    <p className="text-3xl font-bold text-white">{osAccuracy}%</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <h3 className="text-xl font-bold text-gray-200 mb-6 relative z-10">Port Status Distribution</h3>
            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scanData}
                  margin={{ top: 35, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86efac" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#22c55e" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#14532d" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fca5a5" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#ef4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde047" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#eab308" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#713f12" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="port" 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    ticks={[1, 2, 3]}
                    domain={[0, 4]}
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(val) => {
                      if (val === 1) return 'Closed';
                      if (val === 2) return 'Filtered';
                      if (val === 3) return 'Open';
                      return '';
                    }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="value" shape={<ThreeDBar />} isAnimationActive={true} animationDuration={1000}>
                    {scanData.map((entry, index) => {
                      let fillGrad = "url(#colorGreen)";
                      if (entry.status === 'Closed') fillGrad = "url(#colorRed)";
                      if (entry.status === 'Filtered') fillGrad = "url(#colorYellow)";
                      return <Cell key={`cell-${index}`} fill={fillGrad} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden group">
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <h3 className="text-xl font-bold text-gray-200 mb-2 relative z-10">Overall Port States</h3>
            <div className="h-[350px] w-full flex-grow flex items-center justify-center relative z-10">
              {total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="pieShadow" x="-20%" y="-20%" width="150%" height="150%">
                        <feDropShadow dx="15" dy="25" stdDeviation="15" floodColor="#000000" floodOpacity="0.8"/>
                        <feDropShadow dx="3" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.6"/>
                      </filter>
                      <radialGradient id="pieGreen" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#86efac" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#14532d" stopOpacity={1}/>
                      </radialGradient>
                      <radialGradient id="pieRed" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fca5a5" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity={1}/>
                      </radialGradient>
                      <radialGradient id="pieYellow" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fde047" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#713f12" stopOpacity={1}/>
                      </radialGradient>
                    </defs>
                    <g filter="url(#pieShadow)">
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={1}
                        isAnimationActive={true}
                        animationDuration={800}
                      >
                        {pieData.map((entry, index) => {
                          let fillGrad = "url(#pieGreen)";
                          if (entry.name === 'Closed') fillGrad = "url(#pieRed)";
                          if (entry.name === 'Filtered') fillGrad = "url(#pieYellow)";
                          return <Cell key={`cell-${index}`} fill={fillGrad} />;
                        })}
                      </Pie>
                    </g>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#E5E7EB' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-gray-300 font-medium ml-1 drop-shadow-md">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 italic flex items-center justify-center h-full">
                  Run the scan to see the distribution
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Port Details Table */}
        <motion.div variants={itemVariants} className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
          <h3 className="text-xl font-bold text-gray-200 mb-6 relative z-10">Detailed Port Analysis</h3>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Port</th>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Version / Product</th>
                  <th className="px-6 py-4 rounded-tr-lg">Extra Info</th>
                </tr>
              </thead>
              <tbody>
                {scanData.map((portInfo, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-white font-bold">{portInfo.port}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: portInfo.color }}>{portInfo.status}</td>
                    <td className="px-6 py-4 text-cyan-300 font-mono">{portInfo.service}</td>
                    <td className="px-6 py-4 text-gray-200">
                      {portInfo.product || portInfo.version ? (
                        <>
                          <span className="font-semibold text-white">{portInfo.product}</span>
                          {portInfo.version && <span className="ml-2 text-gray-400">{portInfo.version}</span>}
                        </>
                      ) : (
                        <span className="text-gray-500 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 italic">
                      {portInfo.extrainfo || '-'}
                    </td>
                  </tr>
                ))}
                {scanData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No ports discovered or scan not completed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default ResultsSection;

