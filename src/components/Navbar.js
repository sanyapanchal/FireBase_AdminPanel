import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router
import 'bootstrap/dist/css/bootstrap.min.css';
import image from "../images/Company_Logo.png";

const Navbar = () => {
  const myStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '20px',
    color: 'blue',  
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={image} // Replace with the path to your company logo
            alt="Logo"
            className="logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item" style={myStyle}>
              <Link className="nav-link font-weight-bold" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item"  style={myStyle}>
              <Link className="nav-link font-weight-bold" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item"  style={myStyle}>
              <Link className="nav-link font-weight-bold" to="/contact">
                Our Team
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
