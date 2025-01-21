import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
