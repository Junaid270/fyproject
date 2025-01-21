import React, { createContext, useState, useContext } from "react";
import config from "../config"; // Create this if you haven't already

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_URL}/auth/posts/public`);

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_URL}/auth/posts`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }

      const data = await response.json();
      setUserPosts(data || []);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${config.API_URL}/auth/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
      return { success: true };
    } catch (err) {
      console.error("Error deleting post:", err);
      return { success: false, message: err.message };
    }
  };

  const updatePost = async (postId, updates) => {
    try {
      const response = await fetch(`${config.API_URL}/auth/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      setUserPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating post:", err);
      return { success: false, message: err.message };
    }
  };

  const createPost = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_URL}/auth/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setPosts((prevPosts) => [data, ...prevPosts]);
      return { success: true, post: data };
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const upvotePost = async (postId) => {
    try {
      console.log("Attempting to upvote post:", postId);
      const response = await fetch(
        `${config.API_URL}/auth/posts/${postId}/upvote`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Upvote response status:", response.status);
      const data = await response.text();
      console.log("Raw response:", data);

      if (!response.ok) {
        throw new Error(`Failed to upvote post: ${data}`);
      }

      const updatedPost = JSON.parse(data);
      console.log("Updated post:", updatedPost);

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setUserPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      return { success: true, post: updatedPost };
    } catch (err) {
      console.error("Error upvoting post:", err);
      console.error("Error details:", err.message);
      return { success: false, message: err.message };
    }
  };

  const downvotePost = async (postId) => {
    try {
      console.log("Attempting to downvote post:", postId);
      const response = await fetch(
        `${config.API_URL}/auth/posts/${postId}/downvote`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Downvote response status:", response.status);
      const data = await response.text();
      console.log("Raw response:", data);

      if (!response.ok) {
        throw new Error(`Failed to downvote post: ${data}`);
      }

      const updatedPost = JSON.parse(data);
      console.log("Updated post:", updatedPost);

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setUserPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      return { success: true, post: updatedPost };
    } catch (err) {
      console.error("Error downvoting post:", err);
      console.error("Error details:", err.message);
      return { success: false, message: err.message };
    }
  };

  const reportPost = async (postId, reason) => {
    try {
      console.log("Attempting to report post:", postId);
      console.log("Report reason:", reason);

      const response = await fetch(
        `${config.API_URL}/auth/posts/${postId}/report`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );

      console.log("Report response status:", response.status);
      const data = await response.text();
      console.log("Raw response:", data);

      if (!response.ok) {
        throw new Error(`Failed to report post: ${data}`);
      }

      const result = JSON.parse(data);
      console.log("Report result:", result);

      // Update the post in state if it was returned
      if (result.post) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? result.post : post))
        );
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? result.post : post))
        );
      }

      return { success: true, message: result.message };
    } catch (err) {
      console.error("Error reporting post:", err);
      console.error("Error details:", err.message);
      return { success: false, message: err.message };
    }
  };

  const checkReportStatus = async (postId) => {
    try {
      const response = await fetch(
        `${config.API_URL}/auth/posts/${postId}/reports`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report status");
      }

      const data = await response.json();
      console.log("Report status:", data);
      return data;
    } catch (err) {
      console.error("Error checking report status:", err);
      return null;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        loading,
        error,
        fetchPosts,
        fetchUserPosts,
        deletePost,
        updatePost,
        createPost,
        upvotePost,
        downvotePost,
        reportPost,
        checkReportStatus,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

export default PostContext;
