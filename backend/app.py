from flask import Flask
from flask_cors import CORS
import psutil

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)