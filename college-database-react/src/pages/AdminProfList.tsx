import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Professor } from '../types.d';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const AdminList = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        api.get<Professor[]>('/professors')
            .then(response => {
                setProfessors(response.data);
            })
            .catch(error => {
                console.error('Error fetching professors:', error);
                setError('Failed to load professors. Please try again later.');
            });
    }, []);

    return (
        <>
            <Navbar className="bg-body-tertiary mb-4">
              <Nav className="ms-auto me-3">
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/links">Links</Nav.Link>
              </Nav>
            </Navbar>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Professor List</h2>
                    <Link to="/admin/newprof">
                        <Button variant="primary">
                            <i className="bi bi-plus-circle me-2"></i>Add New Professor
                        </Button>
                    </Link>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                {professors.length === 0 && !error ? (
                    <Alert variant="info">
                        No professors found in the database.
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>SSN</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professors.map((prof) => (
                                <tr key={prof.id}>
                                    <td>{prof.name}</td>
                                    <td>{prof.social_security_number}</td>
                                    <td>
                                        <Link to={`/admin/${prof.id}`}>
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

export default AdminList;
