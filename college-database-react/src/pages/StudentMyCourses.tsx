import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Course, Section, Enrollment } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Fade from 'react-bootstrap/Fade';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Spinner from 'react-bootstrap/Spinner';

const StudentMyCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    

    const { id } = useParams();
    const location = useLocation();
    const studentId = id || (location.state as { studentId: string })?.studentId;


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
            api.get<Section[]>('/sections'),
            api.get<Enrollment[]>('/enrollments')
        ])
            .then(([coursesResponse, sectionsResponse, enrollmentsResponse]) => {
                // Get all enrollments for this student
                const studentEnrollments = enrollmentsResponse.data.filter(
                    enrollment => enrollment.student_id === Number(studentId)
                );
                setEnrollments(studentEnrollments);

                // Get sections from student's enrollments
                const studentSections = sectionsResponse.data.filter(
                    section => studentEnrollments.some(enrollment => enrollment.section_id === section.id)
                );
                setSections(studentSections);

                // Get unique course IDs from student's sections
                const studentCourseIds = new Set(studentSections.map(section => section.course_id));

                // Filter and sort courses that the student is enrolled in
                const studentCourses = coursesResponse.data
                    .filter(course => studentCourseIds.has(course.id))
                    .sort((a, b) => a.course_number - b.course_number);

                setCourses(studentCourses);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load courses. Please try again later.');
                setLoading(false);
            });
    }, [studentId]);


    useDocumentTitle('My Courses');

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
                        <p className="mt-2">Loading your courses...</p>
                    </div>
                </Container>
            </Fade>
        );
    }

    return (
        <>
            <Navbar className="bg-body-tertiary mb-4">
              <Nav className="ms-auto me-3">
                <Navbar.Brand href={`/student/${studentId}/menu`}>Dashboard</Navbar.Brand>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/links">Links</Nav.Link>
              </Nav>

            </Navbar>
            <Fade in={show}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Courses</h2>
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
                            {searchTerm ? 'No courses match your search.' : 'You are not currently enrolled in any courses.'}
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Course Number</th>
                                    <th>Section</th>
                                    <th>Title</th>
                                    <th>Units</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => {
                                    const courseSections = sections.filter(section => section.course_id === course.id);
                                    return courseSections.map((section) => {
                                        const enrollment = enrollments.find(e => e.section_id === section.id);
                                        return (
                                            <tr key={`${course.id}-${section.id}`}>
                                                <td>{course.course_number}</td>
                                                <td>{section.section_number}</td>
                                                <td>{course.title}</td>
                                                <td>{course.units}</td>
                                                <td>{enrollment?.grade || 'N/A'}</td>
                                            </tr>
                                        );
                                    });
                                })}
                            </tbody>
                        </Table>
                    )}
                </Container>
            </Fade>
        </>
    );
};

export default StudentMyCourses;