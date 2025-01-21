import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";
import config from "../config";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/auth/posts/public`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="map-container">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {posts.map((post) => (
            <Marker
              key={post._id}
              position={[post.location.latitude, post.location.longitude]}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p>Status: {post.status}</p>
                  <p>Posted by: {post.username || "Anonymous User"}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ maxWidth: "200px", marginTop: "10px" }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Home;
