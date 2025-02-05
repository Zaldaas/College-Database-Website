import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Course, Department } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminCourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        Promise.all([
            api.get<Course[]>('/courses'),
            api.get<Department[]>('/departments')
        ])
            .then(([coursesResponse, departmentsResponse]) => {
                // Sort courses by course number when setting them
                const sortedCourses = coursesResponse.data.sort((a, b) => a.course_number - b.course_number);
                setCourses(sortedCourses);
                setDepartments(departmentsResponse.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load courses. Please try again later.');
            });
    }, []);

    useDocumentTitle('Course List');

    // Filter courses based on search term
    const filteredCourses = courses.filter(course => 
        course.course_number.toString().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar className="bg-body-tertiary mb-4">
              <Nav className="ms-auto me-3">
                <Navbar.Brand href="/admin/menu">Dashboard</Navbar.Brand>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/links">Links</Nav.Link>
              </Nav>
            </Navbar>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Course List</h2>
                    <Link to="/admin/newcourse">
                        <Button variant="primary">
                            <i className="bi bi-plus-circle me-2"></i>Add New Course
                        </Button>
                    </Link>
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
                        {searchTerm ? 'No courses match your search.' : 'No courses found in the database.'}
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Course Number</th>
                                <th>Title</th>
                                <th>Textbook</th>
                                <th>Units</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.course_number}</td>
                                    <td>{course.title}</td>
                                    <td>{course.textbook}</td>
                                    <td>{course.units}</td>
                                    <td>{departments.find(dept => dept.id === course.department_id)?.name || 'Unknown Department'}</td>
                                    <td>
                                        <Link to={`/admin/course/${course.id}`}>
                                            <Button variant="outline-primary" size="sm">
                                                View/Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default AdminCourseList;