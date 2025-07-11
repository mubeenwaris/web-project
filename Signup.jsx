import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import CustomToast from "../Toast";
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "client"
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      // Store the token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setToastMessage(`Successfully registered as a ${formData.role}! Redirecting...`);
      setToastVariant("success");
      setShowToast(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        if (formData.role === "vendor") {
          navigate("/vendor-dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setToastMessage(error.response?.data?.msg || "Registration failed. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="signup-container mt-5 pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    placeholder="Enter full name" 
                    value={formData.name} 
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    placeholder="Enter email" 
                    value={formData.email} 
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      placeholder="Enter password" 
                      value={formData.password} 
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      disabled={isLoading}
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      placeholder="Enter password again" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      disabled={isLoading}
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-4">
                  <Form.Label>Account Type</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="role-client"
                      name="role"
                      value="client"
                      label="Client Account"
                      checked={formData.role === "client"}
                      onChange={handleChange}
                      className="form-check-inline"
                      disabled={isLoading}
                    />
                    <Form.Check
                      type="radio"
                      id="role-vendor"
                      name="role"
                      value="vendor"
                      label="Vendor Account"
                      checked={formData.role === "vendor"}
                      onChange={handleChange}
                      className="form-check-inline"
                      disabled={isLoading}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    {formData.role === "vendor" 
                      ? "Vendor accounts can post and manage raw materials listings."
                      : "Client accounts can search and view raw materials listings."
                    }
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-success text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CustomToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage}
        variant={toastVariant}
      />
    </Container>
  );
};

export default Signup;
