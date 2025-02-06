import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Student, Enrollment, Section, Course } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Fade from 'react-bootstrap/Fade';
import Spinner from 'react-bootstrap/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ProfessorSection = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [section, setSection] = useState<Section | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const { sectionId, id: professorId } = useParams();
    const navigate = useNavigate();

    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

    const handleGradeChange = async (enrollmentId: number, newGrade: string) => {
        try {
            await api.put(`/enrollments/${enrollmentId}`, { grade: newGrade });
            setEnrollments(prev => 
                prev.map(enrollment => 
                    enrollment.id === enrollmentId 
                        ? { ...enrollment, grade: newGrade }
                        : enrollment
                )
            );
        } catch (error) {
            console.error('Error updating grade:', error);
            setError('Failed to update grade. Please try again.');
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isLoading) {
                setShow(true);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [isLoading]);

    useEffect(() => {
        setIsLoading(true);
        setShow(false);
        Promise.all([
            api.get<Section>(`/sections/${sectionId}`),
            api.get<Enrollment[]>(`/sections/${sectionId}/enrollments`),
            api.get<Student[]>('/students')
        ])
            .then(([sectionResponse, enrollmentsResponse, studentsResponse]) => {
                setSection(sectionResponse.data);
                setEnrollments(enrollmentsResponse.data);
                setStudents(studentsResponse.data);
                
                // Fetch course details for the section
                api.get<Course>(`/courses/${sectionResponse.data.course_id}`)
                    .then(courseResponse => {
                        setCourse(courseResponse.data);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching course:', error);
                        setError('Failed to load course details.');
                        setIsLoading(false);
                    });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load section data. Please try again later.');
                setIsLoading(false);
            });
    }, [sectionId]);

    useDocumentTitle(course ? `Section ${section?.section_number} - ${course.title}` : 'Loading');

    // Filter students based on search term
    const filteredEnrollments = enrollments.filter(enrollment => {
        const student = students.find(s => s.id === enrollment.student_id);
        if (!student) return false;
        
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) ||
               student.campus_wide_id.toLowerCase().includes(searchLower);
    });

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading section details...</p>
                </div>
            </Container>
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
                        <div>
                            <h2>{course?.title}</h2>
                            <h5 className="text-muted">Section {section?.section_number}</h5>
                        </div>
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate(`/professor/${professorId}/mycourses`)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>Back to My Courses
                        </Button>
                    </div>

                    <Form className="mb-4" onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search by student name or ID..."
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

                    {filteredEnrollments.length === 0 && !error ? (
                        <Alert variant="info">
                            {searchTerm ? 'No students match your search.' : 'No students enrolled in this section.'}
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnrollments.map((enrollment) => {
                                    const student = students.find(s => s.id === enrollment.student_id);
                                    return (
                                        <tr key={enrollment.id}>
                                            <td>{student?.campus_wide_id}</td>
                                            <td>{student ? `${student.first_name} ${student.last_name}` : 'Unknown Student'}</td>
                                            <td>
                                                <Form.Select
                                                    value={enrollment.grade || ''}
                                                    onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                                                    size="sm"
                                                    style={{ width: '100px' }}
                                                >
                                                    <option value="">Select Grade</option>
                                                    {grades.map((grade) => (
                                                        <option key={grade} value={grade}>
                                                            {grade}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Container>
            </Fade>
        </>
    );
};

export default ProfessorSection;