import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion"; // For animations
import "./AboutUs.css"; // Import CSS
import WOOD from "../Pages/WOOD.mp4"

const AboutUs = () => {
  return (
    <Container className="about-container mt-5">
      {/* Page Title with Animation */}
      <motion.h2 
        className="text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Us
      </motion.h2>

      <Row className="justify-content-center">
        <Col md={8}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-4 shadow">
              <Card.Body>
                {/* Who We Are */}
                <motion.h4 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Who We Are
                </motion.h4>
                <p>
                  We are a dedicated platform that connects raw material vendors with buyers. 
                  Our goal is to streamline the supply chain process, making it easier and 
                  more efficient for businesses to source quality raw materials.
                </p>

                {/* Our Mission */}
                <motion.h4 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Our Mission
                </motion.h4>
                <p>
                  To provide a seamless and transparent online marketplace for raw materials, 
                  enabling businesses to grow and thrive.
                </p>

                {/* Video Section */}
                <motion.div
                  className="video-container my-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <h4 className="text-center">Our Platform in Action 🎥</h4>
                  <video width="100%" height="auto" controls>
                    <source src={WOOD} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>

                {/* Partnerships & Achievements */}
                <motion.h4 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  Achievements 🏆
                </motion.h4>
                <Row className="text-center mt-3">
                  <Col md={6}>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="partnership-card"
                    >
                      <Card className="p-3 shadow">
                        <h5>A raw material buisness is unformal the achivement is we convert it into formal way</h5>
                      </Card>
                    </motion.div>
                  </Col>
                  </Row>

                {/* Sustainability & Eco-Friendly Approach */}
                <motion.h4 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  Sustainability & Eco-Friendly Approach 🌍
                </motion.h4>
                <p>
                  We prioritize sustainable sourcing and eco-friendly raw materials. 
                  Our platform supports businesses that focus on reducing waste and using 
                  recycled materials.
                </p>

                {/* Contact Us */}
                <motion.h4 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  Contact Us
                </motion.h4>
                <p>
                  📧 Email: contact@mubeenwaris2003@gmail.com <br />
                  📞 Phone: +92 309 4793091
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
