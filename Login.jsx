import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Card, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import CustomToast from "../Toast";
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = response.data;
      
      // Store user data and token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToastMessage("Login successful!");
      setToastVariant("success");
      setShowToast(true);

      // Immediate role check and navigation
      const userRole = user.role.toLowerCase();
      console.log("User role:", userRole); // Debug log

      if (userRole === "vendor") {
        navigate("/vendor-dashboard");
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      setToastMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5}>
          <Card className="shadow border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">Welcome Back!</h2>
                <p className="text-muted">Please enter your credentials to login</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={isLoading}
                    className="py-2"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>

                <p className="text-center mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-success text-decoration-none">
                    Sign up here
                  </Link>
                </p>
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

export default Login;
