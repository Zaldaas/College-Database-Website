import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Course, Section } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Spinner from 'react-bootstrap/Spinner';

const ProfessorEnroll = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);
    

    const { id } = useParams();
    const location = useLocation();
    const professorId = id || (location.state as { professorId: string })?.professorId;

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
            api.get<Course[]>('/courses'),
            api.get<Section[]>('/sections')
        ])
            .then(([coursesResponse, sectionsResponse]) => {
                // Get all sections without an assigned professor
                const unassignedSections = sectionsResponse.data.filter(
                    section => !section.professor_id
                );
                setSections(unassignedSections);

                // Get unique course IDs from unassigned sections
                const unassignedCourseIds = new Set(unassignedSections.map(section => section.course_id));

                // Filter and sort courses that have unassigned sections
                const availableCourses = coursesResponse.data
                    .filter(course => unassignedCourseIds.has(course.id))
                    .sort((a, b) => a.course_number - b.course_number);

                setCourses(availableCourses);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load courses. Please try again later.');
                setLoading(false);
            });
    }, [professorId]);

    const handleEnrollClick = (section: Section) => {
        setSelectedSection(section);
        setShowModal(true);
    };

    const handleConfirmEnroll = async () => {
        if (!selectedSection) return;

        try {
            await api.put(`/sections/${selectedSection.id}`, {
                professor_id: professorId
            });

            // Remove the enrolled section and its course if no more sections
            setSections(prev => prev.filter(s => s.id !== selectedSection.id));
            const remainingSectionsForCourse = sections.filter(
                s => s.course_id === selectedSection.course_id && s.id !== selectedSection.id
            );
            if (remainingSectionsForCourse.length === 0) {
                setCourses(prev => prev.filter(c => c.id !== selectedSection.course_id));
            }

            setShowModal(false);
        } catch (error) {
            console.error('Error enrolling in section:', error);
            setError('Failed to enroll in section. Please try again later.');
        }
    };

    useDocumentTitle('Available Courses');

    // Filter courses based on search term
    const filteredCourses = courses.filter(course => 
        course.course_number.toString().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Fade in={true}>
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="text-center">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2">Loading available courses...</p>
                    </div>
                </Container>
            </Fade>
        );
    }

    return (
        <>
            <Navbar className="bg-body-tertiary mb-4">
              <Nav className="ms-auto me-3">
                <Navbar.Brand href={`/professor/${professorId}/menu`}>Dashboard</Navbar.Brand>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/links">Links</Nav.Link>
              </Nav>
            </Navbar>
            <Fade in={show}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Available Courses</h2>
                    </div>

                    <Form className="mb-4" onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search by course number or title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Form>

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {filteredCourses.length === 0 && !error ? (
                        <Alert variant="info">
                            {searchTerm ? 'No courses match your search.' : 'There are no available courses to teach at this time.'}
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Course Number</th>
                                    <th>Section</th>
                                    <th>Title</th>
                                    <th>Units</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => {
                                    const courseSections = sections.filter(section => section.course_id === course.id);
                                    return courseSections.map((section) => (
                                        <tr key={`${course.id}-${section.id}`}>
                                            <td>{course.course_number}</td>
                                            <td>{section.section_number}</td>
                                            <td>{course.title}</td>
                                            <td>{course.units}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleEnrollClick(section)}
                                                >
                                                    Enroll
                                                </Button>
                                            </td>
                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </Table>
                    )}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Enrollment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you would like to enroll for this section? This action cannot be undone without administrator intervention.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                No
                            </Button>
                            <Button variant="primary" onClick={handleConfirmEnroll}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </Fade>
        </>
    );
};

export default ProfessorEnroll;