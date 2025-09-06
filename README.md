# SynergySphere - Advanced Team Collaboration Platform

> **"Teams do their best work when their tools truly support how they think, communicate, and move forward together."**

## 🎯 Project Vision

SynergySphere is an intelligent team collaboration platform that goes beyond traditional project management software. It serves as the **central nervous system** for teams, helping them operate at their best by staying organized, communicating effectively, and making informed decisions without friction.

### 🚀 Mission Statement
Design and build a desktop and mobile-ready platform that acts like a central nervous system for team collaboration. SynergySphere streamlines the basics like tasks and communication while working **proactively** — catching potential issues early and helping teams stay ahead rather than constantly reacting.

## 💡 Problem Statement

SynergySphere directly addresses persistent pain points experienced by teams across various domains:

### 🔍 Target Pain Points Solved:

| Pain Point | SynergySphere Solution |
|------------|----------------------|
| **📂 Scattered Information** | Centralized hub for files, chats, and decisions |
| **📊 Unclear Progress** | Real-time visibility into task progress and bottlenecks |
| **⚖️ Resource Confusion** | Smart assignment management and workload balancing |
| **⏰ Deadline Surprises** | Proactive issue detection and early warning systems |
| **💬 Communication Gaps** | Integrated project-specific threaded discussions |

## 🏗️ MVP Features

### Core Functionality
- ✅ **User Authentication** - Register/Login system
- ✅ **Project Management** - Create and manage projects
- ✅ **Team Collaboration** - Add and manage team members
- ✅ **Task Management** - Assign tasks with due dates and status tracking
- ✅ **Communication** - Project-specific threaded discussions
- ✅ **Progress Visualization** - Clear, intuitive task progress views
- ✅ **Notifications** - Smart alerts for important events
- ✅ **Analytics** - Platform insights and team performance metrics

### Task Status Workflow
```
📝 To-Do → 🔄 In Progress → ✅ Done
```

## 🛠️ Technical Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **Email Service**: Gmail SMTP integration
- **File Upload**: Multer middleware for attachments
- **API**: RESTful endpoints with rate limiting

### Frontend Stack
- **Framework**: React with TypeScript
- **Styling**: Modern CSS with responsive design
- **State Management**: React hooks and context
- **Routing**: React Router for SPA navigation
- **UI/UX**: Mobile-first responsive design

### Key Features Implementation
```
🔐 Authentication System
├── User registration with email confirmation
├── JWT token-based session management
└── Password reset functionality

📊 Project Management
├── Project creation and configuration
├── Team member invitation system
└── Role-based access control

📋 Task Management
├── Task assignment and tracking
├── Status workflow management
└── Due date and priority handling

💬 Communication
├── Project-specific discussions
├── Real-time notifications
└── Email integration

📈 Analytics & Insights
├── Platform usage metrics
├── Team performance analytics
└── Project progress tracking
```

## 🎨 Design Philosophy

### Mobile-First Approach
- **On-the-go optimization**: Quick task checking, status updates, and brief messaging
- **Minimal taps**: Streamlined interactions for mobile efficiency
- **Lightweight design**: Fast, responsive mobile experience

### Desktop Command Center
- **Comprehensive overview**: Broader project visibility for managers
- **Advanced data entry**: Detailed task creation and management
- **Multi-project management**: Simultaneous project monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email services

### Environment Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Configure your environment variables (see Environment Configuration below)
3. Ensure MongoDB is running
4. Start the backend server

### Quick Start
```bash
# Backend
cd backend
node dist/index.js

# Frontend
npm install
npm run dev
```

## 🔧 Environment Configuration

See `backend/.env.example` for detailed environment setup instructions.

## 📱 Platform Compatibility

- **Desktop**: Full-featured web application
- **Mobile**: Responsive design optimized for mobile devices
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🎯 Development Principles

1. **Proactive, not reactive** - Surface issues before they become problems
2. **Intelligent orchestration** - Smart collaboration assistance
3. **Seamless integration** - Natural fit into team workflows
4. **Continuous improvement** - Help teams work smarter every day

## 🏆 Success Metrics

- **Team Efficiency**: Reduced time spent on coordination
- **Project Visibility**: Clear progress tracking and bottleneck identification
- **Communication Quality**: Centralized, contextual team discussions
- **Resource Optimization**: Better workload distribution and utilization

---

## 📄 License

This project is developed as part of the Odoo x NMIT Hackathon '25.

## 🤝 Contributing

Built with ❤️ for better team collaboration.

---

**SynergySphere** - *Where teams operate at their best*
