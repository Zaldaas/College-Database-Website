import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Fade } from 'react-bootstrap';
import api from '../services/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Professor } from '../types.d';

interface Props {
  isEdit?: boolean;
}

const AdminDepartmentForm: React.FC<Props> = ({ isEdit = false }) => {
  const { id } = useParams();
  useDocumentTitle(isEdit ? 'Edit Department' : 'Add New Department');


  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [chairpersonId, setChairpersonId] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) {
        setShow(true);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    setShow(false);
    // Fetch professors for the dropdown
    api.get('/professors')
      .then(response => {
        setProfessors(response.data);
        if (isEdit && id) {
          return api.get(`/departments/${id}`);
        } else {
          setLoading(false);
        }
      })
      .then(response => {
        if (response) {
          const department = response.data;
          setName(department.name);
          setTelephone(department.telephone);
          setOfficeLocation(department.office_location);
          setChairpersonId(department.chairperson_id);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
        setLoading(false);
      });
  }, [isEdit, id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Phone number validation - only numbers, must be 10 digits
    if (!/^\d{10}$/.test(telephone) && telephone !== '') {
      errors.telephone = 'Phone number must be exactly 10 numeric digits (no dashes)';
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

    const departmentData = {
      name,
      telephone,
      office_location: officeLocation,
      chairperson_id: chairpersonId,
    };

    try {
      if (isEdit && id) {
        await api.put(`/departments/${id}`, departmentData);
        navigate(`/admin/department/${id}`);
      } else {
        await api.post('/departments', departmentData);
        navigate('/admin/departmentlist')
      }

    } catch (error) {
      console.error('Error saving department:', error);
      setError(`Failed to ${isEdit ? 'update' : 'create'} department. Please try again.`);
    }


  };

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setTelephone(value);
  };

  if (loading) {
    return (
      <Fade in={show}>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading department details...</p>
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
            <h2 className="mb-0">{isEdit ? 'Edit Department' : 'Add New Department'}</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter department name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control
                      type="text"
                      value={telephone}
                      onChange={handleTelephoneChange}
                      required
                      placeholder="Enter 10 digit telephone number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.telephone}
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Office Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={officeLocation}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                      placeholder="Enter office location"

                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chairperson</Form.Label>
                    <Form.Select
                      value={chairpersonId}
                      onChange={(e) => setChairpersonId(e.target.value)}
                    >
                      <option value="">Select Professor</option>
                      {professors.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  {isEdit ? 'Save Changes' : 'Add Department'}
                </Button>
                <Button variant="secondary" onClick={() => navigate(isEdit ? `/admin/department/${id}` : '/admin/departmentlist')}>
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

export default AdminDepartmentForm;
