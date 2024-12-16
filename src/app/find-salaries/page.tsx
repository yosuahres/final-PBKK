"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function FindSalaries() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [jobs, setJobs] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }

    fetchJobs();
    fetchIndustryOptions();
  }, []);

  useEffect(() => {
    fetchJobs(what, where, industry, location);
  }, [industry, location]);

  const fetchJobs = async (title = "", location = "", selectedIndustry = "", selectedLocation = "") => {
    try {
      const response = await fetch(`/api/jobs?title=${title}&location=${location}&industry=${selectedIndustry}&location=${selectedLocation}`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchIndustryOptions = async () => {
    try {
      const response = await fetch("/api/jobs?typesOnly=true");
      const data = await response.json();
      setIndustryOptions(data.map((item) => item.types));
    } catch (error) {
      console.error("Error fetching industry options:", error);
    }
  };

  const handleProfile = () => {
    router.push("/profile");
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(what, where, industry, location);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
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
          {isLoggedIn ? (
            <div style={styles.emailContainer}>
              <div style={styles.email} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {userEmail} <span style={dropdownOpen ? styles.triangleUp : styles.triangleDown}></span>
              </div>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <button onClick={handleProfile} style={styles.dropdownItem}>Profile</button>
                  <button onClick={handleSignOut} style={styles.dropdownItem}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" style={styles.navLink}>Sign In</a>
              <span style={styles.separator}>|</span>
              <a href="/login" style={styles.navLink}>Post Job</a>
            </>
          )}
        </div>
      </nav>
      <div style={styles.content}>
        <h1 style={styles.header}>Discovering your earning potential</h1>
        <p style={styles.subHeader}>Explore high-paying careers, salaries, and job openings by industry and location.</p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchBox}>
            <div style={styles.dropdownContainer}>
              <div style={styles.dropdown}>
                <label style={styles.dropdownLabel}>What</label>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  style={styles.dropdownSelect}
                />
              </div>
              <div style={styles.dropdown}>
                <label style={styles.dropdownLabel}>Where</label>
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  style={styles.dropdownSelect}
                />
              </div>
            </div>
            <button type="submit" style={styles.searchButton}>Search</button>
          </div>
        </form>
        <h2 style={styles.browseHeader}>Browse top paying jobs by industry</h2>
        <h3 style={styles.smallHeader}>Choose an industry</h3>
        <div style={styles.dropdownContainer}>
          <div style={styles.dropdown}>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={styles.dropdownSelect}
            >
              <option value="">All Industries</option>
              {industryOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.gridContainer}>
          {jobs.map((job, index) => (
            <div key={index} style={styles.jobCard}>
              <h2 style={styles.jobName}>{job.title}</h2>
              <p style={styles.jobSalary}>Average Salary: ${job.salaries}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    color: 'black',
    minHeight: '100vh',
    position: 'relative',
  },
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
  navLinkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  separator: {
    color: '#000',
    margin: '0 0.5rem',
  },
  emailContainer: {
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
  triangleUp: {
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #007bff',
    display: 'inline-block',
    marginLeft: '0.5rem',
  },
  triangleDown: {
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #007bff',
    display: 'inline-block',
    marginLeft: '0.5rem',
  },
  content: {
    width: '100%',
    maxWidth: '800px',
    textAlign: 'left',
    marginTop: '6rem', // Adjust margin to account for fixed navbar
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: 'black',
  },
  subHeader: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: 'black',
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    width: '100%',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '2rem', // Add gap between industries dropdown and grid
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    width: '48%',
  },
  dropdownLabel: {
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: 'black',
  },
  dropdownSelect: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  searchButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginLeft: '1rem',
    marginTop: '2rem',
  },
  browseHeader: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: 'black',
  },
  smallHeader: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: 'black',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    width: '100%',
  },
  jobCard: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  jobName: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: 'black',
  },
  jobSalary: {
    fontSize: '1rem',
    color: 'black',
  },
};