import React, { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const { user } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL || "http://192.168.0.202:3000";

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/posts/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await fetch(`${apiUrl}/auth/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...postData,
          image: postData.image.startsWith("data:image")
            ? postData.image
            : `data:image/jpeg;base64,${postData.image}`,
        }),
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error("Server response was not in JSON format");
      }

      if (!response.ok) {
        throw new Error(errorData.message || "Failed to create post");
      }

      setPosts([errorData, ...posts]);
      setUserPosts([errorData, ...userPosts]);
      return { success: true, post: errorData };
    } catch (error) {
      console.error("Error creating post:", error);
      return { success: false, message: error.message };
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/auth/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }

      setPosts(posts.filter((post) => post._id !== postId));
      setUserPosts(userPosts.filter((post) => post._id !== postId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting post:", error);
      return { success: false, message: error.message };
    }
  };

  const updatePost = async (postId, updateData) => {
    try {
      const response = await fetch(`${apiUrl}/auth/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update post");
      }

      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
      setUserPosts(
        userPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      return { success: true, post: updatedPost };
    } catch (error) {
      console.error("Error updating post:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        fetchPosts,
        fetchUserPosts,
        createPost,
        deletePost,
        updatePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);

export default PostContext;
