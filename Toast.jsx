import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';


const CustomToast = ({ show, onClose, message, variant = 'success' }) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide
        className="custom-toast"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {variant === 'success' ? 'Success!' : 'Error!'}
          </strong>
        </Toast.Header>
        <Toast.Body className={variant === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast; 