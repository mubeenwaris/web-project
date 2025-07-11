import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 px-4">
      <div className="container text-center text-md-start">
        <div className="row">
          {/* Left Side - Explore */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Explore Raw Material Supply Chain</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Login</a></li>
              <li><a href="#" className="text-light text-decoration-none">Signup</a></li>
              <li><a href="#" className="text-light text-decoration-none">About</a></li>
              <li><a href="#" className="text-light text-decoration-none">Search</a></li>
              <li><a href="#" className="text-light text-decoration-none">Filters</a></li>
            </ul>
          </div>

          {/* Cars by Category */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">RAW MATERIALS by Category</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">WOOD</a></li>
              <li><a href="#" className="text-light text-decoration-none">COAL</a></li>
              <li><a href="#" className="text-light text-decoration-none">CHEMICALS</a></li>
              <li><a href="#" className="text-light text-decoration-none">RAW clothes</a></li>
              <li><a href="#" className="text-light text-decoration-none">etc</a></li>
            </ul>
          </div>

          {/* Cars by Body Type */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">RAW MATERIAL BY PROVINCE</h5>
            <ul className="list-unstyled">
              <li>PUNJAB</li>
              <li>SINDH</li>
              <li>KPK</li>
              <li>BLOCHISTAN</li>
              <li>gilgit baltistan</li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Subscribe to our Newsletter</h5>
            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="text-center my-4">
          <a href="#" className="mx-2 text-light"><i className="bi bi-facebook fs-4"></i></a>
          <a href="#" className="mx-2 text-light"><i className="bi bi-twitter fs-4"></i></a>
          <a href="#" className="mx-2 text-light"><i className="bi bi-instagram fs-4"></i></a>
          <a href="#" className="mx-2 text-light"><i className="bi bi-linkedin fs-4"></i></a>
        </div>

        {/* Copyright */}
        <div className="text-center border-top pt-3">
          <p className="mb-0">&copy; B9i (pvt)ltd. All rights reserved 2025.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
