import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Fade } from 'react-bootstrap';
import api from '../services/api';
import useDocumentTitle from '../hooks/useDocumentTitle';

interface Props {
  isEdit?: boolean;
}

const AdminProfForm: React.FC<Props> = ({ isEdit = false }) => {
  const { id } = useParams();
  useDocumentTitle(isEdit ? 'Edit Professor' : 'Add New Professor');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [show, setShow] = useState(false);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [number, setNumber] = useState('');
  const [sex, setSex] = useState('');
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [collegeDegrees, setCollegeDegrees] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) {
        setShow(true);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      setShow(false);
      api.get(`/professors/${id}`)
        .then(response => {
          const professor = response.data;
          setSocialSecurityNumber(professor.social_security_number);
          setName(professor.name);
          setStreetAddress(professor.street_address);
          setCity(professor.city);
          setState(professor.state);
          setZipCode(professor.zip_code);
          setAreaCode(professor.area_code);
          setNumber(professor.number);
          setSex(professor.sex);
          setTitle(professor.title);
          setSalary(professor.salary.toString());
          setCollegeDegrees(professor.college_degrees);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching professor:', error);
          setError('Failed to load professor details.');
          setLoading(false);
        });
    } else {
      setShow(true);
    }
  }, [isEdit, id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // SSN validation - must be exactly 9 numeric characters
    if (!/^\d{9}$/.test(socialSecurityNumber)) {
      errors.ssn = 'SSN must be exactly 9 numeric characters (no dashes)';
    }

    // State validation - must be exactly 2 characters
    if (!/^[A-Za-z]{2}$/.test(state)) {
      errors.state = 'State must be exactly 2 characters (e.g., CA)';
    }

    // Zip code validation - only numbers and dashes
    if (!/^\d{5}$/.test(zipCode) && zipCode !== '') {
      errors.zipCode = 'Zip code can only contain numbers and must be 5 digits';
    }

    // Area code validation - only numbers, must be 3 digits
    if (!/^\d{3}$/.test(areaCode) && areaCode !== '') {
      errors.areaCode = 'Area code must be exactly 3 numeric digits';
    }

    // Phone number validation - only numbers, must be 7 digits
    if (!/^\d{7}$/.test(number) && number !== '') {
      errors.number = 'Phone number must be exactly 7 numeric digits (no dashes)';
    }

    // Salary validation - must be a positive number
    if (salary && !/^\d+(\.\d{0,2})?$/.test(salary)) {
      errors.salary = 'Salary must be a valid number with up to 2 decimal places';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const professorData = {
      social_security_number: socialSecurityNumber,
      name,
      street_address: streetAddress,
      city,
      state: state.toUpperCase(),
      zip_code: zipCode,
      area_code: areaCode,
      number,
      sex,
      title,
      salary: Number(salary),
      college_degrees: collegeDegrees,
    };

    try {
      if (isEdit && id) {
        await api.put(`/professors/${id}`, professorData);
        navigate(`/admin/prof/${id}`);
      } else {
        await api.post('/professors', professorData);
        navigate('/admin/proflist');
      }

    } catch (error) {
      console.error('Error saving professor:', error);
      setError(`Failed to ${isEdit ? 'update' : 'create'} professor. Please try again.`);
    }
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setSocialSecurityNumber(value);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 2);
    setState(value.toUpperCase());
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d-]/g, '').slice(0, 5);
    setZipCode(value);
  };

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setAreaCode(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setNumber(value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setSalary(value);
    }
  };

  if (loading) {
    return (
      <Fade in={show}>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading professor details...</p>
          </div>
        </Container>
      </Fade>
    );
  }

  return (
    <Fade in={show}>
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">{isEdit ? 'Edit Professor' : 'Add New Professor'}</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>SSN</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialSecurityNumber}
                      onChange={handleSSNChange}
                      isInvalid={!!validationErrors.ssn}
                      required
                      placeholder="Enter 9 digit SSN (e.g. 123456789)"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.ssn}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter full name"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Enter street address"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      value={state}
                      onChange={handleStateChange}
                      isInvalid={!!validationErrors.state}
                      placeholder="Enter state (e.g. CA)"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.state}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={zipCode}
                      onChange={handleZipCodeChange}
                      isInvalid={!!validationErrors.zipCode}
                      placeholder="Enter zip code"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.zipCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Area Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={areaCode}
                      onChange={handleAreaCodeChange}
                      isInvalid={!!validationErrors.areaCode}
                      placeholder="Enter 3 digit area code"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.areaCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={number}
                      onChange={handlePhoneNumberChange}
                      isInvalid={!!validationErrors.number}
                      placeholder="Enter 7 digit phone number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.number}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sex</Form.Label>
                    <Form.Select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="text"
                      value={salary}
                      onChange={handleSalaryChange}
                      isInvalid={!!validationErrors.salary}
                      placeholder="Enter salary"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.salary}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>College Degrees</Form.Label>
                <Form.Control
                  type="text"
                  value={collegeDegrees}
                  onChange={(e) => setCollegeDegrees(e.target.value)}
                  placeholder="Enter college degrees (e.g. B.S. Computer Science, M.S. Computer Science, Ph.D. Computer Science)"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  {isEdit ? 'Save Changes' : 'Add Professor'}
                </Button>
                <Button variant="secondary" onClick={() => navigate(isEdit ? `/admin/prof/${id}` : '/admin/proflist')}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fade>
  );
};

export default AdminProfForm;
