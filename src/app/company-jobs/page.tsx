"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    if (router.query) {
      console.log("Router query:", router.query);
      setCompanyId(router.query.companyId);
    }
  }, [router.query]);

  useEffect(() => {
    if (companyId) {
      console.log("Fetching jobs for companyId:", companyId);
      fetchJobs(companyId);
    }
  }, [companyId]);

  const fetchJobs = async (companyId) => {
    try {
      const response = await fetch(`/api/jobs?companyId=${companyId}`);
      const data = await response.json();
      console.log("Fetched jobs:", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Jobs at {companyId}</h1>
      <div style={styles.gridContainer}>
        {jobs.map((job) => (
          <div key={job.id} style={styles.jobCard}>
            <h2 style={styles.jobTitle}>{job.title}</h2>
            <p style={styles.jobDescription}>{job.description}</p>
            <p style={styles.jobLocation}>{job.location}</p>
            <p style={styles.jobCompanyName}>{job.company_name}</p>
            <p style={styles.jobSalaries}>{job.salaries}</p>
            <p style={styles.jobTypes}>{job.types}</p>
            <p style={styles.jobCompanyDescription}>{job.company_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    color: '#333',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#333',
    textAlign: 'center',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  jobCard: {
    padding: '1.5rem',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'center',
  },
  jobCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  jobTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.75rem',
    color: '#333',
  },
  jobDescription: {
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: '#666',
  },
  jobLocation: {
    fontSize: '1rem',
    color: '#333',
  },
  jobCompanyName: {
    fontSize: '1rem',
    color: '#333',
  },
  jobSalaries: {
    fontSize: '1rem',
    color: '#333',
  },
  jobTypes: {
    fontSize: '1rem',
    color: '#333',
  },
  jobCompanyDescription: {
    fontSize: '1rem',
    color: '#333',
  },
};

// Add hover effect to job cards
document.addEventListener('DOMContentLoaded', () => {
  const jobCards = document.querySelectorAll('[style*="jobCard"]');
  jobCards.forEach(card => {
    card.addEventListener('mouseover', () => {
      card.style.transform = styles.jobCardHover.transform;
      card.style.boxShadow = styles.jobCardHover.boxShadow;
    });
    card.addEventListener('mouseout', () => {
      card.style.transform = '';
      card.style.boxShadow = styles.jobCard.boxShadow;
    });
  });
});