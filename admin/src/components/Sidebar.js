import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import { Nav } from "react-bootstrap";
import { FaMap, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <div className="admin-info">
          <span>{user?.username}</span>
        </div>
      </div>
      <Nav className="flex-column p-3 bg-light h-100">
        <Nav.Item>
          <Link
            to="/admin"
            className={`nav-link ${
              location.pathname === "/admin" ? "active" : ""
            }`}
          >
            <FaMap className="me-2" />
            Map View
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/admin/reports"
            className={`nav-link ${
              location.pathname === "/admin/reports" ? "active" : ""
            }`}
          >
            <FaChartBar className="me-2" />
            Reports
          </Link>
        </Nav.Item>
      </Nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
