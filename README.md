# Incident Analytics Dashboard

A full-stack incident management and analytics dashboard designed to monitor, analyze, and manage incidents in real time.

This project was built as a **portfolio and learning project** to demonstrate modern full-stack development, clean architecture, and data visualization using real-world incident workflows.

---

## Overview

The Incident Analytics Dashboard allows users to:
- Create and manage incidents
- Track incident status throughout its lifecycle
- Analyze risk levels and trends visually
- View real-time analytics through charts and dashboards

The system follows a clean separation between frontend and backend, similar to real internal tools used in engineering and operations teams.

---

## Key Features

### Analytics & Monitoring
- Live KPI metrics (Total incidents, High/Medium/Low risk, Resolved)
- Risk summary visualization
- 14-day incident trend chart
- Status, severity, and type breakdown charts
- Auto-refresh every 30 seconds

### Incident Management
- Create incidents with validation
- Incident lifecycle:
  - **OPEN → ACKNOWLEDGED → RESOLVED**
- Action buttons to acknowledge and resolve incidents
- Sortable and filterable incident table
- Card-based incident view for quick actions

### UI & Experience
- Modern dashboard-style layout
- Glassmorphism design elements
- Dark mode support
- Smooth animations and transitions
- Toast notifications for user feedback
- Fully responsive (desktop, tablet, mobile)

---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- RESTful API
- Service-layer architecture
- CORS configuration
- In-memory data storage (database-ready)

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- Recharts (charts & graphs)
- Lucide React (icons)
- Modern ES6+ JavaScript

---

## Architecture

The project follows a layered architecture:

- **Frontend (React)** communicates with the backend via REST APIs
- **Controllers** handle HTTP requests
- **Services** contain business logic and analytics calculations
- **Models / DTOs** define data structures
- Analytics and risk calculations are handled server-side

An architecture diagram is included in the `/docs` folder.

---

## API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/incidents` | Retrieve all incidents |
| POST | `/api/incidents` | Create a new incident |
| PATCH | `/api/incidents/{id}/status` | Update incident status |
| GET | `/api/insights/risk-summary` | Risk analytics summary |
| GET | `/api/health` | Application health check |

---

## Risk Calculation

riskScore = severity × 20


- High Risk: ≥ 80  
- Medium Risk: ≥ 40  
- Low Risk: < 40  

A basic conditional rules structure is implemented and can be extended for automation and escalation logic.

---

## Running the Project

### Backend
```bash
cd backend/incidenthub
mvn spring-boot:run

Runs on:
http://localhost:8080

Frontend

cd frontend
npm install
npm run dev

Runs on:
http://localhost:5173



Future Improvements

Database integration (PostgreSQL / MongoDB)

Authentication and user roles

Webhook or Slack integrations

Automated escalation rules

Containerization and cloud deployment

What This Project Demonstrates

Full-stack development with Java and React

REST API design and integration

Data visualization and dashboards

State management and real-time UI updates

Clean code organization and architecture

Modern UI/UX practices



