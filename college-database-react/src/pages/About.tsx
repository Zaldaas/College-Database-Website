import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import useDocumentTitle from '../hooks/useDocumentTitle';

function About() {
    useDocumentTitle('About');

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Nav className="ms-auto me-3">
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/links">Links</Nav.Link>
                </Nav>
            </Navbar>
            <div className="container mt-5">
                <h1 className="text-center mb-4">About CSUF College Database</h1>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <p className="lead">
                            The CSUF College Database is a comprehensive system designed to manage academic records, 
                            course enrollments, and administrative tasks for California State University, Fullerton.
                        </p>
                        <h2 className="mt-4">Features</h2>
                        <ul>
                            <li>Students can check their enrollments and grades</li>
                            <li>Professors can check their courses and students</li>
                            <li>Administrative oversight and management of students, professors and courses</li>
                        </ul>
                        <h2 className="mt-4">Contact</h2>
                        <p>
                            For any questions or support, please contact the system administrator at <a href="mailto:zaldaas@csu.fullerton.edu">zaldaas@csu.fullerton.edu</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About; 