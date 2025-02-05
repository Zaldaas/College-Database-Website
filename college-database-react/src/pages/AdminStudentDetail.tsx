import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { Student, Department } from '../types.d';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useDocumentTitle(student ? `Student - ${student.first_name} ${student.last_name}` : 'Student Details');

  useEffect(() => {
    Promise.all([
      api.get(`/students/${id}`),
      api.get('/departments')
    ])
      .then(([studentResponse, departmentsResponse]) => {
        setStudent(studentResponse.data);
        setDepartments(departmentsResponse.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load student details.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      navigate('/admin/studentlist');

    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student.');
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

  if (!student) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Student not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Student Details</h2>
          <div>
            <Button
              variant="light"
              className="me-2"
              onClick={() => navigate(`/admin/student/${id}/edit`)}
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
              <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
              <p><strong>CWID:</strong> {student.campus_wide_id}</p>
              <p><strong>Major Department:</strong> {
                student.major_department_id 
                  ? departments.find(dept => dept.id === student.major_department_id)?.name || 'Unknown Department'
                  : 'Undeclared'
              }</p>
            </Col>
            <Col md={6}>
              <h4 className="text-primary mb-3">Contact Information</h4>
              <p><strong>Phone:</strong> {student.area_code && student.number ? 
                `(${student.area_code}) ${student.number.slice(0, 3)}-${student.number.slice(3)}` : 
                'Not provided'}
              </p>
              <p><strong>Address:</strong></p>
              <p className="ms-3 mb-0">{student.street_address}</p>
              <p className="ms-3 mb-0">{student.city}, {student.state} {student.zip_code}</p>
            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/studentlist')}>
              Back to List
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminStudentDetail;
