import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Modal,
  Container,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import config from '../../config';

const ReportedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    try {
      const response = await fetch(`${config.API_URL}/admin/reported-posts`, {
        credentials: 'include',
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(
          `${config.API_URL}/admin/posts/${postId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );

        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== postId));
          alert('Post deleted successfully');
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const handleClearReports = async (postId) => {
    if (window.confirm('Are you sure you want to clear all reports for this post?')) {
      try {
        const response = await fetch(
          `${config.API_URL}/admin/posts/${postId}/clear-reports`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== postId));
          alert('Reports cleared successfully');
        } else {
          alert('Failed to clear reports');
        }
      } catch (error) {
        console.error('Error clearing reports:', error);
        alert('Error clearing reports');
      }
    }
  };

  const handleShowReports = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          Reported Posts
          <Badge bg="danger">{posts.length} Posts</Badge>
        </Card.Header>
        <Card.Body>
          {posts.length === 0 ? (
            <p className="text-center text-muted">No reported posts to review</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Reports</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.userId?.username || 'Unknown'}</td>
                    <td>
                      <Badge bg="warning" text="dark">
                        {post.reportCount} Reports
                      </Badge>
                    </td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowReports(post)}
                      >
                        View Reports
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleClearReports(post._id)}
                      >
                        Clear Reports
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <>
              <Row className="mb-4">
                <Col>
                  <h5>{selectedPost.title}</h5>
                  <p className="text-muted">{selectedPost.description}</p>
                </Col>
              </Row>
              <h6>Reports ({selectedPost.reports.length}):</h6>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPost.reports.map((report, index) => (
                    <tr key={index}>
                      <td>{report.userId}</td>
                      <td>{report.reason}</td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportedPosts; 