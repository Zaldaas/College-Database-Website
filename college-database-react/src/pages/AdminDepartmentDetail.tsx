import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { Department, Professor } from '../types.d';
import useDocumentTitle from '../hooks/useDocumentTitle';


const AdminDepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [professors, setProfessors] = useState<Professor[]>([]);

  useDocumentTitle(department ? `Department - ${department.name}` : 'Department Details');


  useEffect(() => {
    Promise.all([   
      api.get(`/departments/${id}`),
      api.get('/professors')
    ])
      .then(([departmentResponse, professorsResponse]) => {
        setDepartment(departmentResponse.data);
        setProfessors(professorsResponse.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load department details.');
        setLoading(false);
      });

  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      navigate('/admin/departmentlist');

    } catch (error) {
      console.error('Error deleting department:', error);
      setError('Failed to delete department.');
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

  if (!department) {
    return (
      <Container className="py-5">

        <Alert variant="warning">Department not found.</Alert>
      </Container>
    );
  }


  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Department Details</h2>
          <div>
            <Button

              variant="light"
              className="me-2"
              onClick={() => navigate(`/admin/department/${id}/edit`)}
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
              <h4 className="text-primary mb-3">Department Information</h4>
              <p><strong>Name:</strong> {department.name}</p>
              <p><strong>Telephone:</strong> ({department.telephone.slice(0, 3)}) {department.telephone.slice(3, 6)}-{department.telephone.slice(6)}</p>
              <p><strong>Office Location:</strong> {department.office_location}</p>

            </Col>
            <Col md={6}>

              <h4 className="text-primary mb-3">Department Chair</h4>
              <p><strong>Chairperson:</strong> {
                department.chairperson_id 
                  ? professors.find(prof => prof.id === department.chairperson_id)?.name || 'Unknown Professor'
                  : 'Undeclared'
              }</p>

            </Col>
          </Row>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/departmentlist')}>
              Back to List
            </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDepartmentDetail;
