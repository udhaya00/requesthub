import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AppShell from "./layouts/AppShell.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import NewRequestPage from "./pages/NewRequestPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RequestDetailsPage from "./pages/RequestDetailsPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-request" element={<NewRequestPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;

