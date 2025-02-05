import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Department } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminDepartmentList = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get<Department[]>('/departments')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
                setError('Failed to load departments. Please try again later.');
            });
    }, []);

    useDocumentTitle('Department List');

    // Filter departments based on search term
    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2>Department List</h2>
                    <Link to="/admin/newdepartment">
                        <Button variant="primary">
                            <i className="bi bi-plus-circle me-2"></i>Add New Department
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
                            placeholder="Search by department name..."
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

                {filteredDepartments.length === 0 && !error ? (
                    <Alert variant="info">
                        {searchTerm ? 'No departments match your search.' : 'No departments found in the database.'}
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.name}</td>
                                    <td>
                                        <Link to={`/admin/department/${department.id}`}>
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

export default AdminDepartmentList;
