// src/pages/Dashboard.js
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
// import Table from '../components/Table';
import UsersList from '../components/UsersList';
const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <UsersList />
      </main>
    </div>
    </div>
  );
};

export default Dashboard;

