import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal, Form as RBForm } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactStars from 'react-rating-stars-component';

const UserRoleIndicator = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div 
        className="position-fixed" 
        style={{
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '50px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <Badge bg="danger" style={{ padding: '0.5rem 1rem' }}>
          Not Logged In
        </Badge>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="outline-success" 
            size="sm" 
            onClick={() => navigate('/login')}
            style={{ borderRadius: '20px', padding: '0.25rem 1rem' }}
          >
            Login
          </Button>
          <Button 
            variant="success" 
            size="sm" 
            onClick={() => navigate('/signup')}
            style={{ borderRadius: '20px', padding: '0.25rem 1rem' }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const getBadgeVariant = (role) => {
    switch(role) {
      case 'vendor':
        return 'success';
      case 'client':
        return 'info';
      case 'admin':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div 
      className="position-fixed" 
      style={{
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '50px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}
    >
      <Badge bg="success" style={{ padding: '0.5rem 1rem' }}>
        Logged In
      </Badge>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#666' }}>Welcome,</span>
        <span style={{ fontWeight: 500 }}>{user.name}</span>
        <Badge bg={getBadgeVariant(user.role)} style={{ textTransform: 'capitalize', padding: '0.5rem 0.75rem' }}>
          {user.role}
        </Badge>
      </div>
      <div style={{ width: '1px', height: '24px', background: '#dee2e6' }} />
      <Button 
        variant="outline-danger" 
        size="sm" 
        onClick={handleLogout}
        style={{ 
          borderRadius: '20px',
          padding: '0.25rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        <span style={{ fontSize: '1.1em' }}>⏻</span> Logout
      </Button>
    </div>
  );
};

const getStarColor = (rating) => {
  if (rating >= 4) return '#28a745'; // Green
  if (rating >= 3) return '#ffc107'; // Yellow
  return '#dc3545'; // Red
};

const RawMaterialList = ({ searchFilters }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeMaterialId, setActiveMaterialId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleAddPostClick = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user) {
      navigate('/signup');
      return;
    }

    if (user.role === 'vendor') {
      navigate('/add-post');
    } else {
      navigate('/signup');
    }
  };

  const handleReviewSubmit = async () => {
    if (rating === 0 || !reviewText.trim()) return;
    const user = JSON.parse(localStorage.getItem('user'));
    const newReview = {
      userName: user?.name || 'Anonymous',
      rating,
      text: reviewText
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/${activeMaterialId}`,
        newReview
      );
      setReviews(prev => ({
        ...prev,
        [activeMaterialId]: [response.data, ...(prev[activeMaterialId] || [])]
      }));
      setReviewText('');
      setRating(0);
      setShowReviewModal(false);
    } catch (err) {
      // Optionally show error to user
    }
  };

  const handleOpenReviewModal = async (materialId) => {
    setActiveMaterialId(materialId);
    setShowReviewModal(true);
    setReviewText('');
    setRating(0);
    setLoadingReviews(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${materialId}`);
      setReviews(prev => ({
        ...prev,
        [materialId]: response.data
      }));
    } catch (err) {
      setReviews(prev => ({
        ...prev,
        [materialId]: []
      }));
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewText('');
    setRating(0);
    setActiveMaterialId(null);
  };

  const getAverageRating = (materialId) => {
    const materialReviews = reviews[materialId] || [];
    if (materialReviews.length === 0) return 0;
    return materialReviews.reduce((acc, r) => acc + r.rating, 0) / materialReviews.length;
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/posts");
        let filteredMaterials = response.data;

        // Apply filters if they exist
        if (searchFilters) {
          if (searchFilters.city) {
            filteredMaterials = filteredMaterials.filter(material => 
              material.city.toLowerCase().includes(searchFilters.city.toLowerCase())
            );
          }
          if (searchFilters.name) {
            filteredMaterials = filteredMaterials.filter(material => 
              material.title.toLowerCase().includes(searchFilters.name.toLowerCase())
            );
          }
          if (searchFilters.maxPrice) {
            filteredMaterials = filteredMaterials.filter(material => 
              material.price <= searchFilters.maxPrice
            );
          }
        }

        setMaterials(filteredMaterials);

        // Fetch reviews for all materials
        for (const material of filteredMaterials) {
          try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${material._id}`);
            setReviews(prev => ({
              ...prev,
              [material._id]: res.data
            }));
          } catch (err) {
            setReviews(prev => ({
              ...prev,
              [material._id]: []
            }));
          }
        }
      } catch (err) {
        setError("Failed to fetch materials. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [searchFilters]);

  return (
    <>
      <UserRoleIndicator />
      
      <Button
        variant="danger"
        className="position-fixed"
        style={{
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          border: 'none',
          background: 'linear-gradient(45deg, #dc3545, #ff4d5f)'
        }}
        onClick={handleAddPostClick}
      >
        + Add Material
      </Button>

      <Container className="mt-4">
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" role="status" variant="success">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : materials.length === 0 ? (
          <Alert variant="info">
            {searchFilters ? "No materials found matching your search criteria." : "No raw materials available at the moment."}
          </Alert>
        ) : (
          <Row>
            {materials.map((material) => (
              <Col md={12} key={material._id} className="mb-4">
                <Card className="border" style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <Row className="g-0">
                    <Col md={3}>
                      <Card.Img 
                        src={material.images && material.images.length > 0 
                          ? `http://localhost:5000${material.images[0]}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={material.title} 
                        style={{ 
                          width: "100%", 
                          height: "200px", 
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                        crossOrigin="anonymous"
                      />
                    </Col>
                    <Col md={9}>
                      <Card.Body className="position-relative" style={{ minHeight: "200px" }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h4 className="mb-0">{material.title}</h4>
                            <p className="text-muted mb-2">{material.city}, Pakistan</p>
                            <p className="mb-3" style={{ color: "#666" }}>{material.description}</p>
                          </div>
                          <div className="text-end" style={{ minWidth: 220 }}>
                            <h5 className="text-success mb-0">{material.price.toLocaleString()} PKR per ton</h5>
                            <Button
                              variant="outline-dark"
                              size="sm"
                              style={{ marginTop: 8 }}
                              onClick={() => handleOpenReviewModal(material._id)}
                            >
                              Add Review
                            </Button>
                            <div className="mt-2 ms-5 d-flex align-items-center" style={{gap: '0.5rem'}}>
                              <ReactStars
                                count={5}
                                value={Number(getAverageRating(material._id))}
                                edit={false}
                                size={20}
                                color="#e4e5e9"
                                activeColor={getStarColor(getAverageRating(material._id))}
                              />
                              <span style={{
                                fontWeight: 600,
                                color: getStarColor(getAverageRating(material._id)),
                                fontSize: '1.1em'
                              }}>
                                {reviews[material._id]?.length ? getAverageRating(material._id).toFixed(1) : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 w-100 pb-3" style={{ left: 0 }}>
                          <div className="d-flex justify-content-between align-items-center pe-3">
                            <div className="d-flex align-items-center">
                              <span className="me-2 ms-3">Vendor:</span>
                              <span className="text-muted">{material.vendor}</span>
                            </div>
                            <Button 
                              variant="success" 
                              size="sm" 
                              href={`tel:${material.phone}`}
                              style={{ 
                                borderRadius: "4px",
                                padding: "8px 16px",
                                fontSize: "14px"
                              }}
                            >
                              {material.phone}
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={handleCloseReviewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <ReactStars
              count={5}
              value={rating}
              onChange={setRating}
              size={30}
              activeColor={getStarColor(rating)}
            />
          </div>
          <RBForm.Group className="mb-3">
            <RBForm.Label>Review</RBForm.Label>
            <RBForm.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Write your review"
            />
          </RBForm.Group>
          {loadingReviews ? (
            <div className="text-center my-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            activeMaterialId && reviews[activeMaterialId]?.length > 0 && (
              <div className="mt-4 border-top pt-3">
                <h6>Previous Reviews:</h6>
                {reviews[activeMaterialId].map((review, index) => (
                  <div key={index} className="mb-3 p-2 bg-light rounded">
                    <div className="d-flex align-items-center mb-1">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        edit={false}
                        size={16}
                        activeColor={getStarColor(review.rating)}
                      />
                      <small className="text-muted ms-2">{new Date(review.date).toLocaleDateString()}</small>
                      <span className="ms-2 fw-bold" style={{color: '#333', fontSize: '0.95em'}}>{review.userName}</span>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>{review.text}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReviewModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit} disabled={rating === 0 || !reviewText.trim()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RawMaterialList;
