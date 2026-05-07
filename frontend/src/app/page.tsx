"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [ram, setRam] = useState<any>(null);

  const fetchData = async () => {
    try {
      const cpuRes = await fetch("http://127.0.0.1:5000/api/cpu");
      const cpuData = await cpuRes.json();

      const ramRes = await fetch("http://127.0.0.1:5000/api/ram");
      const ramData = await ramRes.json();

      setCpu(cpuData.cpu_usage);
      setRam(ramData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        AI Workspace Monitor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            CPU Usage
          </h2>

          <p className="text-5xl font-bold text-green-400">
            {cpu !== null ? `${cpu}%` : "Loading..."}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            RAM Usage
          </h2>

          {ram ? (
            <>
              <p className="text-5xl font-bold text-blue-400 mb-2">
                {ram.percent}%
              </p>

              <p>
                {ram.used} GB / {ram.total} GB
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

      </div>
    </main>
  );
}