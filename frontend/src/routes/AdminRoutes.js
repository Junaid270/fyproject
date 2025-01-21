import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ReportedPosts from "../components/admin/ReportedPosts";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AuthContext";

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/reported-posts" element={<ReportedPosts />} />
        {/* Add other admin routes here */}
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
