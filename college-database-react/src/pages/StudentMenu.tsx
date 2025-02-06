import { Navbar, Nav, Button } from 'react-bootstrap';
import Fade from 'react-bootstrap/Fade';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';
import { Student as StudentType } from '../types.d';


function StudentMenu() {
    useDocumentTitle('Student Dashboard');
    const [show, setShow] = useState(false);
    const [studentFirstName, setStudentFirstName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const { id } = useParams();
    const location = useLocation();


    const studentId = id || (location.state as { studentId: string })?.studentId;


    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const fetchStudentName = async () => {
            try {
                const response = await api.get<StudentType>(`/students/${studentId}`);
                const student = response.data;
                setStudentFirstName(student.first_name);
                setStudentLastName(student.last_name);


            } catch (error) {
                console.error('Error fetching professor details:', error);
            }
        };

        if (studentId) {
            fetchStudentName();
        }

    }, [studentId]);


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
          <h1 className="mb-4">Welcome, {studentFirstName} {studentLastName}</h1>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>

            <Button href={`/student/${studentId}/mycourses`} className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              My Courses
            </Button>
            <Button href={`/student/${studentId}/enroll`} className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Enroll
            </Button>
          </div>
        </div>
      </Fade>
    </>
    );
}

export default StudentMenu;
