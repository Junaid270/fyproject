import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/admin/reported-posts"
                active={location.pathname === "/admin/reported-posts"}
              >
                Reported Posts
              </Nav.Link>
              {/* Add other admin navigation links here */}
            </Nav>
            <Nav>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
