# MongoDB Setup Instructions for SwasthyaSetu2

## Current Status
- ✅ Project configured for `mongodb://localhost:27017`
- ❌ MongoDB server is **NOT RUNNING** on your system

## Quick Setup Guide

### Option 1: Install MongoDB Community Server (Windows)

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your Windows version (usually Windows x64)
   - Download the `.msi` installer

2. **Install MongoDB**
   - Run the installer
   - Choose **"Install MongoDB as a Service"** ✅ (important!)
   - Complete the installation
   - MongoDB will automatically start as a Windows service

3. **Verify Installation**
   - Open Command Prompt
   - Run: `mongod --version`
   - If you see version info, MongoDB is installed ✅

4. **Start MongoDB Service**
   - Open PowerShell (Admin)
   - Run: `net start mongod` (if installed as service)
   - Or MongoDB auto-starts on reboot

5. **Seed the Database**
   - Open PowerShell
   - Navigate: `cd d:\SEM-2-Class\Practical\AIP\SwasthyaSetu2\backend`
   - Run: `node seed.js`
   - You should see: ✅ DATABASE SEEDED SUCCESSFULLY!

### Option 2: Use MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster**
   - Follow the setup wizard
   - Create a free M0 cluster
   - Wait for cluster to deploy (5-10 minutes)

3. **Get Connection String**
   - Click "Connect" button
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/database`)

4. **Update .env File**
   - Edit: `backend\.env`
   - Replace `MONGODB_URI=mongodb://localhost:27017/swasthyasetu`
   - With your Atlas connection string

5. **Seed the Database**
   - Run: `node seed.js`
   - MongoDB Atlas will store your data in cloud ☁️

## Demo Credentials (After Seeding)

### Patients 👤
- Email: `rahul@example.com` | Password: `password123` | ID: IND-HID-2026-0001
- Email: `priya@example.com` | Password: `password123` | ID: IND-HID-2026-0002

### Doctors 👨‍⚕️
- Email: `amit.doctor@example.com` | Password: `password123` | ID: DOC-0001
- Email: `neha.doctor@example.com` | Password: `password123` | ID: DOC-0002

## Start the Application

Once MongoDB is running and database is seeded:

1. Open PowerShell
2. Go to: `cd d:\SEM-2-Class\Practical\AIP\SwasthyaSetu2\backend`
3. Run: `node server.js`
4. Open browser: `http://localhost:5000`

## Troubleshooting

**Error: "connect ECONNREFUSED"**
- MongoDB is not running
- Install MongoDB or start the service
- Check with: `mongod --version`

**Error: "Authentication failed"**
- Check MONGODB_URI in `.env` file
- Username/password might be incorrect (for Atlas)
- Ensure IP whitelist allows your connection (Atlas)

## Need Help?
- MongoDB Docs: https://docs.mongodb.com/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- SwasthyaSetu2 Project: This folder
