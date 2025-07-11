import React from "react";
import { Container, Accordion } from "react-bootstrap";
import "./FAQ.css";  // ✅ Import CSS file


const FAQ = () => {
  return (
    <Container className="faq-container">
      <h2 className="mt-5 text-center">Frequently Asked Questions</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is this platform about?</Accordion.Header>
          <Accordion.Body>
            This platform connects vendors and clients for seamless raw material supply chain management.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I register as a vendor or client?</Accordion.Header>
          <Accordion.Body>
            You can sign up as a vendor or client through the Sign Up page by selecting your role.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>What types of raw materials are listed here?</Accordion.Header>
          <Accordion.Body>
            Vendors can list materials like wood, coal, corn waste, and waste clothes.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Is there a fee to list raw materials?</Accordion.Header>
          <Accordion.Body>
            Currently, listing is free, but premium features may be available in the future.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>How can I contact a vendor or client?</Accordion.Header>
          <Accordion.Body>
            Once logged in, you can directly message or email vendors and clients.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Can I edit or delete my listings?</Accordion.Header>
          <Accordion.Body>
            Yes, vendors can edit or remove their listings from their dashboard.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>How secure is my data on this platform?</Accordion.Header>
          <Accordion.Body>
            We use secure encryption to protect user information.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Do you offer delivery services?</Accordion.Header>
          <Accordion.Body>
            No, we only connect vendors and clients; logistics need to be handled separately.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>How do I report a fraudulent vendor or client?</Accordion.Header>
          <Accordion.Body>
            You can report suspicious activity through the support section.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="9">
          <Accordion.Header>Who do I contact for technical support?</Accordion.Header>
          <Accordion.Body>
            For help, visit our Contact Us page or email support@example.com.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default FAQ;
