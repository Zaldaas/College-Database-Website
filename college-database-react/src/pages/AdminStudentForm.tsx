import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Department } from '../types.d';

interface Props {
  isEdit?: boolean;
}

const AdminStudentForm: React.FC<Props> = ({ isEdit = false }) => {
  const { id } = useParams();
  useDocumentTitle(isEdit ? 'Edit Student' : 'Add New Student');


  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [campusWideId, setCampusWideId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [number, setNumber] = useState('');
  const [majorDepartmentId, setMajorDepartmentId] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // Fetch departments for the dropdown
    api.get('/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

    if (isEdit && id) {
      api.get(`/students/${id}`)
        .then(response => {
          const student = response.data;
          setCampusWideId(student.campus_wide_id);
          setFirstName(student.first_name);
          setLastName(student.last_name);
          setStreetAddress(student.street_address);
          setCity(student.city);
          setState(student.state);
          setZipCode(student.zip_code);
          setAreaCode(student.area_code || '');
          setNumber(student.number || '');
          setMajorDepartmentId(student.major_department_id);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching student:', error);
          setError('Failed to load student details.');
          setLoading(false);
        });
    }
  }, [isEdit, id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // CWID validation - must be exactly 9 numeric characters
    if (!/^\d{9}$/.test(campusWideId)) {
      errors.campusWideId = 'Campus Wide ID must be exactly 9 numeric characters (no dashes)';
    }

    // State validation - must be exactly 2 characters
    if (!/^[A-Za-z]{2}$/.test(state)) {
      errors.state = 'State must be exactly 2 characters (e.g., CA)';
    }

    // Zip code validation - only numbers and dashes
    if (!/^\d{5}$/.test(zipCode) && zipCode !== '') {
      errors.zipCode = 'Zip code can only contain numbers and must be 5 digits';
    }

    // Area code validation - only numbers, must be 3 digits if provided
    if (areaCode.trim() !== '' && !/^\d{3}$/.test(areaCode)) {
      errors.areaCode = 'Area code must be exactly 3 numeric digits';
    }

    // Phone number validation - only numbers, must be 7 digits if provided
    if (number.trim() !== '' && !/^\d{7}$/.test(number)) {
      errors.number = 'Phone number must be exactly 7 numeric digits (no dashes)';
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

    const studentData: any = {
      campus_wide_id: campusWideId,
      first_name: firstName,
      last_name: lastName,
      street_address: streetAddress,
      city,
      state: state.toUpperCase(),
      zip_code: zipCode,
      major_department_id: majorDepartmentId || null
    };

    // Only include phone fields if they have non-empty values
    if (areaCode.trim()) {
      studentData.area_code = areaCode;
    }
    if (number.trim()) {
      studentData.number = number;
    }

    try {
      if (isEdit && id) {
        await api.put(`/students/${id}`, studentData);
        navigate(`/admin/student/${id}`);
      } else {
        await api.post('/students', studentData);
        navigate('/admin/studentlist');
      }

    } catch (error) {
      console.error('Error saving student:', error);
      setError(`Failed to ${isEdit ? 'update' : 'create'} student. Please try again.`);
    }
  };

  const handleCampusWideIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setCampusWideId(value);
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
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
                    value={campusWideId}
                    onChange={handleCampusWideIdChange}
                    isInvalid={!!validationErrors.campusWideId}
                    required
                    placeholder="Enter 9 digit Campus Wide ID (e.g. 123456789)"

                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.campusWideId}
                  </Form.Control.Feedback>
                </Form.Group>

              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
              <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Enter last name"
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
                    placeholder="Enter 3 digit area code (optional)"
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
                    placeholder="Enter 7 digit phone number (optional)"
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
                  <Form.Label>Major Department</Form.Label>
                  <Form.Select
                    value={majorDepartmentId}
                    onChange={(e) => setMajorDepartmentId(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {isEdit ? 'Save Changes' : 'Add Student'}

              </Button>
              <Button variant="secondary" onClick={() => navigate(isEdit ? `/admin/student/${id}` : '/admin/studentlist')}>
                Cancel
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminStudentForm;
