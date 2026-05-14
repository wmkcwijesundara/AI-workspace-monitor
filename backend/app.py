from flask import Flask, request
from flask_cors import CORS
import psutil
import time

app = Flask(__name__)
CORS(app)
reported_metrics = {}

@app.route('/api/cpu')
def cpu_usage():
    return {
        "cpu_usage": psutil.cpu_percent(interval=1)
    }

@app.route('/api/ram')
def ram_usage():
    memory = psutil.virtual_memory()

    return {
        "total": round(memory.total / (1024 ** 3), 2),
        "used": round(memory.used / (1024 ** 3), 2),
        "percent": memory.percent
    }

@app.route('/api/disk')
def disk_usage():
    disk = psutil.disk_usage('/')

    return {
        "total": round(disk.total / (1024 ** 3), 2),
        "used": round(disk.used / (1024 ** 3), 2),
        "percent": disk.percent
    }

@app.route('/api/processes')
def top_processes():
    processes = []

    for proc in psutil.process_iter(['pid', 'name', 'memory_percent']):
        try:
            processes.append(proc.info)
        except:
            pass

    processes = sorted(
        processes,
        key=lambda x: x['memory_percent'],
        reverse=True
    )

    return processes[:5]


@app.route('/api/report', methods=['POST'])
def receive_report():

    data = request.json

    hostname = data.get("hostname")

    reported_metrics[hostname] = data

    return {
        "status": "received"
    }


@app.route('/api/agents')
def get_agents():

    return {
        "agents": list(reported_metrics.values())
    }

@app.route('/api/uptime')
def uptime():

    uptime_seconds = time.time() - psutil.boot_time()

    hours = int(uptime_seconds // 3600)
    minutes = int((uptime_seconds % 3600) // 60)

    return {
        "uptime": f"{hours}h {minutes}m"
    }

@app.route('/api/ai-workspace')
def ai_workspace():

    ai_keywords = [
        "chrome",
        "cursor",
        "ollama",
        "lmstudio",
        "code"
    ]

    detected = []

    for proc in psutil.process_iter(['name', 'memory_percent']):

        try:

            name = proc.info['name']

            if not name:
                continue

            lower_name = name.lower()

            for keyword in ai_keywords:

                if keyword in lower_name:

                    detected.append({
                        "name": name,
                        "memory": round(proc.info['memory_percent'], 2)
                    })

                    break

        except:
            pass

    return {
        "tools": detected
    }

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)