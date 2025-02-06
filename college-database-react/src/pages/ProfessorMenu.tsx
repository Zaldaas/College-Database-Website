import { Navbar, Nav, Button } from 'react-bootstrap';
import Fade from 'react-bootstrap/Fade';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';
import { Professor as ProfessorType } from '../types.d';

function ProfessorMenu() {
    useDocumentTitle('Professor Dashboard');
    const [show, setShow] = useState(false);
    const [professorName, setProfessorName] = useState('');
    const { id } = useParams();
    const location = useLocation();
    const professorId = id || (location.state as { professorId: string })?.professorId;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const fetchProfessorName = async () => {
            try {
                const response = await api.get<ProfessorType>(`/professors/${professorId}`);
                const professor = response.data;
                setProfessorName(professor.name);
            } catch (error) {
                console.error('Error fetching professor details:', error);
            }
        };

        if (professorId) {
            fetchProfessorName();
        }
    }, [professorId]);

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
        <div className="container text-center mt-5">
          <h1 className="mb-4">Welcome, {professorName}</h1>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <Button href={`/professor/${professorId}/mycourses`} className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              My Courses
            </Button>
            <Button href={`/professor/${professorId}/enroll`} className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Enroll
            </Button>
          </div>
        </div>
      </Fade>
    </>
    );
}

export default ProfessorMenu;
