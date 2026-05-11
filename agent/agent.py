import time
import socket
import requests
import psutil
from datetime import datetime

SERVER_URL = "http://localhost:5000/api/report"

hostname = socket.gethostname()

while True:

    data = {
        "hostname": hostname,
        "cpu": psutil.cpu_percent(interval=1),
        "ram":psutil.virtual_memory().percent
        "last_seen": datetime.utcnow().isoformat()
    }

    try:
        response = requests.post(SERVER_URL, json=data)

        print("Sent:", data)

    except Exception as e:
        print("Error:", e)

    time.sleep(5)