import { Link } from "react-router-dom";  // ✅ Add this import
import { Navbar, Nav, Container } from "react-bootstrap";

const MyNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow" fixed="top"  style={{ backgroundColor: "#434343" }} >
      <Container>
        {/* Logo */}
    
        <Navbar.Brand as={Link} to="/"><img src="/LOGO.jpg" alt="Logo" width="50" height="50" />
</Navbar.Brand>


        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/"className="mx-3 text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/Login"className="mx-3 text-white">Login</Nav.Link>
            <Nav.Link as={Link} to="/signup" className="mx-3 text-white">Sign Up</Nav.Link>
            <Nav.Link as={Link} to="/faq" className="mx-3 text-white">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/AboutUs"className="mx-3 text-white">About Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
