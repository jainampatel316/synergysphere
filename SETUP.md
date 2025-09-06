# 🚀 SynergySphere - Project Setup Guide

## 📋 Quick Start Checklist

### Prerequisites ✅
- [ ] Node.js (v14 or higher) installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Gmail account with App Password generated
- [ ] Git installed

### Environment Setup 🔧

#### 1. Clone and Navigate
```bash
git clone <repository-url>
cd synergy-nexus-65
```

#### 2. Backend Configuration
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Frontend Setup
```bash
cd ..
npm install
```

### 🗄️ Database Configuration

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. Keep default URI: `mongodb://127.0.0.1:27017/synergysphere`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in .env

### 📧 Email Configuration (Gmail)

#### Required for:
- User registration confirmations
- Password reset emails
- Team member invitations
- Project notifications

#### Setup Steps:
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Google Account → Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
3. **Update .env file**:
   ```bash
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### 🏃‍♂️ Running the Application

#### Start Backend
```bash
cd backend
node dist/index.js
```
✅ Backend runs on http://localhost:4000

#### Start Frontend  
```bash
npm run dev
```
✅ Frontend runs on http://localhost:8080

### 🧪 Testing the Setup

#### 1. Test Backend API
```bash
curl http://localhost:4000/api/analytics/platform
# Should return: {"error":"Access denied. No token provided..."}
```

#### 2. Register a User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### 3. Check Email
- Registration confirmation should arrive in your inbox
- Debug URL will be shown in console during development

### 🎯 MVP Features Verification

After setup, verify these core features work:

- [ ] **Authentication**: Register/Login functionality
- [ ] **Email Service**: Confirmation emails received
- [ ] **Database**: User data persisted
- [ ] **Frontend**: React app loads correctly
- [ ] **API Endpoints**: Backend responds to requests

### 🔧 Troubleshooting

#### Backend Won't Start
- ✅ Check MongoDB is running
- ✅ Verify .env file exists and is configured
- ✅ Ensure port 4000 is available

#### Email Not Sending
- ✅ Verify Gmail App Password (not regular password)
- ✅ Check SMTP settings in .env
- ✅ Ensure 2FA is enabled on Gmail

#### Frontend Issues
- ✅ Run `npm install` in root directory
- ✅ Check if backend is running on port 4000
- ✅ Verify SOCKET_ORIGIN matches frontend URL

### 📊 Development Workflow

#### Backend Development
- Code is in `backend/dist/` (compiled JavaScript)
- Environment config in `backend/.env`
- No TypeScript compilation needed

#### Frontend Development
- React + TypeScript source in `src/`
- Hot reload with `npm run dev`
- Mobile-responsive design

### 🏗️ Architecture Overview

```
SynergySphere/
├── backend/
│   ├── dist/           # Compiled backend code
│   ├── .env           # Environment configuration
│   └── .env.example   # Configuration template
├── src/               # Frontend React source
├── public/            # Static assets
└── README.md          # Project documentation
```

### 🎯 Next Steps

1. **Complete Environment Setup** following this guide
2. **Test Core Features** using the verification checklist
3. **Explore the Frontend** - Navigate through the UI
4. **Try API Endpoints** - Test authentication and analytics
5. **Invite Team Members** - Test the collaboration features

---

## 🤝 Need Help?

- Check the main README.md for project vision and technical details
- Review backend/.env.example for configuration options
- Ensure all prerequisites are properly installed

**SynergySphere** - *Where teams operate at their best* 🚀
