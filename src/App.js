import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewUsers from './pages/NewUsers';
import ApprovedUsers from './pages/ApprovedUsers';
import TOTForm from './pages/TOTForm';
import TechnicalForm from './pages/TechnicalForm';
import WorkshopForm from './pages/WorkshopForm';
import SeminarForm from './pages/SeminarForm';
import TechnicalNewUsers from './pages/TechnicalNewUsers';
import TechnicalApprovedUsers from './pages/TechnicalApprovedUsers';
import WorkshopNewUsers from './pages/WorkshopNewUsers';
import WorkshopApprovedUsers from './pages/WorkshopApprovedUsers';
import SeminarNewUsers from './pages/SeminarNewUsers';
import SeminarApprovedUsers from './pages/SeminarApprovedUsers';
import './styles/App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicFormRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Public Form Routes - No login required */}
            <Route path="/form/tot" element={
              <PublicFormRoute>
                <TOTForm />
              </PublicFormRoute>
            } />
            <Route path="/form/technical" element={
              <PublicFormRoute>
                <TechnicalForm />
              </PublicFormRoute>
            } />
            <Route path="/form/workshop" element={
              <PublicFormRoute>
                <WorkshopForm />
              </PublicFormRoute>
            } />
            <Route path="/form/seminar" element={
              <PublicFormRoute>
                <SeminarForm />
              </PublicFormRoute>
            } />
            
            {/* Protected Routes - Require login */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* TOT Management */}
            <Route path="/new-users" element={
              <ProtectedRoute>
                <NewUsers />
              </ProtectedRoute>
            } />
            <Route path="/approved-users" element={
              <ProtectedRoute>
                <ApprovedUsers />
              </ProtectedRoute>
            } />
            
            {/* Technical Form Management */}
            <Route path="/technical-new-users" element={
              <ProtectedRoute>
                <TechnicalNewUsers />
              </ProtectedRoute>
            } />
            <Route path="/technical-approved-users" element={
              <ProtectedRoute>
                <TechnicalApprovedUsers />
              </ProtectedRoute>
            } />
            
            {/* Workshop Form Management */}
            <Route path="/workshop-new-users" element={
              <ProtectedRoute>
                <WorkshopNewUsers />
              </ProtectedRoute>
            } />
            <Route path="/workshop-approved-users" element={
              <ProtectedRoute>
                <WorkshopApprovedUsers />
              </ProtectedRoute>
            } />
            
            {/* Seminar Form Management */}
            <Route path="/seminar-new-users" element={
              <ProtectedRoute>
                <SeminarNewUsers />
              </ProtectedRoute>
            } />
            <Route path="/seminar-approved-users" element={
              <ProtectedRoute>
                <SeminarApprovedUsers />
              </ProtectedRoute>
            } />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/forms" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;