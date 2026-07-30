# Employee Management System

A full-stack employee management web application, deployed on a self-hosted Kubernetes cluster with authentication, role-based write access, and live infrastructure monitoring.

Anyone can view the employee directory; only authenticated users can add, update, or delete records.

---

## Features

- 📋 View, add, update, and delete employee records
- 🏢 Filter employees by department (Engineering, Sales, HR, Finance, Marketing, IT, DevOps, Systems, AI/ML)
- 🕒 Automatic creation date/time tracking for every employee record
- 🔐 JWT-based authentication with named user accounts
- 👀 Public read access — anyone can browse the employee list
- ✍️ Protected write access — only logged-in users can add/update/delete
- 📊 Live Grafana monitoring dashboard (CPU, memory, restarts) for all services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt |
| Containers | Docker / Podman |
| Orchestration | Kubernetes (kubeadm, containerd) |
| Ingress | nginx Ingress Controller |
| Monitoring | Prometheus + Grafana (kube-prometheus-stack) |

---

## Project Structure

tree
Deployed across a 3-node Kubernetes cluster:
---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/employees` | No | List all employees |
| GET | `/api/employees/:id` | No | Get one employee |
| POST | `/api/employees` | **Yes** | Create employee |
| PUT | `/api/employees/:id` | **Yes** | Update employee |
| DELETE | `/api/employees/:id` | **Yes** | Delete employee |

Protected endpoints require an `Authorization: Bearer <token>` header, obtained from `/api/auth/login`.

---

## Environment Variables

Backend (`backend-secret` in Kubernetes, or `.env` locally):
---

## Local Development

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment (Kubernetes)

```bash
kubectl apply -f kubernetes/
```

Building and deploying updated images (local registry-free workflow used in this project):

```bash
# Backend
docker build -t <registry-or-local>/employee-backend:<tag> ./backend
kubectl set image deployment/backend backend=<registry-or-local>/employee-backend:<tag> -n employee-system

# Frontend
docker build -t <registry-or-local>/employee-frontend:<tag> ./frontend
kubectl set image deployment/frontend frontend=<registry-or-local>/employee-frontend:<tag> -n employee-system
```

---

## Default Seeded Users

Set in `backend/prisma/seed.js` — **change these before deploying to production**:

| Username | Notes |
|---|---|
| `admin` | Full access |
| `anis` | Full access |
| `inara` | Full access |

> ⚠️ Passwords should be moved to environment variables rather than hardcoded in `seed.js` before any public/production use.

---

## Monitoring

A Grafana dashboard (`employee-system-dashboard`) tracks CPU usage, memory usage, restart counts, and pod status for all services in the `employee-system` namespace. It auto-imports via the existing kube-prometheus-stack sidecar.

---

## License

This project is for internal/educational use.
