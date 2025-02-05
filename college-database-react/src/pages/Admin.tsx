import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'password') {
            navigate('/admin/list');
        } else {
            setError('Incorrect password');
        }
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
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                            <Form.Control
                                type="password"
                                id="inputPassword5"
                                aria-describedby="passwordHelpBlock"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!error}
                            />
                            <Form.Text id="passwordHelpBlock" muted>
                                Please enter the administrator password.
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
        </>
    );
}

export default Admin;