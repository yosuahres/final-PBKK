"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({ jobName: "", location: "" });
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredJobs = jobs.filter(job =>
      job.title.toLowerCase().includes(searchParams.jobName.toLowerCase()) &&
      job.location.toLowerCase().includes(searchParams.location.toLowerCase())
    );
    setJobs(filteredJobs);
    setSubmitted(true);
  };

  const handleApply = (jobId: string) => {
    const isLoggedIn = false; // Replace with actual login check
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push(`/apply/${jobId}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    if (name === "jobName" && value.length > 2) {
      const filteredRecommendations = jobs
        .filter(job => job.title.toLowerCase().includes(value.toLowerCase()))
        .map(job => job.title)
        .slice(0, 5);
      setRecommendations(filteredRecommendations);
    } else {
      setRecommendations([]);
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    setSearchParams({ ...searchParams, jobName: recommendation });
    setRecommendations([]);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/company-reviews" style={styles.navLink}>Company Reviews</a>
          <a href="/find-salaries" style={styles.navLink}>Find Salaries</a>
        </div>
        <div style={styles.navRight}>
          <a href="/login" style={styles.navLink}>Sign In</a>
          <span style={styles.separator}>|</span>
          <a href="/login" style={styles.navLink}>Employers / Post Job</a>
        </div>
      </nav>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="jobName"
              placeholder="Job Name"
              value={searchParams.jobName}
              onChange={handleInputChange}
              style={styles.input}
            />
            {recommendations.length > 0 && (
              <ul style={styles.recommendations}>
                {recommendations.map((rec, index) => (
                  <li
                    key={index}
                    style={styles.recommendationItem}
                    onClick={() => handleRecommendationClick(rec)}
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span style={styles.separator}>|</span>
          <div style={styles.inputContainer}>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={searchParams.location}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Search</button>
        </form>
      </div>
      {submitted && (
        <div style={styles.content}>
          <div style={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} style={styles.jobCard} onClick={() => handleJobClick(job)}>
                <h2 style={styles.jobTitle}>{job.title}</h2>
                <p style={styles.jobLocation}>{job.location}</p>
              </div>
            ))}
          </div>
          {selectedJob && (
            <div style={styles.jobDetails}>
              <h2 style={styles.jobTitle}>{selectedJob.title}</h2>
              <p style={styles.jobLocation}>{selectedJob.location}</p>
              <p style={styles.jobDescription}>{selectedJob.description}</p>
              <button onClick={() => handleApply(selectedJob.id)} style={styles.applyButton}>Apply</button>
            </div>
          )}
        </div>
      )}
      <footer style={styles.footer}>
        <p>© 2024 Yosua Hares</p>
      </footer>
    </div>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#007bff',
    zIndex: 1000,
    borderBottom: '1px solid #ccc',
  },
  navLeft: {
    display: 'flex',
    gap: '1rem',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  navLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  separator: {
    color: '#000',
    margin: '0 0.5rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    color: 'black',
  },
  searchContainer: {
    marginTop: '4rem', // Adjust to ensure content is not hidden behind the navbar
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    color: 'black',
    gap: '1rem',
    border: '1px solid black',
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    color: 'black',
  },
  recommendations: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '0.5rem',
    listStyle: 'none',
    padding: 0,
    zIndex: 1000,
  },
  recommendationItem: {
    padding: '0.5rem',
    cursor: 'pointer',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    width: '100%',
    marginTop: '2rem',
  },
  jobsList: {
    width: '30%',
    padding: '1rem',
    borderRight: '1px solid #ccc',
  },
  jobCard: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    cursor: 'pointer',
  },
  jobTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: 'black',
  },
  jobLocation: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: 'black',
  },
  jobDetails: {
    width: '70%',
    padding: '1rem',
  },
  jobDescription: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: 'black',
  },
  applyButton: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    width: '100%',
    padding: '1rem 2rem',
    borderTop: '1px solid #ccc',
    textAlign: 'center',
    backgroundColor: 'transparent',
    position: 'fixed',
    bottom: 0,
  },
};