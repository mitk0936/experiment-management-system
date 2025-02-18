# Experiment Management System

## 📌 Project Overview

This is a **Full-Stack Experiment Management System** built with:

- **Next.js 15** (React framework)
- **Node.js 22** (Backend API & authentication)
- **Cloud Firestore** (Database, running in a Docker container)
- **ShadCN + Tailwind CSS** (UI components & styling)
- **NextAuth.js** (User authentication)

This application allows users to:

- Register and log in
- Create, update, and delete experiments
- Attach research files to experiments
- Search and filter experiments
- View data visualizations (Optional Feature)

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**

```sh
git clone <your-repo-url>
cd <your-project-folder>
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file in the root folder and add:

```
NEXTAUTH_SECRET=<your-nextauth-secret>
FIRESTORE_EMULATOR_HOST=firestore:8080
GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-service-account.json
```

---

## 🐳 Running the Project with Docker

This project is fully **Dockerized**, meaning you can run everything in isolated containers.

### **4️⃣ Start the Containers**

```sh
docker-compose up --build
```

**This will:**

- Run the Next.js app in a container (`http://localhost:8080`)
- Start a Firestore emulator in a separate container (`http://localhost:8081`)

### **5️⃣ Stop Containers**

```sh
docker-compose down
```

---

## ✨ Adding ShadCN Components

This project uses **ShadCN** for UI components.

### **Install ShadCN CLI (If Not Installed)**

```sh
npx shadcn-ui@latest init
```

### **Adding a New Component**

Example: Adding a **Button** component

```sh
npx shadcn-ui@latest add button
```

This will:

- Generate a reusable `<Button />` component inside `components/ui/`
- Apply Tailwind-based styling

### **Other Available Components**

To see a list of available components:

```sh
npx shadcn-ui@latest add
```

---

## 🔥 Running the Project Locally (Without Docker)

If you prefer running the project locally instead of using Docker:

### **1️⃣ Start Firestore Emulator**

```sh
gcloud beta emulators firestore start --host-port=localhost:8081
```

### **2️⃣ Run the Development Server**

```sh
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🔀 Git Workflow

Follow this structured Git workflow:

1. **Create a feature branch:**

   ```sh
   git checkout -b feature/authentication
   ```

2. **Commit your changes:**

   ```sh
   git add .
   git commit -m "Added authentication system"
   ```

3. **Push the feature branch:**

   ```sh
   git push origin feature/authentication
   ```

4. **Merge into `dev`:**

   ```sh
   git checkout dev
   git merge feature/authentication --no-ff
   git push origin dev
   ```

5. **Once tested, merge `dev` into `main`:**
   ```sh
   git checkout main
   git merge dev --no-ff
   git push origin main
   ```

---

## 🛠 Tech Stack

| Technology          | Purpose                   |
| ------------------- | ------------------------- |
| **Next.js 15**      | Frontend & API Routes     |
| **Node.js 22**      | Backend server            |
| **Cloud Firestore** | Database                  |
| **Docker**          | Containerized environment |
| **ShadCN**          | UI components             |
| **NextAuth.js**     | Authentication            |
| **Tailwind CSS**    | Styling                   |
| **React Query**     | State management          |

---

## 📄 License

This project is licensed under **MIT License**.

---

## 🎯 To-Do List

- [ ] Implement experiment CRUD operations
- [ ] Add file upload support
- [ ] Implement search & filtering
- [ ] Set up data visualization
- [ ] Write tests

🚀 Happy coding!
