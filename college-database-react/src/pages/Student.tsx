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
import { Student as StudentType } from '../types.d';


function Student() {
    useDocumentTitle('Student Login');
    const [cwid, setCwid] = useState('');
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
            const response = await api.get<StudentType[]>('/students');
            const students = response.data;
            const student = students.find(s => s.campus_wide_id === cwid);



            if (student) {
                navigate(`/student/${student.id}/menu`, {
                    state: { studentId: student.id }

                });
            } else {
                setError('Invalid campus wide ID');
            }

        } catch (error) {
            console.error('Error verifying student:', error);
            setError('An error occurred while verifying your credentials');
        }

    };

    const handleCWIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        setCwid(value);
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
                                <Form.Label htmlFor="inputCWID">Campus Wide ID</Form.Label>
                                <Form.Control
                                    type="tel"
                                    id="inputCWID"
                                    aria-describedby="cwidHelpBlock"
                                    value={cwid}
                                    onChange={handleCWIDChange}
                                    isInvalid={!!error}
                                    required
                                    placeholder="Enter your 9-digit CWID"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    autoComplete="off"
                                    style={{
                                        '-webkit-text-security': 'disc',
                                        'text-security': 'disc'
                                    } as React.CSSProperties}
                                />
                                <Form.Text id="cwidHelpBlock" muted>
                                    Please enter your campus wide ID.
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

export default Student;