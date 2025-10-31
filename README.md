# 🧠 MASTER — AI Study Assistant Chrome Extension

> **Learn Smarter. Create Faster. Visualize Better.**


---

## 🚀 Overview

**MASTER** is an AI-powered Chrome Extension that transforms any webpage into personalized learning material.
It helps students generate **summaries**, **notes**, **flashcards**, **quizzes**, and **visualizations** — all in one click.
Additionally, it includes a **Create Section** that assists in generating essays, research summaries, lab reports, and case studies using intelligent templates.

Built for students, researchers, and lifelong learners — MASTER makes studying interactive, accessible, and efficient.

---

## 🎯 Key Features

### 🧩 Learning Assistant

* Generate **summaries, notes, flashcards, or quizzes** directly from any webpage text.
* Automatically store your learning outputs in MongoDB or browser cache.
* Instant access to stored materials in the “Stored” tab.

### 🌐 Webpage Assistant (via `contentScript.js`)

* Select text or press **Ctrl + M** on any webpage to open the **“Generate”** dialog.
* Choose between Summary, Notes, Flashcards, Quiz, or Visualization.
* Results appear beautifully in a floating popup panel.
* Copy results or save them automatically.

### 🎨 Visualization

* Convert any topic into text-based **Mind Maps** or **Concept Maps**.
* Stored and synced using MongoDB.
* Rendered in visually structured markdown.

### 🧾 Create Section

* Generate essays, lab reports, research summaries, or case studies.
* Choose **academic level** (Undergraduate, Graduate, Postgraduate).
* Customize **length** and **tone**.
* Templates ensure professional and academic-quality outputs.

---
### 🎯 Why MASTER?

*   Unlike generic summarizers or content tools, MASTER focuses on academic enhancement — not just simplification.

*   It allows users to retain the complete learning experience while transforming complex information into easy-to-understand, well-structured study material.

*   MASTER adapts to your study habits without sacrificing depth, accuracy, or context.


---

## ⚙️ Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| **Frontend**  | React 19 + Vite + TailwindCSS       |
| **Extension** | Chrome Manifest V3, Content Scripts |
| **Backend**   | Node.js + Express.js                |
| **Database**  | MongoDB (Local or Atlas)            |
| **AI Engine** | Google Gemini API (v1beta)          |

---

## 🧩 Environment Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/riyahardia784/MASTER-AI-EXTENSION.git
cd Ai-extension
```

### 2️⃣ Install dependencies

```bash
npm install
```
3️⃣ Install Frontend Dependencies

```bash
cd Frontend
npm install
```
4️⃣ Install Backend Dependencies

```bash 
cd Backend
npm install
```

### 6️⃣ Configure environment

Create a `.env` file in `/Backend`:

```bash
PORT=4000
DB_CONNECT=mongodb://localhost:27017/MASTER
API_KEY=YOUR_GOOGLE_GENAI_KEY
```

> generate their own Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🍃 MongoDB Setup

### Option 1 — Local MongoDB

```bash
mongod
```

Update `.env`:

```bash
DB_CONNECT=mongodb://localhost:27017/MASTER
```

### Option 2 — MongoDB Atlas (Cloud)

```bash
DB_CONNECT=mongodb+srv://username:password@cluster0.mongodb.net/MASTER
```

✅ The backend automatically connects at startup.

---

## 🧠 Run the Project

At the root of the project:

```bash
npm start
```

This command runs both:

* `Frontend` → React + Vite (Extension UI)
* `Backend` → Express + MongoDB API

---

## 🧩 Add Extension to Chrome

1. Run the project once so that `frontend/dist` builds.
2. Open Chrome → **Extensions → Manage Extensions**.
3. Turn on **Developer Mode**.
4. Click **Load Unpacked**.
5. Select the `frontend` folder (or `dist` if built).
6. The **MASTER** extension will appear in Chrome Toolbar.

---

## 🖱️ Using the Extension

### 🔹 From the Popup Dashboard

* Choose a page (Learn / Create / Visualize).
* Paste your content or select a feature.
* Click **Generate** to view and store AI outputs.

### 🔹 From Any Webpage

* Select text → Press **Ctrl + M**
* Choose what to generate (Summary, Quiz, Visualization, etc.)
* View results instantly, copy, or save to local/DB storage.

---

## 📦 Available APIs (Backend)

| Method   | Endpoint              | Description                            |
| -------- | --------------------- | -------------------------------------- |
| `POST`   | `/learn/generate`     | Generate summary/notes/flashcards/quiz |
| `POST`   | `/visualize/generate` | Generate visualization                 |
| `POST`   | `/create/generate`    | Generate essays, reports, etc.         |
| `GET`    | `/learn/stored`       | Get all generated learn data           |
| `GET`    | `/visualize/stored`   | Get all visualizations                 |
| `DELETE` | `/visualize/:id`      | Delete a visualization                 |

---

## 🧩 Chrome Storage vs Database

| Source                                | Storage Type         | Purpose                                              |
| ------------------------------------- | -------------------- | ---------------------------------------------------- |
| **Main Extension (Frontend)**         | MongoDB              | Permanent storage for generated data                 |
| **Content Script (Webpage Shortcut)** | Chrome Local Storage | Temporary or quick access data shown in "Stored" tab |

Both sources are **synced visually** in the Stored page.

---

Built to empower students and researchers to **“Learn Anything, Anywhere.”**

---

## 📜 License

This project is licensed under the **MIT License**.

---
