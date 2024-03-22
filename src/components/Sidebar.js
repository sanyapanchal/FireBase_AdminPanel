import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faColumns, faBook, faLock } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../firebase'; // Import Firebase auth instance

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      console.log('User logged out successfully!');
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#333',
        color: 'white',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontSize: '1.5em',
          marginBottom: '20px',
        }}
      >
        Dashboard
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={menuItemStyle}>
          <FontAwesomeIcon icon={faUsers} />
          <Link to="/users" style={linkStyle}>
            Users
          </Link>
        </div>
        <div style={menuItemStyle}>
          <FontAwesomeIcon icon={faColumns} />
          <Link to="/layouts" style={linkStyle}>
            Layouts
          </Link>
        </div>
        <div style={menuItemStyle}>
          <FontAwesomeIcon icon={faBook} />
          <Link to="/logs" style={linkStyle}>
            Authentication
          </Link>
        </div>
        <div style={menuItemStyle}>
          <FontAwesomeIcon icon={faLock} />
          <Link to="/login" style={linkStyle} onClick={handleLogout}>
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '10px',
  fontSize: '1.2em',
};

export default Sidebar;

