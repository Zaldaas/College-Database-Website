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
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Fade from 'react-bootstrap/Fade';
import Spinner from 'react-bootstrap/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminProfList = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

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
        api.get<Professor[]>('/professors')
            .then(response => {
                setProfessors(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching professors:', error);
                setError('Failed to load professors. Please try again later.');
                setLoading(false);
            });
    }, []);

    useDocumentTitle('Professor List');

    // Filter professors based on search term
    const filteredProfessors = professors.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading professors...</p>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Navbar className="bg-body-tertiary mb-4">
              <Nav className="ms-auto me-3">
                <Navbar.Brand href="/admin/menu">Dashboard</Navbar.Brand>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/links">Links</Nav.Link>
              </Nav>
            </Navbar>
            <Fade in={show}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Professor List</h2>
                        <Link to="/admin/newprof">
                            <Button variant="primary">
                                <i className="bi bi-plus-circle me-2"></i>Add New Professor
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
                                placeholder="Search by professor name..."
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

                    {filteredProfessors.length === 0 && !error ? (
                        <Alert variant="info">
                            {searchTerm ? 'No professors match your search.' : 'No professors found in the database.'}
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
                                {filteredProfessors.map((prof) => (
                                    <tr key={prof.id}>
                                        <td>{prof.name}</td>
                                        <td>{prof.social_security_number}</td>
                                        <td>
                                            <Link to={`/admin/prof/${prof.id}`}>
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
            </Fade>
        </>
    );
};

export default AdminProfList;
