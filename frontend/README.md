# Sync HRMS Frontend

This is the React-based frontend for the Sync HRMS application.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Running Backend server (Django) at `http://127.0.0.1:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server

To start the frontend in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

- `src/components`: Reusable UI components (Layout, Common widgets)
- `src/context`: Global state management (AuthContext)
- `src/modules`: Feature-specific modules (Dashboard, Employee, Leave, etc.)
- `src/services`: API service configuration
- `src/styles`: Global styles and CSS variables

## 🔧 Configuration

The application is configured to proxy API requests to the Django backend.
- **API URL**: `/api/v1` (Proxied to `http://127.0.0.1:8000/api/v1`)
- **Proxy Config**: See `vite.config.js`

## 🧩 Modules

- **Dashboard**: Overview of HR stats
- **Employees**: Employee list and management
- **Attendance**: (Placeholder) Attendance tracking
- **Leave**: (Placeholder) Leave management
- **Payroll**: (Placeholder) Salary and payslips
- **Recruitment**: (Placeholder) Job postings and candidates
- **Performance**: (Placeholder) OKRs and reviews
- **Projects**: (Placeholder) Project management
- **Assets**: (Placeholder) Asset tracking
- **Helpdesk**: (Placeholder) Support tickets

## 🤖 AI Features

- **Header**: Includes Notification center
- **ChatBot**: Integrated HR Assistant (Chat Bot) accessing the `chart_bot` backend.
