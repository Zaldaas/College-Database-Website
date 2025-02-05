import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { Course, Department } from '../types.d';
import useDocumentTitle from '../hooks/useDocumentTitle';


const AdminCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');



  useDocumentTitle(course ? `Course - ${course.title}` : 'Course Details');


  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get('/departments')
    ])
      .then(([courseResponse, departmentsResponse]) => {
        setCourse(courseResponse.data);
        setDepartments(departmentsResponse.data);
        setLoading(false);
      })

      .catch(error => {
        console.error('Error fetching course:', error);
        setError('Failed to load course details.');
        setLoading(false);
      });

  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      navigate('/admin/courselist');

    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course.');
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

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Course not found.</Alert>
      </Container>
    );
  }


  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Course Details</h2>
          <div>
            <Button

              variant="light"
              className="me-2"
              onClick={() => navigate(`/admin/course/${id}/edit`)}
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
              <h4 className="text-primary mb-3">Course Name</h4>
              <p><strong>Course Number:</strong> {course.course_number}</p>
              <p><strong>Title:</strong> {course.title}</p>
            </Col>
            <Col md={6}>
              <h4 className="text-primary mb-3">Course Information</h4>
              <p><strong>Textbook:</strong> {course.textbook}</p>
              <p><strong>Units:</strong> {course.units}</p>
              <p><strong>Department:</strong> {
                course.department_id 
                  ? departments.find(dept => dept.id === course.department_id)?.name || 'Unknown Department'
                  : 'Undeclared'
              }</p>
              <p><strong>System ID:</strong> {course.id}</p>


            </Col>
          </Row>

          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate('/admin/courselist')}>
              Back to List
            </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCourseDetail;
