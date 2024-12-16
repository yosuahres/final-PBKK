"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const data = await response.json();
    console.log("Response data:", data); // Log the entire response data
    setMessage(data.message);
  
    if (response.ok) {
      if (data.token) {
        localStorage.setItem("token", data.token); // Store the token in local storage
        localStorage.setItem("role", data.role); // Store the role in local storage
        console.log("Token stored:", localStorage.getItem("token")); // Log the stored token
        console.log("Role stored:", localStorage.getItem("role")); // Log the stored role
        if (data.role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        console.error("Token not found in response");
      }
    } else {
      console.error("Login failed:", data.message);
      if (data.message === "User not found") {
        router.push("/register");
      }
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div style={styles.container}>
      <button onClick={handleHome} style={styles.homeButton}>Home</button>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.registerPrompt}>
        Don't have an account? <a href="/register" style={styles.registerLink}>Register</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    color: 'black',
    position: 'relative',
  },
  homeButton: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#6c757d',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: 'black',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    color: 'black',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: 'black',
  },
  button: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  message: {
    marginTop: '1rem',
    color: 'black',
  },
  registerPrompt: {
    marginTop: '1rem',
    color: 'black',
  },
  registerLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};