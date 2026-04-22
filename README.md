# 🏥 SwasthyaSetu+ — National Digital Health Record System
### Pure Node.js + MongoDB Backend · Pure HTML/CSS/JS Frontend

---

## 🔑 DEMO CREDENTIALS (Password for ALL: `password123`)

| Role | Name | Email |
|------|------|-------|
| 👤 Patient | Rahul Sharma | rahul@example.com |
| 👤 Patient | Priya Verma  | priya@example.com |
| 👨‍⚕️ Doctor | Dr. Amit Sharma | amit.doctor@example.com |
| 👩‍⚕️ Doctor | Dr. Neha Gupta  | neha.doctor@example.com |

---

## 📦 TECH STACK

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Frontend | Pure HTML + CSS + JavaScript |
| NO React, NO build tools needed! | ✅ |

---

## 🚀 HOW TO RUN — COMPLETE BEGINNER GUIDE

### ══════════════════════════════════════
### STEP 1 — Install Required Software
### ══════════════════════════════════════

#### A) Install Node.js
1. Open browser → go to https://nodejs.org
2. Click the big green **"LTS"** button to download
3. Open the downloaded file and click **Next → Next → Install**
4. After install, open Command Prompt and type:
   ```
   node --version
   ```
   You should see something like: `v20.11.0` ✅

#### B) Install MongoDB Community Server
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: **Latest**
   - Platform: **Windows**
   - Package: **msi**
3. Click **Download**
4. Run the installer:
   - Click **Next** repeatedly
   - Choose **"Complete"** installation
   - ✅ CHECK the box **"Install MongoDB as a Service"** — very important!
   - Click **Install**
5. MongoDB will now auto-start every time you turn on your PC ✅

#### C) Install MongoDB Compass (GUI — to see your database visually)
1. During MongoDB installation, it will offer to install **MongoDB Compass**
2. Make sure that checkbox is CHECKED ✅
3. OR download separately from: https://www.mongodb.com/products/tools/compass
4. Open Compass after install — you'll use it in Step 4

#### D) Install VS Code (Code Editor)
1. Go to https://code.visualstudio.com
2. Download and install
3. Useful extension to install inside VS Code:
   - Open VS Code → Click Extensions icon (left bar) → Search **"Thunder Client"** → Install
   (This lets you test APIs without Postman)

---

### ══════════════════════════════════════
### STEP 2 — Open the Project in VS Code
### ══════════════════════════════════════

1. Extract `SwasthyaSetu.zip` to a folder (e.g. Desktop → SwasthyaSetu)
2. Open **VS Code**
3. Click **File → Open Folder**
4. Select the `SwasthyaSetu` folder → Click **Select Folder**
5. You'll see the project files in the left panel ✅

---

### ══════════════════════════════════════
### STEP 3 — Open the Terminal in VS Code
### ══════════════════════════════════════

1. In VS Code, press **Ctrl + ` ** (that's Ctrl + backtick, the key below Escape)
   OR click **Terminal → New Terminal** from the top menu
2. A terminal opens at the bottom of VS Code ✅

---

### ══════════════════════════════════════
### STEP 4 — Connect MongoDB via Compass
### ══════════════════════════════════════

1. Open **MongoDB Compass** (search in Start menu)
2. You'll see a connection screen
3. In the **"URI"** box, type:
   ```
   mongodb://127.0.0.1:27017
   ```
4. Click **"Connect"**
5. You'll see the databases on the left panel
6. After you run seed.js (next step), you'll see **"swasthyasetu"** database appear here
7. Click it to explore:
   - **users** → all patients and doctors
   - **records** → all 10 medical records
   - **accesscontrols** → access permissions
   - **auditlogs** → activity logs

---

### ══════════════════════════════════════
### STEP 5 — Install Project Packages
### ══════════════════════════════════════

In the VS Code terminal, type these commands ONE BY ONE:

```bash
cd backend
npm install
```

Wait for it to finish. You'll see a `node_modules` folder appear.

---

### ══════════════════════════════════════
### STEP 6 — Load Demo Data (Seed)
### ══════════════════════════════════════

In the same terminal, type:

```bash
node seed.js
```

You should see:

```
✅ MongoDB connected
🧹 Old data cleared
🎉 DATABASE SEEDED SUCCESSFULLY!

  👤 PATIENT LOGINS:
     Rahul Sharma  →  rahul@example.com  /  password123
     Priya Verma   →  priya@example.com  /  password123

  👨‍⚕️ DOCTOR LOGINS:
     Dr. Amit Sharma  →  amit.doctor@example.com  /  password123
     Dr. Neha Gupta   →  neha.doctor@example.com  /  password123

  📊 10 medical records seeded!
