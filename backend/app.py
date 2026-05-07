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

if __name__ == '__main__':
    app.run(debug=True)