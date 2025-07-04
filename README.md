# 🐱 Cat Fact Tracker

A fun and interactive **Cat Facts Tracker** built with **React (frontend)** and **FastAPI (backend)**, featuring playful choices, random cat facts, editing capabilities, and a mini-game. Designed for both entertainment and a practical showcase of full-stack development.

---

## 🚀 Project Overview

1. **Landing Page `/`**

   * The journey starts with **Yes**, **No**, and **Maybe** options.

2. **No → `/game`**

   * Takes you to a **"Catch the Paw" mini-game** where you click the cat paw 5 times. It’s a playful nudge to get you to pick **Yes** eventually.

3. **Maybe → `/random-fact`**

   * Shows a **Random Cat Fact** fetched from a **third-party Cat Facts API**. You can explore without commitment.

4. **Yes → `/tracker`**

   * The heart of the app:

     * View **5 random cat facts**.
     * **Add** new facts.
     * **Edit** or **Delete** existing facts.
     * **Like** facts and view your liked facts at `/likes`.
     * **Unlike** facts from the `/likes` page.
     * Export all facts to a **CSV file** with a filename of your choice.

5. **Liked Facts `/likes`**

   * View and manage your liked cat facts.

---

## ⚙️ Tech Stack

* **Frontend:** React, React Router, Lottie Animations, Styled with CSS
* **Backend:** FastAPI (Python), SQLite, Redis (for caching)
* **Dockerized** with **Docker Compose** for easy setup.

---

## 🛠 How to Run Locally

### 1️⃣ Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm start
```

### 🌐 Environment Variables

If running the project locally (without Docker), create a `.env` file inside `/frontend`:

---

## 🐳 Running with Docker (Recommended)

If you want to skip manual setup, use **Docker Compose**:

```bash
docker-compose up --build
```

---

## ✅ Features Summary

| Feature      | Path           | Description                                |
| ------------ | -------------- | ------------------------------------------ |
| Landing Page | `/`            | Choose Yes, No, Maybe                      |
| Game         | `/game`        | Play “Catch the Paw” (click 5 times)       |
| Random Fact  | `/random-fact` | View random cat facts from third-party API |
| Fact Tracker | `/tracker`     | Add, edit, delete, like, export facts      |
| Liked Facts  | `/likes`       | See and manage liked cat facts             |

---

## 📂 Folder Structure

```
/backend       → FastAPI backend
/frontend      → React frontend
docker-compose.yml
```

---

## 💡 Notes

* The **likes** are stored in the backend and can be unliked.
* CSV export works from the `/tracker` page.
* All routes are easily accessible via the navigation choices.
