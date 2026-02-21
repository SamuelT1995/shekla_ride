# Shekla Ride | Premium Car Rental Marketplace

This is a full-stack PERN (PostgreSQL, Express, React, Node.js) application refactored with Tailwind CSS.

## 🚀 How to Run the Project

### 1. Database Setup
The backend uses Prisma with PostgreSQL.
- Navigate to the `backend` directory.
- Ensure your `.env` file has the correct `DATABASE_URL`.
- Run:
  ```bash
  npm install
  npx prisma generate
  npx prisma db push
  ```

### 2. Start the Backend
- Inside the `backend` directory:
  ```bash
  npm run dev
  ```
- The server will run on `http://localhost:5000`.

### 3. Start the Frontend
- Navigate to the `frontend` directory.
- Run:
  ```bash
  npm install
  npm run dev
  ```
- The website will be available at `http://localhost:5173`.

---

## 🛠️ Key Commands Summary

| Directory | Task | Command |
| :--- | :--- | :--- |
| **Backend** | Dependency Install | `npm install` |
| **Backend** | DB Synchronization | `npx prisma db push` |
| **Backend** | Run Dev Server | `npm run dev` |
| **Frontend** | Dependency Install | `npm install` |
| **Frontend** | Run Dev Server | `npm run dev` |

## 🔑 Default Accounts (If seeded)
- **Admin Console:** Requires a user with `role: 'ADMIN'`.
- **Owner Dashboard:** Requires a user with `role: 'OWNER'`.
- **Renter View:** Any verified `USER` role account.

Enjoy the ride! 🚗✨
