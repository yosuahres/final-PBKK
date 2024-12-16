"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

const AdminDashboard = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    company_name: "",
    salaries: "",
    company_types: "",
    company_description: "",
  });
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (storedRole !== "admin") {
      router.push("/login");
    } else {
      setRole(storedRole);
      if (token) {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setMessage(data.message || "Job posted successfully!");

    if (response.ok) {
      setFormData({
        title: "",
        description: "",
        location: "",
        company_name: "",
        salaries: "",
        company_types: "",
        company_description: "",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    router.push("/login");
  };

  if (role !== "admin") {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLinks}>
          <a href="/admin-dashboard" style={styles.navLink}>Home</a>
          <a href="#post-job" style={styles.navLink}>Post Job</a>
        </div>
        <div style={styles.navRight}>
          <div style={styles.email} onClick={() => setDropdownOpen(!dropdownOpen)}>
            {email} <span style={dropdownOpen ? styles.triangleUp : styles.triangleDown}></span>
          </div>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <button onClick={handleLogout} style={styles.dropdownItem}>Sign Out</button>
            </div>
          )}
        </div>
      </nav>
      <div style={styles.content}>
        <div style={styles.addJobTitleContainer}>
          <h2 style={styles.title}>Add Job</h2>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Company Name</label>
          <input
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            required
            style={styles.input}
          />
          <label style={styles.label}>Company Types</label>
          <input
            type="text"
            placeholder="Company Types"
            value={formData.company_types}
            onChange={(e) => setFormData({ ...formData, company_types: e.target.value })}
            required
            style={styles.input}
          />
          <label style={styles.label}>Company Description</label>
          <textarea
            placeholder="Company Description"
            value={formData.company_description}
            onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
            required
            style={styles.textarea}
          />
          <label style={styles.label}>Job Title</label>
          <input
            type="text"
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={styles.input}
          />
          <label style={styles.label}>Job Description</label>
          <textarea
            placeholder="Job Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            style={styles.textarea}
          />
          <label style={styles.label}>Salary</label>
          <input
            type="text"
            placeholder="Salary"
            value={formData.salaries}
            onChange={(e) => setFormData({ ...formData, salaries: e.target.value })}
            required
            style={styles.input}
          />
          <label style={styles.label}>Location</label>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Post Job</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
      <footer style={styles.footer}>
        <p>© 2024 Yosua Hares</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    color: 'black',
    minHeight: '100vh',
  },
  navbar: {
    width: '100%',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #ccc',
    backgroundColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
  },
  navLink: {
    color: '#007bff',
    textDecoration: 'none',
    marginRight: '1rem',
    fontSize: '1rem',
  },
  navRight: {
    position: 'relative',
  },
  email: {
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
  },
  triangleDown: {
    marginLeft: '0.5rem',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #007bff',
  },
  triangleUp: {
    marginLeft: '0.5rem',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #007bff',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '2.5rem',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: 1000,
    width: '150px',
  },
  dropdownItem: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#333',
    borderBottom: '1px solid #ccc',
  },
  content: {
    flex: 1,
    marginTop: '6rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '2rem',
  },
  addJobTitleContainer: {
    width: '100%',
    maxWidth: '800px',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#ffeb3b', // Colorful background for the title
    marginBottom: '1rem',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: 'black',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: 'black',
    alignSelf: 'flex-start',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    color: 'black',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: 'black',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    color: 'black',
    height: '150px',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
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
  footer: {
    width: '100%',
    padding: '1rem 2rem',
    borderTop: '1px solid #ccc',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
};

export default AdminDashboard;