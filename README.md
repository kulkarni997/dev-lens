# DevLens

AI-powered GitHub Pull Request reviews using Google Gemini.

DevLens automatically reviews code changes whenever a Pull Request is opened or updated. It analyzes the diff, identifies potential bugs, and posts actionable feedback directly on GitHub.

## Features

- GitHub OAuth authentication
- Connect GitHub repositories
- Automatic PR review through webhooks
- AI-powered code analysis using Gemini Flash
- Review comments posted directly to GitHub
- Background processing with BullMQ and Redis
- MongoDB Atlas persistence
- Review history dashboard
- Grafana Cloud observability
- Dockerized development setup

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Redis
- BullMQ
- GitHub OAuth
- GitHub Webhooks
- Google Gemini API

### Monitoring

- Grafana Cloud
- Grafana Alloy
- Prometheus metrics

## How It Works

```text
GitHub Pull Request
        ↓
GitHub Webhook
        ↓
Express Backend
        ↓
BullMQ + Redis Queue
        ↓
Review Worker
        ↓
Gemini AI Analysis
        ↓
Review Comment on GitHub
        ↓
MongoDB + Dashboard