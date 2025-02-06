import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Spinner, Table, Modal, Form, Fade } from 'react-bootstrap';
import api from '../services/api';
import { Course, Department, Section, Professor } from '../types.d';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<Section> | null>(null);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  useDocumentTitle(course ? `Course - ${course.title}` : 'Course List');

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
      api.get(`/courses/${id}`),
      api.get('/departments'),
      api.get(`/courses/${id}/sections`),
      api.get('/professors')
    ])
      .then(([courseResponse, departmentsResponse, sectionsResponse, professorsResponse]) => {
        setCourse(courseResponse.data);
        setDepartments(departmentsResponse.data);
        setSections(sectionsResponse.data);
        setProfessors(professorsResponse.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load course details.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${id}`);
      navigate('/admin/courselist');
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course.');
    }
  };

  const handleAddSection = async () => {
    if (!editingSection) return;
    
    try {
      const sectionData = {
        ...editingSection,
        beginning_time: editingSection.beginning_time ? `${editingSection.beginning_time}:00` : null,
        ending_time: editingSection.ending_time ? `${editingSection.ending_time}:00` : null,
        // Ensure other nullable fields are properly handled
        classroom: editingSection.classroom || null,
        number_of_seats: editingSection.number_of_seats || null,
        meeting_days: editingSection.meeting_days || null,
        professor_id: editingSection.professor_id || null
      };

      if (editingSection.id) {
        // Update existing section
        const response = await api.put(`/sections/${editingSection.id}`, sectionData);
        setSections(sections.map(s => s.id === editingSection.id ? response.data : s));
      } else {
        // Create new section
        const response = await api.post('/sections', sectionData);
        setSections([...sections, response.data]);
      }

      setShowModal(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      setError('Failed to save section.');
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    try {
      await api.delete(`/sections/${sectionId}`);
      setSections(sections.filter(section => section.id !== sectionId));
    } catch (error) {
      console.error('Error deleting section:', error);
      setError('Failed to delete section.');
    }
  };

  const openAddModal = () => {
    setEditingSection({
      section_number: 1,
      course_id: Number(id)
    });
    setShowModal(true);
  };

  const openEditModal = (section: Section) => {
    setEditingSection({
      ...section,
      beginning_time: section.beginning_time?.slice(0, 5),
      ending_time: section.ending_time?.slice(0, 5)
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading course details...</p>
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

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Course not found.</Alert>
      </Container>
    );
  }

  return (
    <>
      <Fade in={show}>
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
                <Button variant="danger" onClick={() => {
                  setShowDeleteModal(true);
                }}>
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
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-primary mb-0">Sections</h4>
                    <Button variant="success" size="sm" onClick={openAddModal}>
                      Add Section
                    </Button>
                  </div>
                  {sections.length === 0 ? (
                    <Alert variant="info">No sections available for this course.</Alert>
                  ) : (
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Section #</th>
                          <th>Professor</th>
                          <th>Room</th>
                          <th>Schedule</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map((section) => (
                          <tr key={section.id}>
                            <td>{section.section_number}</td>
                            <td>
                              {section.professor_id
                                ? professors.find(p => p.id === section.professor_id)?.name || 'Unknown'
                                : 'TBA'}
                            </td>
                            <td>{section.classroom || 'TBA'}</td>
                            <td>
                              {section.meeting_days && section.beginning_time && section.ending_time
                                ? `${section.meeting_days} ${section.beginning_time.slice(0, 5)}-${section.ending_time.slice(0, 5)}`
                                : 'TBA'}
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => openEditModal(section)}
                              >
                                View/Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setShowDeleteSectionModal(true);
                                  setSectionToDelete(section.id);
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <h4 className="text-primary mb-3">Course Information</h4>
                  <p><strong>Textbook:</strong> {course.textbook}</p>
                  <p><strong>Units:</strong> {course.units}</p>
                  <p><strong>Department:</strong> {
                    course.department_id 
                      ? departments.find(dept => dept.id === course.department_id)?.name || 'Unknown Department'
                      : 'Undeclared'
                  }</p>
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
      </Fade>

      {/* Add/Edit Section Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingSection(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSection?.id ? 'Edit Section' : 'Add New Section'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Section Number</Form.Label>
              <Form.Control
                type="number"
                value={editingSection?.section_number}
                onChange={(e) => setEditingSection(prev => ({
                  ...prev!,
                  section_number: parseInt(e.target.value)
                }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Professor</Form.Label>
              <Form.Select
                value={editingSection?.professor_id || ''}
                onChange={(e) => setEditingSection(prev => ({
                  ...prev!,
                  professor_id: e.target.value ? parseInt(e.target.value) : undefined
                }))}
              >
                <option value="">Select Professor (Optional)</option>
                {professors.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Classroom</Form.Label>
              <Form.Control
                type="text"
                value={editingSection?.classroom || ''}
                onChange={(e) => setEditingSection(prev => ({
                  ...prev!,
                  classroom: e.target.value
                }))}
                placeholder="Enter classroom (Optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Seats</Form.Label>
              <Form.Control
                type="number"
                value={editingSection?.number_of_seats || ''}
                onChange={(e) => setEditingSection(prev => ({
                  ...prev!,
                  number_of_seats: parseInt(e.target.value)
                }))}
                placeholder="Enter number of seats (Optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Meeting Days</Form.Label>
              <Form.Control
                type="text"
                value={editingSection?.meeting_days || ''}
                onChange={(e) => setEditingSection(prev => ({
                  ...prev!,
                  meeting_days: e.target.value
                }))}
                placeholder="e.g. MWF (Optional)"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={editingSection?.beginning_time || ''}
                    onChange={(e) => setEditingSection(prev => ({
                      ...prev!,
                      beginning_time: e.target.value
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={editingSection?.ending_time || ''}
                    onChange={(e) => setEditingSection(prev => ({
                      ...prev!,
                      ending_time: e.target.value
                    }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setEditingSection(null);
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSection}>
            {editingSection?.id ? 'Save Changes' : 'Add Section'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Course Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course? This action cannot be undone.
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

      {/* Delete Section Modal */}
      <Modal show={showDeleteSectionModal} onHide={() => {
        setShowDeleteSectionModal(false);
        setSectionToDelete(null);
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this section? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowDeleteSectionModal(false);
            setSectionToDelete(null);
          }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            if (sectionToDelete !== null) {
              handleDeleteSection(sectionToDelete);
            }
            setShowDeleteSectionModal(false);
            setSectionToDelete(null);
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminCourseDetail;
