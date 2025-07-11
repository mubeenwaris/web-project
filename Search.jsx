import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion"; // For animations
import "./Search.css"; // Import your CSS for styling
import { useNavigate } from "react-router-dom"; 
import { FaSearch, FaTimes } from "react-icons/fa";

const Search = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: 1000000,
    name: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Immediately trigger search when filters change
    onSearch({
      ...filters,
      [name]: value
    });
  };

  const handlePostAd = () => {
    navigate("/add-post");
  };

  const clearFilters = () => {
    const resetFilters = {
      city: "",
      maxPrice: 1000000,
      name: ""
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <Container className="search-container">
      {/* Fixed Post Ad Button */}
      
      

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center mb-3 mt-5 heading">
          Find RAW materials in Pakistan
        </h2>
        <p className="text-center mb-4">
          With thousands of options, we have just the right one for you. Search for the best deals on raw materials based on your location, price range, and specific needs.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <Row className="justify-content-center">
        <Col md={10}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-4 shadow">
              <Card.Body>
                <Form>
                  <Row className="align-items-end">
                    {/* City Filter */}
                    <Col md={3}>
                      <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder="Enter city"
                            value={filters.city}
                            onChange={handleChange}
                          />
                          {filters.city && (
                            <Button
                              variant="link"
                              className="position-absolute"
                              style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
                              onClick={() => handleChange({ target: { name: 'city', value: '' } })}
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Price Range Filter */}
                    <Col md={4}>
                      <Form.Group controlId="formPriceRange">
                        <Form.Label>Maximum Price (PKR)</Form.Label>
                        <Form.Control
                          type="range"
                          name="maxPrice"
                          min="0"
                          max="10000000"
                          step="100000"
                          value={filters.maxPrice}
                          onChange={handleChange}
                        />
                        <div className="d-flex justify-content-between mt-2">
                          <span className="text-muted">0 PKR</span>
                          <span className="text-success fw-bold">
                            {Number(filters.maxPrice).toLocaleString()} PKR
                          </span>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Material Name Filter */}
                    <Col md={3}>
                      <Form.Group controlId="formName">
                        <Form.Label>Material Name</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={handleChange}
                          />
                          {filters.name && (
                            <Button
                              variant="link"
                              className="position-absolute"
                              style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }}
                              onClick={() => handleChange({ target: { name: 'name', value: '' } })}
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Clear Filters Button */}
                    <Col md={2} className="d-flex justify-content-end">
                      <Button 
                        variant="outline-secondary" 
                        onClick={clearFilters}
                        className="w-100"
                      >
                        Clear Filters
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Display results or additional content here */}
      <Row className="mt-5">
        <Col>
          <h4 className="text-center">Search Results</h4>
          {/* Display search results here */}
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
