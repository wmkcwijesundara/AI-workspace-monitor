# AI Workspace Monitor

A modern full-stack system monitoring dashboard built with Next.js, Flask, Docker, and Linux system metrics.

This project provides real-time monitoring of:
- CPU usage
- RAM usage
- Disk usage
- Running system processes

The application is fully containerized using Docker and designed with a scalable frontend/backend architecture inspired by real-world infrastructure monitoring systems.

---

# Features

- Real-time CPU monitoring
- Live RAM usage tracking
- Disk storage analytics
- Top process monitoring
- Interactive charts and visualizations
- Responsive dashboard UI
- REST API backend
- Dockerized frontend and backend
- Linux system metrics integration using psutil
- Modern UI built with Tailwind CSS
- Full-stack architecture using Next.js + Flask

---

# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

## Backend
- Python
- Flask
- Flask-CORS
- psutil

## DevOps / Infrastructure
- Docker
- Docker Compose
- GitHub
- Linux (Ubuntu)

---

# Architecture

```text
+----------------------+
|   Next.js Frontend   |
|   Dashboard UI       |
+----------+-----------+
           |
        REST API
           |
+----------v-----------+
|   Flask Backend API  |
+----------+-----------+
           |
     Linux System
        Metrics
           |
         psutil
```

---

# Project Structure

```text
AI-workspace-monitor/
│
├── frontend/                 # Next.js frontend
├── backend/                  # Flask backend
├── scripts/                  # Shell scripts
├── .github/workflows/        # CI/CD workflows
├── docker-compose.yml
└── README.md
```

---

# Running Locally

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-workspace-monitor.git

cd AI-workspace-monitor
```

---

# Run with Docker

```bash
docker compose up --build
```

Frontend:
```text
http://localhost:3000
```

Backend API:
```text
http://localhost:5000
```

---

# API Endpoints

| Endpoint | Description |
|---|---|
| `/api/cpu` | CPU usage statistics |
| `/api/ram` | RAM usage information |
| `/api/disk` | Disk usage information |
| `/api/processes` | Top running processes |

---

# Future Improvements

- Browser extension integration
- Historical metrics database
- System alerts and notifications
- AI workload optimization
- User authentication
- Prometheus/Grafana integration
- Kubernetes deployment
- Real-time WebSocket updates

---

# Learning Goals

This project was built to explore:
- Full-stack development
- Linux system monitoring
- REST APIs
- Docker containerization
- Infrastructure monitoring concepts
- Frontend/backend architecture
- DevOps workflows

---

# Author

Kavindu Chelaka

Computer Networking Undergraduate
