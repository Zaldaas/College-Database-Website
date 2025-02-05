import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Student } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminStudentList = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get<Student[]>('/students')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setError('Failed to load students. Please try again later.');
            });
    }, []);

    useDocumentTitle('Student List');

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2>Student List</h2>
                    <Link to="/admin/newstudent">
                        <Button variant="primary">
                            <i className="bi bi-plus-circle me-2"></i>Add New Student
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
                            placeholder="Search by student name..."
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

                {filteredStudents.length === 0 && !error ? (
                    <Alert variant="info">
                        {searchTerm ? 'No students match your search.' : 'No students found in the database.'}
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>CWID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.first_name} {student.last_name}</td>
                                    <td>{student.campus_wide_id}</td>
                                    <td>
                                        <Link to={`/admin/student/${student.id}`}>
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

export default AdminStudentList;
