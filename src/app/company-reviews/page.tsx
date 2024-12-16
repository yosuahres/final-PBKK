"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function CompanyReviews() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
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

    fetchCompanies();
    fetchIndustryOptions();
  }, []);

  useEffect(() => {
    fetchCompanies(industry, location);
  }, [industry, location]);

  const fetchCompanies = async (selectedIndustry = "", selectedLocation = "") => {
    try {
      const response = await fetch(`/api/jobs?typesOnly=false&industry=${selectedIndustry}&location=${selectedLocation}`);
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
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
            <>
              <div style={styles.email} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {userEmail} <span style={dropdownOpen ? styles.triangleUp : styles.triangleDown}></span>
              </div>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <a href="/profile" style={styles.dropdownItem}>Profile</a>
                  <button onClick={handleSignOut} style={styles.dropdownItem}>Sign Out</button>
                </div>
              )}
            </>
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
        <h1 style={styles.header}>Find great places to work</h1>
        <div style={styles.dropdownContainer}>
          <div style={styles.dropdown}>
            <label style={styles.dropdownLabel}>Industry</label>
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
          <div style={styles.dropdown}>
            <label style={styles.dropdownLabel}>Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.dropdownSelect}
            >
              <option value="">All Locations</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Miami">Miami</option>
              <option value="Seattle">Seattle</option>
              <option value="Boston">Boston</option>
              <option value="Austin">Austin</option>
            </select>
          </div>
        </div>
        <div style={styles.gridContainer}>
          {companies.map((company, index) => (
            <div key={index} style={styles.companyCard}>
              <h2 style={styles.companyName}>{company.company_name}</h2>
              <p style={styles.companyIndustry}>{company.types}</p>
              <p style={styles.companyDescription}>{company.company_description}</p>
              <div style={styles.buttonContainer}>
                <button style={styles.exploreButton}>Explore</button>
                <button style={styles.jobsButton}>See Jobs</button>
              </div>
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
    position: 'relative',
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
  email: {
    cursor: 'pointer',
    color: '#007bff',
  },
  dropdown: {
    position: 'absolute',
    top: '2.5rem',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  dropdownItem: {
    display: 'block',
    padding: '0.5rem 1rem',
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    width: '100%',
  },
  triangleUp: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #007bff',
  },
  triangleDown: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #007bff',
  },
  content: {
    width: '100%',
    maxWidth: '800px',
    textAlign: 'left',
  },
  header: {
    fontSize: '2.5rem',
    marginTop: '6rem',
    marginBottom: '1rem',
    color: 'black',
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    width: '100%',
  },
  companyCard: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  companyName: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: 'black',
  },
  companyIndustry: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: 'gray',
  },
  companyDescription: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: 'black',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  exploreButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  jobsButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
};