import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import config from "../config";

// Predefined categories
const CATEGORIES = [
  "All",
  "Road Issue",
  "Water Supply",
  "Electricity",
  "Garbage",
  "Public Safety",
  "Others",
];

function Reports() {
  const [stats, setStats] = useState({ totalPosts: 0, totalUsers: 0 });
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchData = async () => {
    try {
      const [statsResponse, postsResponse] = await Promise.all([
        fetch(`${config.API_URL}/auth/admin/stats`, {
          credentials: "include",
        }),
        fetch(`${config.API_URL}/auth/admin/reported-posts`, {
          credentials: "include",
        }),
      ]);

      const statsData = await statsResponse.json();
      const postsData = await postsResponse.json();

      setStats(statsData);
      setReportedPosts(postsData.posts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await fetch(`${config.API_URL}/auth/admin/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleClearReports = async (postId) => {
    try {
      await fetch(
        `${config.API_URL}/auth/admin/posts/${postId}/clear-reports`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      fetchData(); // Refresh data after clearing reports
    } catch (error) {
      console.error("Error clearing reports:", error);
    }
  };

  const handleUpdateStatus = async (postId, newStatus) => {
    try {
      await fetch(`${config.API_URL}/auth/admin/posts/${postId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData(); // Refresh data after status update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredPosts =
    selectedCategory === "All"
      ? reportedPosts
      : reportedPosts.filter((post) => post.category === selectedCategory);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Reports Management</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Posts</Card.Title>
              <h3>{stats.totalPosts}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{stats.totalUsers}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Reported Posts Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Reported Posts</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Reports</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.category || "Uncategorized"}</td>
                  <td>{post.reportCount}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={post.status || "pending"}
                      onChange={(e) =>
                        handleUpdateStatus(post._id, e.target.value)
                      }
                      style={{ width: "130px" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </Form.Select>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleClearReports(post._id)}
                    >
                      Clear Reports
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Post Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <>
              <h5>{selectedPost.title}</h5>
              <p>
                <strong>Category:</strong>{" "}
                {selectedPost.category || "Uncategorized"}
              </p>
              <p>{selectedPost.description}</p>
              <p>
                <strong>Status:</strong> {selectedPost.status || "Pending"}
              </p>
              <p>
                <strong>Reports:</strong> {selectedPost.reportCount}
              </p>
              <p>
                <strong>Created:</strong> {formatDate(selectedPost.createdAt)}
              </p>
              {selectedPost.location && (
                <p>
                  <strong>Location:</strong> {selectedPost.location.latitude},{" "}
                  {selectedPost.location.longitude}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Reports;
