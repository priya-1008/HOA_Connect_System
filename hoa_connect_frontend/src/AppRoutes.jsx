// export default AppRoutes;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Super Admin Pages
import Login from "./pages/Login";
import Dashboard from "./pages/superadmin/Dashboard";
import ManageCommunities from "./pages/superadmin/ManageCommunities";
import ManageAmenities from "./pages/superadmin/ManageAmenities";
import SystemNotification from "./pages/superadmin/Notifications";

// HOA Admin Pages
import HOAAdminDashboard from "./pages/admin/AdminDashboard";
import Payments from "./pages/admin/TrackPayment";
import Residents from "./pages/admin/Residents";
import Announcements from "./pages/admin/Announcements";
import Complaints from "./pages/admin/Complaints";
import Amenities from "./pages/admin/Amenities";
import Documents from "./pages/admin/Documents";
import Meetings from "./pages/admin/Meetings";
import Polls from "./pages/admin/Polls";
import Notification from "./pages/admin/SendNotification";

// Resident Pages
import ResidentDashboard from "./pages/Resident/ResidentDashboard";
import AddPayment from "./pages/Resident/Payment";
import DisplayAnnouncement from "./pages/Resident/Announcements";
import UseAmenities from "./pages/Resident/Amenities";
import AddComplaints from "./pages/Resident/Complaints";
import AddDocuments from "./pages/Resident/Documents";
import ViewPolls from "./pages/Resident/Polls";
import ViewNotifications from "./pages/Resident/ViewNotification";
import ResidentRegister from "./pages/Resident/Register";
import AttendMeetings from "./pages/Resident/Meetings";
import Profile from "./pages/Resident/Profile";
import Register from "./pages/Resident/Register";
import ChangePaasword from "./pages/ChangePassword";

const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ChangePaasword />} />

    {/* Private Routes */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute requiredRole="superadmin">
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/manage-communities"
      element={
        <PrivateRoute>
          <ManageCommunities />
        </PrivateRoute>
      }
    />
    <Route
      path="/manage-amenities"
      element={
        <PrivateRoute>
          <ManageAmenities />
        </PrivateRoute>
      }
    />
    <Route
      path="/notifications"
      element={
        <PrivateRoute>
          <SystemNotification />
        </PrivateRoute>
      }
    />

    {/*  HOA Admin Routes */}
    <Route
      path="/admin-dashboard"
      element={
        <PrivateRoute requiredRole="admin">
          <HOAAdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/track-payments"
      element={
        <PrivateRoute>
          <Payments />
        </PrivateRoute>
      }
    />
    <Route
      path="/residents"
      element={
        <PrivateRoute>
          <Residents />
        </PrivateRoute>
      }
    />
    <Route
      path="/announcements"
      element={
        <PrivateRoute>
          <Announcements />
        </PrivateRoute>
      }
    />
    <Route
      path="/complaints"
      element={
        <PrivateRoute>
          <Complaints />
        </PrivateRoute>
      }
    />
    <Route
      path="/amenities"
      element={
        <PrivateRoute>
          <Amenities />
        </PrivateRoute>
      }
    />
    <Route
      path="/documents"
      element={
        <PrivateRoute>
          <Documents />
        </PrivateRoute>
      }
    />
    <Route
      path="/meetings"
      element={
        <PrivateRoute>
          <Meetings />
        </PrivateRoute>
      }
    />
    <Route
      path="/polls"
      element={
        <PrivateRoute>
          <Polls />
        </PrivateRoute>
      }
    />
    <Route
      path="/notification"
      element={
        <PrivateRoute>
          <Notification />
        </PrivateRoute>
      }
    />

    {/*  HOA Resident Routes */}
    <Route
      path="/resident-dashboard"
      element={
        <PrivateRoute requiredRole="resident">
          <ResidentDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/add-payments"
      element={
        <PrivateRoute>
          <AddPayment />
        </PrivateRoute>
      }
    />
    <Route
      path="/view-announcements"
      element={
        <PrivateRoute>
          <DisplayAnnouncement />
        </PrivateRoute>
      }
    />
    <Route
      path="/add-complaints"
      element={
        <PrivateRoute>
          <AddComplaints />
        </PrivateRoute>
      }
    />
    <Route
      path="/use-amenities"
      element={
        <PrivateRoute>
          <UseAmenities />
        </PrivateRoute>
      }
    />
    <Route
      path="/add-documents"
      element={
        <PrivateRoute>
          <AddDocuments />
        </PrivateRoute>
      }
    />
    <Route
      path="/attend-meetings"
      element={
        <PrivateRoute>
          <AttendMeetings />
        </PrivateRoute>
      }
    />
    <Route
      path="/view-polls"
      element={
        <PrivateRoute>
          <ViewPolls />
        </PrivateRoute>
      }
    />
    <Route
      path="/view-notification"
      element={
        <PrivateRoute>
          <ViewNotifications />
        </PrivateRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />

    {/* Redirect any unknown route to login */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
