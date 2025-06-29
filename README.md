# Civix - Grievance Management System

A modern, full-stack grievance management system built with React, Appwrite, and AI integration.

## Features

### Authentication
- Email/password and Google authentication with Appwrite
- Role-based access (User/Admin)
- Persistent login sessions
- Protected routes

### User Features
- Submit grievances with file uploads (up to 5 files)
- AI-powered formal description formatting using Hugging Face
- Track grievance status in real-time
- View detailed grievance history

### Admin Features
- Comprehensive dashboard for all grievances
- Separate views for active and completed grievances
- Status management with valid transitions:
  - Pending → InProgress or Rejected
  - InProgress → Resolved
- Detailed grievance information with user details

### Technical Features
- Modern React
- Responsive design with Tailwind CSS
- File storage with Appwrite
- AI integration with Hugging Face Inference API
- Real-time status tracking

## Usage

### For Users
1. Register with email/password or Google OAuth (select "User" role)
2. Submit grievances with title, description, and optional file attachments
3. Use AI formatting to improve description quality
4. Track status updates in your dashboard

### For Admins
1. Register with email/password (select "Admin" role)
2. View all grievances in organized active/past sections
3. Update grievance status with proper workflow validation

## Status Workflow

- **Pending**: Initial submission status
- **InProgress**: Admin is working on the grievance
- **Resolved**: Issue has been successfully addressed
- **Rejected**: Grievance cannot be processed

## File Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── pages/              # Page components
├── services/           # API service layers
└── App.jsx            # Main application component
```

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Appwrite (Database, Auth, Storage)
- **AI**: Hugging Face Inference API
- **Routing**: React Router DOM

## Security Features

- JWT-based authentication with Appwrite
- File upload validation and size limits
- Protected API endpoints
- Input sanitization and validation
- Role-based access control
