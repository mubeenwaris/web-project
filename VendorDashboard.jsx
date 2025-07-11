import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Tab, Tabs, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomToast from '../Toast';
import './VendorDashboard.css';

// Separate component for image rendering to prevent re-renders
const ProductImage = React.memo(({ imageUrl, title }) => {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!imageUrl) return '/placeholder.png';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  });
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (!imageUrl) {
      setImgSrc('/placeholder.png');
      return;
    }
    const newSrc = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
    setImgSrc(newSrc);
    setError(false);
  }, [imageUrl]);
  
  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc('/placeholder.png');
    }
  };

  return (
    <img 
      src={imgSrc}
      alt={title || 'Product'}
      style={{ 
        width: '50px', 
        height: '50px', 
        objectFit: 'cover', 
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}
      onError={handleError}
      crossOrigin="anonymous"
    />
  );
});

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    company: {
      name: '',
      description: '',
      website: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user || user.role !== 'vendor') {
        navigate('/login');
        return;
      }
      
      await fetchVendorData();
      await fetchPosts();
    };
    
    checkAuth();
  }, [navigate]);

  const fetchVendorData = async () => {
    try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

      const response = await axios.get('http://localhost:5000/api/vendor/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Ensure all nested objects exist
      const vendorData = {
        ...profile,
        ...response.data,
        address: {
          ...profile.address,
          ...(response.data.address || {})
        },
        company: {
          ...profile.company,
          ...(response.data.company || {})
        }
      };

      setProfile(vendorData);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      showToastMessage('Failed to load profile data', 'danger');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/vendor/posts', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToastMessage('Failed to load posts', 'danger');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/vendor/profile', profile, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProfile(prev => ({
        ...prev,
        ...response.data,
        address: {
          ...prev.address,
          ...(response.data.address || {})
        },
        company: {
          ...prev.company,
          ...(response.data.company || {})
        }
      }));
      
      setIsEditing(false);
      showToastMessage('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToastMessage(error.response?.data?.msg || 'Failed to update profile', 'danger');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

      try {
        const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/vendor/posts/${postId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.filter(post => post._id !== postId));
      showToastMessage('Post deleted successfully', 'success');
      } catch (error) {
      console.error('Error deleting post:', error);
      showToastMessage('Failed to delete post', 'danger');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Memoize the posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);

  // Early return if profile is not loaded
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="vendor-dashboard mt-5 pt-4">
      <h1 className="mb-4">Vendor Dashboard</h1>
      
      <Tabs defaultActiveKey="inventory" className="mb-4">
        <Tab eventKey="inventory" title="Inventory">
          <Card className="mb-4">
        <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>My Listings</h3>
                <Button variant="success" onClick={() => navigate('/add-post')}>
                  Add New Listing
              </Button>
            </div>

              <Table responsive striped hover>
              <thead>
                <tr>
                    <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>City</th>
                    <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {memoizedPosts.map(post => (
                  <tr key={post._id}>
                      <td>
                        {post.images && post.images.length > 0 ? (
                          <div className="d-flex align-items-center">
                            <ProductImage 
                              imageUrl={post.images[0]} 
                              title={post.title} 
                            />
                            {post.images.length > 1 && (
                              <Badge 
                                bg="info" 
                                className="ms-2"
                              >
                                +{post.images.length - 1}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <ProductImage title="No image available" />
                        )}
                      </td>
                    <td>{post.title}</td>
                      <td>PKR {post.price}</td>
                    <td>{post.city}</td>
                      <td>
                        <Badge bg="success">Active</Badge>
                      </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                          onClick={() => navigate(`/edit-post/${post._id}`)}
                      >
                        Edit
                      </Button>
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
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="profile" title="Profile Settings">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Profile Information</h3>
                {isEditing ? (
                  <Button 
                    variant="success"
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button 
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={profile.email || ''}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h4 className="mt-4 mb-3">Company Information</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.company?.name || ''}
                        onChange={(e) => handleInputChange(e, 'company')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={profile.company?.website || ''}
                        onChange={(e) => handleInputChange(e, 'company')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Company Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={profile.company?.description || ''}
                    onChange={(e) => handleInputChange(e, 'company')}
                    disabled={!isEditing || isLoading}
                  />
                </Form.Group>

                <h4 className="mt-4 mb-3">Address</h4>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="street"
                        value={profile.address?.street || ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={profile.address?.city || ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={profile.address?.state || ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={profile.address?.zipCode || ''}
                        onChange={(e) => handleInputChange(e, 'address')}
                        disabled={!isEditing || isLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
        </Card.Body>
      </Card>
        </Tab>
      </Tabs>

      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant={toastVariant}
      />
    </Container>
  );
};

export default VendorDashboard; 