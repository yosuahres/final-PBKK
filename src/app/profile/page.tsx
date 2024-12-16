"use client";

import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const ProfilePage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Decode the JWT token to get the user's email
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }

    // Fetch the applied jobs from the backend
    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch('/api/apply');
        if (response.ok) {
          const data = await response.json();
          setAppliedJobs(data);
        } else {
          console.error('Failed to fetch applied jobs');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      // Delete the job from the database
      const response = await fetch(`/api/apply?id=${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the job from the state
        const updatedJobs = appliedJobs.filter(job => job.id !== jobId);
        setAppliedJobs(updatedJobs);
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.userEmail}>Logged in as: {userEmail}</p>
      </header>
      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Applied Jobs</h2>
          {appliedJobs.length === 0 ? (
            <p style={styles.noJobs}>No jobs applied yet.</p>
          ) : (
            <ul style={styles.jobList}>
              {appliedJobs.map((job, index) => (
                <li key={`${job.id}-${index}`} style={styles.jobItem}>
                  <div style={styles.jobHeader}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <button onClick={() => handleDelete(job.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                  <p style={styles.jobLocation}>{job.location}</p>
                  <p style={styles.jobDescription}>{job.description}</p>
                  <div style={styles.jobDetails}>
                    <p><strong>Name:</strong> {job.name}</p>
                    <p><strong>Email:</strong> {job.email}</p>
                    <p><strong>Phone:</strong> {job.phone}</p>
                    <p><strong>Resume:</strong></p>
                    <pre style={styles.resumeContent}>{job.resume}</pre>
                    <p><strong>Cover Letter:</strong> {job.cover_letter}</p>
                    <p><strong>Applied At:</strong> {new Date(job.created_at).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
  },
  header: {
    backgroundColor: '#007bff',
    color: '#000',
    padding: '1rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    color: '#000',
  },
  userEmail: {
    fontSize: '1rem',
    margin: 0,
    color: '#000',
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#000',
  },
  section: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    color: '#000',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#000',
    textAlign: 'center',
  },
  noJobs: {
    fontSize: '1.25rem',
    color: '#000',
    textAlign: 'center',
  },
  jobList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#000',
  },
  jobItem: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '1rem',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    color: '#000',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    color: '#000',
  },
  jobTitle: {
    fontSize: '1.25rem',
    margin: 0,
    color: '#000',
  },
  jobLocation: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#000',
  },
  jobDescription: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#000',
  },
  jobDetails: {
    marginBottom: '0.5rem',
    color: '#000',
  },
  resumeContent: {
    backgroundColor: '#f0f0f0',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default ProfilePage;