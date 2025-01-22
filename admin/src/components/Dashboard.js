import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

// Create custom marker icons
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: `custom-marker ${color}`,
    html: `<div class="marker-pin" style="background-color: ${color}"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const markerIcons = {
  pending: createMarkerIcon("#ffa500"),
  "in-progress": createMarkerIcon("#2196f3"),
  resolved: createMarkerIcon("#4caf50"),
};

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/auth/posts`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data); // Debug log

      // Ensure data is an array
      const postsArray = Array.isArray(data) ? data : 
                        (data.posts ? data.posts : []); // Handle if data is nested

      setPosts(postsArray);
      
      // Calculate stats only if we have posts
      if (postsArray.length > 0) {
        const stats = postsArray.reduce(
          (acc, post) => {
            acc.total++;
            acc[post.status.replace("-", "")]++;
            return acc;
          },
          { total: 0, pending: 0, inProgress: 0, resolved: 0 }
        );
        setStats(stats);

        // Set map center to the first post
        setMapCenter([postsArray[0].location.latitude, postsArray[0].location.longitude]);
        setMapZoom(12);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again later.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/auth/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPosts(); // Refresh posts after successful update
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Reports</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Array.isArray(posts) && posts.map((post) => (
            <Marker
              key={post._id}
              position={[post.location.latitude, post.location.longitude]}
              icon={markerIcons[post.status]}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p>
                    <strong>Status:</strong> {post.status}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(post.createdAt)}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {post.location.address || "No address available"}
                  </p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Report"
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                  )}
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    className={`status-select ${post.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;