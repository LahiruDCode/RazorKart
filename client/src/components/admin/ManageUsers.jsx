import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../common/Menu';
import { generateUsersPDF } from '../../utils/pdfGenerator';
import './AdminDashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const initiateRoleChange = (userId, newRole) => {
    setPendingRoleChange({ userId, newRole });
    setShowRoleConfirmation(true);
  };

  const confirmRoleChange = async () => {
    try {
      if (!pendingRoleChange) return;
      
      const { userId, newRole } = pendingRoleChange;
      
      await axios.put(`http://localhost:5001/api/users/${userId}/role`, {
        role: newRole
      });
      
      fetchUsers(); // Refresh the list
      setSelectedUser(null);
      setShowRoleConfirmation(false);
      setPendingRoleChange(null);
    } catch (err) {
      setError('Error updating user role');
      console.error('Error:', err);
      setShowRoleConfirmation(false);
      setPendingRoleChange(null);
    }
  };

  const cancelRoleChange = () => {
    setShowRoleConfirmation(false);
    setPendingRoleChange(null);
  };

  const handleDownloadPDF = () => {
    generateUsersPDF(filteredUsers, 'RazorKart User Management Report');
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/users/${userId}/status`, {
        status: newStatus
      });
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Error updating user status');
      console.error('Error:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-layout">
      <Menu />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manage Users</h1>
          <button 
            className="pdf-export-btn" 
            onClick={handleDownloadPDF}
            title="Download as PDF"
          >
            <i className="fas fa-file-pdf"></i> Export PDF
          </button>
        </div>
        
        <div className="content-section">
          <div className="user-list">
            <div className="user-filters">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                className="filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="content-manager">Content Manager</option>
                <option value="inquiry-manager">Inquiry Manager</option>
              </select>
            </div>
            
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user._id}
                      className={selectedUser?._id === user._id ? 'selected' : ''}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {selectedUser?._id === user._id ? (
                          <select
                            value={user.role}
                            onChange={(e) => initiateRoleChange(user._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="admin">Admin</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="content-manager">Content Manager</option>
                            <option value="inquiry-manager">Inquiry Manager</option>
                          </select>
                        ) : (
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td>
                        <span 
                          className={`status-badge ${user.status}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(
                              user._id, 
                              user.status === 'active' ? 'inactive' : 'active'
                            );
                          }}
                        >
                          {user.status}
                        </span>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showRoleConfirmation && (
          <div className="modal-overlay">
            <div className="modal-content role-confirm-modal">
              <h3>Confirm Role Change</h3>
              <p>Are you sure you want to change this user's role?</p>
              <div className="modal-actions">
                <button 
                  className="cancel-button" 
                  onClick={cancelRoleChange}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-button" 
                  onClick={confirmRoleChange}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
