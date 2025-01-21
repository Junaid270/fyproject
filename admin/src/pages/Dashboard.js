import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import config from "../config";

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

function Dashboard() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India's center
  const [mapZoom, setMapZoom] = useState(5);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/auth/admin/reported-posts`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      setReportedPosts(data.posts || []);

      // Set map center to the first post if available
      if (data.posts && data.posts.length > 0 && data.posts[0].location) {
        const newCenter = [
          data.posts[0].location.latitude,
          data.posts[0].location.longitude,
        ];
        setMapCenter(newCenter);
        setMapZoom(12);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      <Card>
        <Card.Header>
          <h5 className="mb-0">Reports Map</h5>
        </Card.Header>
        <Card.Body>
          <div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {reportedPosts.map(
                (post) =>
                  post.location && (
                    <Marker
                      key={post._id}
                      position={[
                        post.location.latitude,
                        post.location.longitude,
                      ]}
                      icon={markerIcons[post.status || "pending"]}
                    >
                      <Popup>
                        <div>
                          <h6>{post.title}</h6>
                          <p>{post.description}</p>
                          <p>
                            <strong>Status:</strong> {post.status || "Pending"}
                          </p>
                          <p>
                            <strong>Reports:</strong> {post.reportCount}
                          </p>
                          <p>
                            <strong>Created:</strong>{" "}
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
