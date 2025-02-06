import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';
import { Professor as ProfessorType } from '../types.d';

function Professor() {
    useDocumentTitle('Professor Login');
    const [ssn, setSsn] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.get<ProfessorType[]>('/professors');
            const professors = response.data;
            const professor = professors.find(p => p.social_security_number === ssn);

            if (professor) {
                navigate(`/professor/${professor.id}/menu`, {
                    state: { professorId: professor.id }
                });
            } else {
                setError('Invalid social security number');
            }

        } catch (error) {
            console.error('Error verifying professor:', error);
            setError('An error occurred while verifying your credentials');
        }
    };

    const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        setSsn(value);
    };

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Nav className="ms-auto me-3">
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/links">Links</Nav.Link>
                </Nav>
            </Navbar>
            <Fade in={show}>
                <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="inputSSN">Social Security Number</Form.Label>
                                <Form.Control
                                    type="password"
                                    id="inputSSN"
                                    aria-describedby="ssnHelpBlock"
                                    value={ssn}
                                    onChange={handleSSNChange}
                                    isInvalid={!!error}
                                    required
                                    placeholder="Enter your 9-digit SSN"
                                />
                                <Form.Text id="ssnHelpBlock" muted>
                                    Please enter your social security number.
                                </Form.Text>
                                {error && (
                                    <Form.Control.Feedback type="invalid">
                                        {error}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </div>
                </Container>
            </Fade>
        </>
    );
}

export default Professor;