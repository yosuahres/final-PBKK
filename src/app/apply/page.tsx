"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ApplyPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Application submitted successfully:', data);
        router.push('/dashboard');
      } else {
        console.error('Failed to submit application');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Apply for Job</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="phone" style={styles.label}>Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="resume" style={styles.label}>Resume:</label>
          <textarea id="resume" name="resume" value={formData.resume} onChange={handleChange} required style={styles.textarea} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="coverLetter" style={styles.label}>Cover Letter:</label>
          <textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleChange} required style={styles.textarea} />
        </div>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    color: '#333',
    resize: 'vertical',
    minHeight: '100px',
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
};

export default ApplyPage;