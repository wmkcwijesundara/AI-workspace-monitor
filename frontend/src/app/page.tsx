"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RamDiskData {
  percent: number;
  used: string | number;
  total: string | number;
}

interface ProcessData {
  name: string;
  pid: number;
  memory_percent: number;
}

interface HistoryData {
  time: string;
  usage: number;
}

export default function Home() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [ram, setRam] = useState<RamDiskData | null>(null);
  const [disk, setDisk] = useState<RamDiskData | null>(null);
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [cpuHistory, setCpuHistory] = useState<HistoryData[]>([]);

  const fetchData = async () => {
    try {
      const cpuRes = await fetch("http://localhost:5000/api/cpu");
      const cpuData = await cpuRes.json();

      const ramRes = await fetch("http://localhost:5000/api/ram");
      const ramData = await ramRes.json();

      const diskRes = await fetch("http://localhost:5000/api/disk");
      const diskData = await diskRes.json();

      const processRes = await fetch("http://localhost:5000/api/processes");
      const processData = await processRes.json();

      setCpu(cpuData.cpu_usage);
      setRam(ramData);
      setDisk(diskData);
      setProcesses(processData);

      setCpuHistory((prev) => {
        const updated = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            usage: cpuData.cpu_usage,
          },
        ];
        return updated.slice(-15); // Show slightly more data points for a smoother area chart
      });
    } catch (error) {
      console.error("Failed to fetch system data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    // The background is a very soft off-white/gray, just like the image
    <main className="min-h-screen bg-[#F8F9FA] text-slate-800 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header matching the top area of the image */}
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-2">
              System Resources Overview
            </p>
          </div>
          {/* Mock export button from the image */}
          <button className="hidden md:flex bg-[#0D9488] hover:bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Refresh Data
          </button>
        </header>

        {/* --- Metric Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* CPU Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/80">
            <h2 className="text-[15px] font-semibold text-slate-500 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              CPU Usage
            </h2>
            <div className="flex items-baseline gap-3">
              <p className="text-[32px] font-bold text-slate-800 tracking-tight">
                {cpu !== null ? `${cpu}%` : "--"}
              </p>
            </div>
          </div>

          {/* RAM Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/80">
            <h2 className="text-[15px] font-semibold text-slate-500 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              RAM Usage
            </h2>
            <div className="flex items-baseline gap-3">
              <p className="text-[32px] font-bold text-slate-800 tracking-tight">
                {ram ? `${ram.percent}%` : "--"}
              </p>
              <p className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded flex items-center gap-1">
                {ram ? `${ram.used} / ${ram.total} GB` : ""}
              </p>
            </div>
          </div>

          {/* Disk Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/80">
            <h2 className="text-[15px] font-semibold text-slate-500 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              Disk Storage
            </h2>
            <div className="flex items-baseline gap-3">
              <p className="text-[32px] font-bold text-slate-800 tracking-tight">
                {disk ? `${disk.percent}%` : "--"}
              </p>
              <p className="text-sm font-semibold text-slate-500">
                {disk ? `${disk.used} / ${disk.total} GB` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Area Chart Section --- */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/80 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[17px] font-bold text-slate-800">
                CPU Activity Over Time
              </h2>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      {/* Using the teal color from the image */}
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="time" 
                    hide 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' 
                    }}
                    itemStyle={{ color: '#0F172A', fontWeight: 700 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#0D9488" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#0D9488" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- Processes Section --- */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/80">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[17px] font-bold text-slate-800">
                Top Processes
              </h2>
            </div>
            
            <div className="space-y-1">
              {processes.length === 0 ? (
                <p className="text-sm font-medium text-slate-400 py-4">Loading...</p>
              ) : (
                processes.map((proc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">
                        {proc.name}
                      </p>
                      <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        PID: {proc.pid}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-[#0D9488]">
                        {proc.memory_percent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}