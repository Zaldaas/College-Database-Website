import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { Professor } from '../types.d';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminProfDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useDocumentTitle(professor ? `Professor - ${professor.name}` : 'Professor Details');

  useEffect(() => {
    api.get(`/professors/${id}`)
      .then(response => {
        setProfessor(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching professor:', error);
        setError('Failed to load professor details.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this professor?')) return;
    try {
      await api.delete(`/professors/${id}`);
      navigate('/admin/proflist');
    } catch (error) {
      console.error('Error deleting professor:', error);
      setError('Failed to delete professor.');
    }
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!professor) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Professor not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Professor Details</h2>
          <div>
            <Button
              variant="light"
              className="me-2"
              onClick={() => navigate(`/admin/prof/${id}/edit`)}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h4 className="text-primary mb-3">Personal Information</h4>
              <p><strong>Name:</strong> {professor.name}</p>
              <p><strong>SSN:</strong> {professor.social_security_number}</p>
              <p><strong>Sex:</strong> {professor.sex}</p>
            </Col>
            <Col md={6}>

              <h4 className="text-primary mb-3">Professional Information</h4>
              <p><strong>Title:</strong> {professor.title}</p>
              <p><strong>Salary:</strong> ${Number(professor.salary).toLocaleString()}</p>
              <p><strong>College Degrees:</strong> {professor.college_degrees}</p>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col md={6}>
              <h4 className="text-primary mb-3">Contact Information</h4>
              <p><strong>Phone:</strong> ({professor.area_code}) {professor.number.slice(0, 3)}-{professor.number.slice(3)}</p>
              <p><strong>Address:</strong></p>
              <p className="ms-3 mb-0">{professor.street_address}</p>
              <p className="ms-3 mb-0">{professor.city}, {professor.state} {professor.zip_code}</p>
            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/proflist')}>
              Back to List
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminProfDetail;
