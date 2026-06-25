import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Crisis from "./pages/Crisis";
import Grounding from "./pages/Grounding";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-sage-500">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/chat" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/chat" /> : <Signup />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Protected Routes */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/crisis" element={
        <ProtectedRoute>
          <Crisis />
        </ProtectedRoute>
      } />
      <Route path="/grounding" element={
        <ProtectedRoute>
          <Grounding />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    
      <AuthProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#4a6a3d",
              color: "#fff",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#fff",
                secondary: "#4a6a3d",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
   
  );
}

export default App;