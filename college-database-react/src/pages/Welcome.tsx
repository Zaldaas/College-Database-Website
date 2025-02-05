import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Welcome() {
    return (
    <>
      <Navbar className="bg-body-tertiary">
        <Nav className="ms-auto me-3">
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/links">Links</Nav.Link>
        </Nav>
      </Navbar>
      <div className="container text-center mt-3">
        <h1 className="mb-4">Welcome to the CSUF College Database!</h1>

        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <img src="/src/assets/CSUF.jpg" alt="CSUF" className="img-fluid mb-4" width="750"/>
          <h3>Please login:</h3>
          <div className="mt-3">
            <Button href="/student" className="btn btn-primary me-2">
              Student
            </Button>
            <Button href="/professor" className="btn btn-primary me-2">
              Professor
            </Button>
            <Button href="/admin" className="btn btn-primary me-2">
              Administrator
            </Button>
          </div>
        </div>
      </div>
    </>
    );
}

export default Welcome;