```

Now open **MongoDB Compass** → Click **Refresh** → You'll see the `swasthyasetu` database with all data! 🎉

---

### ══════════════════════════════════════
### STEP 7 — Start the Server
### ══════════════════════════════════════

In the same terminal, type:

```bash
node server.js
```

You should see:

```
  🏥  SwasthyaSetu+  ────────────────────────
  🚀  Server  →  http://localhost:5000
  📡  API     →  http://localhost:5000/api
  ────────────────────────────────────────────
  Open your browser and go to:
  👉  http://localhost:5000
```

**Keep this terminal open while using the app!**

---

### ══════════════════════════════════════
### STEP 8 — Open the App in Browser
### ══════════════════════════════════════

1. Open **Chrome** or **Edge**
2. Type in the address bar: **http://localhost:5000**
3. Press Enter
4. The SwasthyaSetu+ home page loads! 🎉
5. Click **Login** and use the demo credentials

---

## 📁 PROJECT STRUCTURE

```
SwasthyaSetu/
└── backend/
    ├── config/
    │   └── db.js              ← MongoDB connection
    ├── controllers/
    │   ├── authController.js  ← Register & Login logic
    │   ├── patientController.js
    │   └── doctorController.js
    ├── middleware/
    │   └── auth.js            ← JWT token check
    ├── models/
    │   ├── User.js            ← Patient & Doctor schema
    │   ├── Record.js          ← Medical record schema
    │   ├── AccessControl.js   ← Access permissions
    │   └── AuditLog.js        ← Activity logs
    ├── routes/
    │   ├── auth.js
    │   ├── patient.js
    │   └── doctor.js
    ├── public/                ← ALL frontend files (HTML/CSS/JS)
    │   ├── index.html         ← Home page
    │   ├── login.html         ← Login page
    │   ├── register.html      ← Register page
    │   ├── css/
    │   │   └── style.css      ← All styles
    │   ├── js/
    │   │   └── api.js         ← Shared JS utilities
    │   ├── patient/
    │   │   └── dashboard.html ← Patient dashboard
    │   └── doctor/
    │       └── dashboard.html ← Doctor dashboard
    ├── seed.js                ← Demo data loader
    ├── server.js              ← Main server file
    ├── package.json
    └── .env                   ← Configuration
```

---

## 🔌 API REFERENCE

Base URL: `http://localhost:5000/api`

### Authentication
```
POST /api/auth/register    → Create account
POST /api/auth/login       → Login
GET  /api/auth/me          → Get current user
```

### Patient (must be logged in as patient)
```
GET  /api/patient/profile               → My profile
GET  /api/patient/records               → All records  (?type=Diagnosis&search=fever)
GET  /api/patient/summary               → Health stats
GET  /api/patient/access-requests       → Doctor requests
POST /api/patient/respond-access/:id    → Approve/Reject
GET  /api/patient/audit-logs            → Activity log
```

### Doctor (must be logged in as doctor)
```
GET  /api/doctor/patient/:healthId           → Search patient
POST /api/doctor/request-access              → Request access
POST /api/doctor/add-record                  → Add medical record
GET  /api/doctor/patient-records/:healthId   → View patient records
GET  /api/doctor/activity                    → My activity
```

---

## ❗ TROUBLESHOOTING

### "node is not recognized"
→ Node.js not installed. Go to nodejs.org, download LTS, install it, then restart VS Code.

### "MongoServerError" or "connection refused"
→ MongoDB is not running.
  - Press Windows key → Search "Services" → Find "MongoDB Server" → Right-click → Start
  - OR: In terminal type: `net start MongoDB`

### "Port 5000 already in use"
→ Open `.env` file and change `PORT=5000` to `PORT=5001`, then restart.

### Page shows "Cannot GET /"
→ Make sure you're running `node server.js` from inside the `backend` folder.

### Blank page or "Network Error" 
→ Backend server must be running. Never close that terminal window.

### To restart fresh (clear all data):
```bash
node seed.js
```
This wipes and re-seeds everything.

---

## 🌐 USING WITH NODEMON (Auto-restart on file change)

Instead of `node server.js`, use:
```bash
npm run dev
```
This uses `nodemon` — the server auto-restarts whenever you edit a file. Great for development!

---

## 📊 HOW TO EXPLORE DATA IN MONGODB COMPASS

1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Click **swasthyasetu** database
4. Collections available:
   - **users** → Click any document to see patient/doctor details
   - **records** → See all 10 medical records with full structure
   - **accesscontrols** → Who approved whom
   - **auditlogs** → Full activity history

### To view a record nicely:
- Click on any document
- Click the **{ }** icon at top right to see it as JSON

---

Built with ❤️ for India 🇮🇳 — Inspired by Ayushman Bharat Digital Mission (ABDM)
#