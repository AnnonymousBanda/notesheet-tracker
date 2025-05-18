
# Notesheet Tracker

This project manages and tracks payment bills passed by the PIC (Payment In Charge) for various clubs. It supports three types of notesheet templates:

1. **Reimbursement**: Used to request compensation for personal expenses incurred during an event. For example, if a club member spent their own money on an event, they can request reimbursement for the amount spent.  
2. **Disbursement**: Used to request advance money for an upcoming event. This helps in getting funds before the event takes place.  
3. **Settlement**: Used for settling all bills and expenses related to an event after it has concluded. This template helps in ensuring that all payments and dues are cleared.

Once a notesheet is created, it goes through a series of approvals from different authorities in a predefined sequence. For example, a reimbursement notesheet will first be submitted to the General Secretary (GenSec), followed by the Vice President Gymkhana (VPG), then to the President Gymkhana, followed by the Payment In Charge (PIC), and finally the Assistant Dean (ADean). The notesheet is approved only after all necessary approvals are granted.

---

## Prerequisites

- Docker version 27.0.3 or above  
- Docker Compose version v2.28.1 or above

You can verify your versions by running:

```bash
docker -v
docker-compose -v
```

---

## Development Setup with Docker

This project uses Docker Compose for easy containerized development of both client and server.

To start the development environment, run this command at the root directory of the project:

```bash
docker compose up --build
```

This command will:

- Build the Docker images for both client and server based on their Dockerfiles.  
- Start containers for client (on port 3000) and server (on port 8000).  
- Sync your local code changes into the containers automatically, enabling live development.

---

## Continuous Development Setup with Docker Compose

The `docker-compose.yml` uses develop.watch to watch for changes in the codebase and automatically rebuild the containers. This allows you to see your changes reflected in real-time without needing to restart the containers manually.

To run the development environment with hot reloading, use the following command:

```bash
docker compose watch
```

## Accessing the Application

- Client UI: [http://localhost:3000](http://localhost:3000)  
- API Server: [http://localhost:8000](http://localhost:8000)

---

## Stopping the Development Environment

To stop and remove the containers, press `Ctrl + C` in the terminal running Docker Compose, then run:

```bash
docker compose down
```

---

If you want to run client or server separately via Docker, you can extend the Docker Compose or run individual Docker commands — but for development, `docker compose up` is recommended for simplicity.

---
