import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner, Fade, Modal } from 'react-bootstrap';
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
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useDocumentTitle(department ? `Department - ${department.name}` : 'Department List');

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
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading department details...</p>
        </div>
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
    <>
      <Fade in={show}>
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
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
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
      </Fade>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this department? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            setShowDeleteModal(false);
            handleDelete();
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDepartmentDetail;
