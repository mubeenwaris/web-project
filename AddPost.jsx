import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomToast from '../Toast';

const AddPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    titleCustom: '',
    description: '',
    price: '',
    city: '',
    cityCustom: '',
    phone: ''
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setToastMessage('Maximum 5 images allowed');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    setImages(files);
    
    // Create preview URLs for selected images
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Always start with +92
    if (!value.startsWith('+92')) {
      value = '+92' + value.replace(/^\+?92?/, '');
    }
    // Only allow +92 and 10 digits after
    if (!/^\+92\d{0,10}$/.test(value)) {
      setPhoneError('Phone number must be +92 followed by 10 digits');
    } else {
      setPhoneError('');
    }
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError || !/^\+92\d{10}$/.test(formData.phone)) {
      setPhoneError('Phone number must be +92 followed by 10 digits');
      return;
    }
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let imageUrls = [];
      
      // Only upload images if there are any
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('images', image);
        });

        // Upload images first
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', imageFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        // Make sure we have valid image URLs
        if (Array.isArray(uploadResponse.data)) {
          imageUrls = uploadResponse.data;
        } else {
          console.error('Invalid response format from upload:', uploadResponse.data);
          throw new Error('Invalid response from image upload');
        }
      }

      // Create post with image URLs
      const postData = {
        ...formData,
        title: formData.title === "Other" ? formData.titleCustom : formData.title,
        city: formData.city === "Others" ? formData.cityCustom : formData.city,
        images: imageUrls,
        price: Number(formData.price) // Convert price to number
      };

      const response = await axios.post('http://localhost:5000/api/vendor/posts', postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setToastMessage('Post created successfully!');
      setToastVariant('success');
      setShowToast(true);
      navigate('/vendor-dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      setToastMessage(error.response?.data?.msg || 'Failed to create post. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container className="mt-5 pt-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Add New Listing</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Select
                    name="title"
                    value={
                      ["Coal", "Wood", "Waste of corn", "Waste of Clothes", "Stones"].includes(formData.title)
                        ? formData.title
                        : formData.title
                    }
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        // Clear custom title if not "Other"
                        titleCustom: e.target.value === "Other" ? prev.titleCustom : ""
                      }));
                    }}
                    required
                    disabled={isLoading}
                    style={{
                      backgroundColor: 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Select material</option>
                    <option value="Coal">Coal</option>
                    <option value="Wood">Wood</option>
                    <option value="Waste of corn">Waste of corn</option>
                    <option value="Waste of Clothes">Waste of Clothes</option>
                    <option value="Stones">Stones</option>
                    <option value="Other">Other (type below)</option>
                  </Form.Select>
                  {formData.title === "Other" && (
                    <Form.Control
                      className="mt-2"
                      type="text"
                      name="titleCustom"
                      value={formData.titleCustom}
                      onChange={e => setFormData(prev => ({ ...prev, titleCustom: e.target.value }))}
                      placeholder="Enter custom material title"
                      required
                      disabled={isLoading}
                      style={{ backgroundColor: 'white' }}
                    />
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter material description"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (PKR)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        required
                        disabled={isLoading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Select
                        name="city"
                        value={
                          [
                            "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Multan", "Sargodha", "Bahawalpur", "Sialkot", "Sheikhupura", "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Gujrat", "Sahiwal", "Wah Cantonment", "Kasur", "Okara", "Chiniot", "Kamoke", "Hafizabad", "Sadiqabad", "Khanewal", "Mandi Bahauddin", "Muzaffargarh", "Muridke", "Pakpattan", "Vehari", "Jhelum", "Bhakkar", "Ahmedpur East", "Khanpur", "Gojra", "Mianwali", "Toba Tek Singh", "Samundri", "Shakargarh", "Kamalia", "Daska", "Burewala", "Bahawalnagar", "Lodhran", "Attock", "Chishtian", "Jaranwala", "Kot Addu", "Wazirabad", "Kahror Pakka", "Arifwala", "Chakwal", "Hasilpur", "Jalalpur Jattan", "Pattoki", "Others"
                          ].includes(formData.city)
                            ? formData.city
                            : formData.city
                        }
                        onChange={e => {
                          setFormData(prev => ({
                            ...prev,
                            city: e.target.value,
                            cityCustom: e.target.value === "Others" ? prev.cityCustom : ""
                          }));
                        }}
                        required
                        disabled={isLoading}
                        style={{
                          backgroundColor: 'white',
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="">Select city</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Gujranwala">Gujranwala</option>
                        <option value="Multan">Multan</option>
                        <option value="Sargodha">Sargodha</option>
                        <option value="Bahawalpur">Bahawalpur</option>
                        <option value="Sialkot">Sialkot</option>
                        <option value="Sheikhupura">Sheikhupura</option>
                        <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                        <option value="Jhang">Jhang</option>
                        <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                        <option value="Gujrat">Gujrat</option>
                        <option value="Sahiwal">Sahiwal</option>
                        <option value="Wah Cantonment">Wah Cantonment</option>
                        <option value="Kasur">Kasur</option>
                        <option value="Okara">Okara</option>
                        <option value="Chiniot">Chiniot</option>
                        <option value="Kamoke">Kamoke</option>
                        <option value="Hafizabad">Hafizabad</option>
                        <option value="Sadiqabad">Sadiqabad</option>
                        <option value="Khanewal">Khanewal</option>
                        <option value="Mandi Bahauddin">Mandi Bahauddin</option>
                        <option value="Muzaffargarh">Muzaffargarh</option>
                        <option value="Muridke">Muridke</option>
                        <option value="Pakpattan">Pakpattan</option>
                        <option value="Vehari">Vehari</option>
                        <option value="Jhelum">Jhelum</option>
                        <option value="Bhakkar">Bhakkar</option>
                        <option value="Ahmedpur East">Ahmedpur East</option>
                        <option value="Khanpur">Khanpur</option>
                        <option value="Gojra">Gojra</option>
                        <option value="Mianwali">Mianwali</option>
                        <option value="Toba Tek Singh">Toba Tek Singh</option>
                        <option value="Samundri">Samundri</option>
                        <option value="Shakargarh">Shakargarh</option>
                        <option value="Kamalia">Kamalia</option>
                        <option value="Daska">Daska</option>
                        <option value="Burewala">Burewala</option>
                        <option value="Bahawalnagar">Bahawalnagar</option>
                        <option value="Lodhran">Lodhran</option>
                        <option value="Attock">Attock</option>
                        <option value="Chishtian">Chishtian</option>
                        <option value="Jaranwala">Jaranwala</option>
                        <option value="Kot Addu">Kot Addu</option>
                        <option value="Wazirabad">Wazirabad</option>
                        <option value="Kahror Pakka">Kahror Pakka</option>
                        <option value="Arifwala">Arifwala</option>
                        <option value="Chakwal">Chakwal</option>
                        <option value="Hasilpur">Hasilpur</option>
                        <option value="Jalalpur Jattan">Jalalpur Jattan</option>
                        <option value="Pattoki">Pattoki</option>
                        <option value="Others">Other (type below)</option>
                      </Form.Select>
                      {formData.city === "Others" && (
                        <>
                          <Form.Control
                            className="mt-2"
                            type="text"
                            name="cityCustom"
                            value={formData.cityCustom}
                            onChange={e => setFormData(prev => ({ ...prev, cityCustom: e.target.value }))}
                            placeholder="Enter your city"
                            required
                            disabled={isLoading}
                            style={{ backgroundColor: 'white' }}
                          />
                          {formData.cityCustom && (
                            <div className="mt-1 text-success" style={{ fontWeight: 500 }}>
                              Selected City: {formData.cityCustom}
                            </div>
                          )}
                        </>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Product Images</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    multiple
                  />
                  
                  {previewUrls.length > 0 && (
                    <div className="mt-3 d-flex gap-3 flex-wrap">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '150px',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              padding: '2px 6px'
                            }}
                            onClick={() => removeImage(index)}
                            disabled={isLoading}
                          >
                            ×
                          </Button>
                          {index === 0 && (
                            <Badge 
                              bg="primary" 
                              style={{
                                position: 'absolute',
                                bottom: '5px',
                                left: '5px'
                              }}
                            >
                              Main Image
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    required
                    disabled={isLoading}
                    style={{ backgroundColor: 'white' }}
                    maxLength={13} // +92 plus 10 digits
                  />
                  <Form.Text className={phoneError ? 'text-danger' : 'text-muted'}>
                    {phoneError ? phoneError : 'Format: +92XXXXXXXXXX'}
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={isLoading || images.length === 0}
                  >
                    {isLoading ? 'Creating...' : 'Create Listing'}
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigate('/vendor-dashboard')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
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

export default AddPost;
