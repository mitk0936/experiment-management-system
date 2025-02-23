# Experiment Management System

## Project Overview

This is a **Full-Stack Experiment Management System** built with:

- **Next.js 15** (React framework)
- **Node.js 22** (Backend API & authentication)
- **Cloud Firestore** (Database (local emulator), running in a Docker container)
- **ShadCN + Tailwind CSS** (UI components & styling)
- **NextAuth.js** (User authentication)

This application allows users to:

- Register and log in
- Create, update, and delete experiments
- Attach research files (CSV) to experiments
- Search and filter experiments

---

## Getting Started

### **Clone the Repository**

```sh
git clone git@github.com:mitk0936/experiment-management-system.git
cd experiment-management-system
```

## Running the Project with Docker

This project is fully **Dockerized**, meaning you can run everything in isolated containers.

### **Start the Containers**

```sh
docker-compose up --build --remove-orphans
```

If you encounter issues, ensure that no other processes are using ports 3000 or 9999 on your machine. Additionally, stop any previously running Docker Compose instances before restarting:

```sh
docker-compose down
docker-compose up --build
```

**This will:**

- Run the Next.js app in a container (`http://localhost:3000`)
- Start a Firestore emulator in a separate container (`http://localhost:9999`)

### **Stop Containers**

```sh
docker-compose down
```

---

## Development Process

For dev purposes (running a dev server) you will need Node 22 installed (npm 10)

### **Install dependencies**

```sh
npm ci
```

### **Run the Development Server**

```sh
npm run dev
```

The dev command will also run a CloudFirestore DB emulator (see docker-compose.dev.yml)

The app will be available at `http://localhost:3000`
