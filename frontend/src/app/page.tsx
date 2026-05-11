"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

interface AgentData {
  hostname: string;
  cpu: number;
  ram: number;
  last_seen: string;
}

export default function Home() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [ram, setRam] = useState<RamDiskData | null>(null);
  const [disk, setDisk] = useState<RamDiskData | null>(null);
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [cpuHistory, setCpuHistory] = useState<HistoryData[]>([]);
  const [agents, setAgents] = useState<AgentData[]>([]);

  const fetchData = async () => {
    try {
      const cpuRes = await fetch(`${API_URL}/api/cpu`);
      const cpuData = await cpuRes.json();

      const ramRes = await fetch(`${API_URL}/api/ram`);
      const ramData = await ramRes.json();

      const diskRes = await fetch(`${API_URL}/api/disk`);
      const diskData = await diskRes.json();

      const processRes = await fetch(`${API_URL}/api/processes`);
      const processData = await processRes.json();

      const agentsRes = await fetch(`${API_URL}/api/agents`);
      const agentsData = await agentsRes.json();

      setCpu(cpuData.cpu_usage);
      setRam(ramData);
      setDisk(diskData);
      setProcesses(processData);
      setAgents(agentsData.agents);

      setCpuHistory((prev) => {
        const updated = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            usage: cpuData.cpu_usage,
          },
        ];

        return updated.slice(-15);
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
    <main className="min-h-screen bg-[#0B1020] text-white p-8 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-10 flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              AI Workspace Monitor
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Distributed Infrastructure Monitoring Dashboard
            </p>
          </div>

          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-500 transition-all px-5 py-3 rounded-2xl text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            Refresh Data
          </button>

        </header>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* CPU */}
          <div className="bg-[#121A2B] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">

            <p className="text-slate-400 text-sm mb-4">
              CPU Usage
            </p>

            <h2 className="text-5xl font-bold text-blue-400">
              {cpu !== null ? `${cpu}%` : "--"}
            </h2>

          </div>

          {/* RAM */}
          <div className="bg-[#121A2B] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">

            <p className="text-slate-400 text-sm mb-4">
              RAM Usage
            </p>

            <h2 className="text-5xl font-bold text-cyan-400">
              {ram ? `${ram.percent}%` : "--"}
            </h2>

            <p className="text-slate-400 mt-4 text-sm">
              {ram ? `${ram.used} GB / ${ram.total} GB` : ""}
            </p>

          </div>

          {/* DISK */}
          <div className="bg-[#121A2B] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">

            <p className="text-slate-400 text-sm mb-4">
              Disk Usage
            </p>

            <h2 className="text-5xl font-bold text-indigo-400">
              {disk ? `${disk.percent}%` : "--"}
            </h2>

            <p className="text-slate-400 mt-4 text-sm">
              {disk ? `${disk.used} GB / ${disk.total} GB` : ""}
            </p>

          </div>

        </div>

        {/* CONNECTED AGENTS */}
        <div className="bg-[#121A2B] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/20 mb-8">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Connected Agents
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Live infrastructure monitoring nodes
              </p>
            </div>

            <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              {agents.length} Active
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {agents.map((agent, index) => (

              <div
                key={index}
                className="bg-[#172036] rounded-3xl border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300"
              >

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h3 className="text-xl font-semibold">
                      {agent.hostname}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Monitoring Agent
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                    Last Seen: {new Date(agent.last_seen).toLocaleTimeString()}
                  </p>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">

                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>

                    Online

                  </div>

                </div>

                <div className="space-y-5">

                  {/* CPU */}
                  <div>

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-400">
                        CPU Usage
                      </span>

                      <span className="text-blue-400 font-semibold">
                        {agent.cpu}%
                      </span>

                    </div>

                    <div className="w-full bg-[#0B1020] rounded-full h-2">

                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${agent.cpu}%` }}
                      ></div>

                    </div>

                  </div>

                  {/* RAM */}
                  <div>

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-slate-400">
                        RAM Usage
                      </span>

                      <span className="text-cyan-400 font-semibold">
                        {agent.ram}%
                      </span>

                    </div>

                    <div className="w-full bg-[#0B1020] rounded-full h-2">

                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${agent.ram}%` }}
                      ></div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CHART + PROCESSES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART */}
          <div className="lg:col-span-2 bg-[#121A2B] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                CPU Activity
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Real-time system performance
              </p>

            </div>

            <div className="h-[320px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={cpuHistory}>

                  <defs>

                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">

                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>

                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E293B"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#172036",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "16px",
                      color: "white",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#cpuGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* PROCESSES */}
          <div className="bg-[#121A2B] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/20">

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Top Processes
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Highest memory usage
              </p>

            </div>

            <div className="space-y-4">

              {processes.map((proc, index) => (

                <div
                  key={index}
                  className="bg-[#172036] rounded-2xl p-4 border border-white/5"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-semibold text-white">
                        {proc.name}
                      </p>

                      <p className="text-slate-400 text-xs mt-1">
                        PID: {proc.pid}
                      </p>

                    </div>

                    <div className="text-blue-400 font-bold text-lg">
                      {proc.memory_percent.toFixed(1)}%
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}