import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import CustomToast from '../Toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchAllPosts();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    }
  };

  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setToastMessage('User deleted successfully!');
        setToastVariant('success');
        setShowToast(true);
        fetchUsers();
      } catch (err) {
        setToastMessage('Error deleting user. Please try again.');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setToastMessage('Post deleted successfully!');
        setToastVariant('success');
        setShowToast(true);
        fetchAllPosts();
      } catch (err) {
        setToastMessage('Error deleting post. Please try again.');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'posts'} 
            onClick={() => setActiveTab('posts')}
          >
            Manage Posts
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {activeTab === 'users' ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.vendor}</td>
                    <td>{post.price.toLocaleString()} PKR</td>
                    <td>{post.city}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant={toastVariant}
      />
    </Container>
  );
};

export default AdminDashboard; 