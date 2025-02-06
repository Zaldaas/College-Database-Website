import { Navbar, Nav, Button } from 'react-bootstrap';
import Fade from 'react-bootstrap/Fade';
import { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

function AdminMain() {
    useDocumentTitle('Admin Dashboard');
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

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
          <h1 className="mb-4">Administrator Dashboard</h1>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <Button href="/admin/studentlist" className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Students
            </Button>
            <Button href="/admin/proflist" className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Professors
            </Button>
            <Button href="/admin/courselist" className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Courses
            </Button>
            <Button href="/admin/departmentlist" className="btn btn-primary mb-3" style={{ fontSize: '24px', width: '300px' }}>
              Departments
            </Button>
          </div>
        </div>
      </Fade>
    </>
    );
}

export default AdminMain;
