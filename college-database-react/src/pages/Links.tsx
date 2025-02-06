import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Fade from 'react-bootstrap/Fade';
import { useState, useEffect } from 'react';

function Links() {
    useDocumentTitle('Useful Links');

    const [show, setShow] = useState(false);

    useEffect(() => {
      // Trigger the fade-in animation after a short delay
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);
  
      return () => clearTimeout(timeout); // Clear timeout on unmount
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
              <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <a href="https://zaldaas.com" target="_blank" className="d-flex flex-column align-items-center" style={{fontSize: '48px', textDecoration: 'none'}}>
                                <img src="/src/assets/headshot.jpeg" alt="headshot" className="img-fluid mb-4 rounded-circle" width="100"/>
                                <span>Personal Website</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <a href="https://github.com/Zaldaas/College-Database" target="_blank" className="d-flex flex-column align-items-center" style={{fontSize: '48px', textDecoration: 'none'}}>
                                <i className="fa fa-github mb-2" style={{fontSize: '100px', color: 'white'}}></i>
                                <span>GitHub Repository</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <a href="https://www.linkedin.com/in/zeid-aldaas1111/" target="_blank" className="d-flex flex-column align-items-center" style={{fontSize: '48px', textDecoration: 'none'}}>
                                <i className="fa fa-linkedin-square mb-2" style={{fontSize: '100px', color: 'white'}}></i>
                                <span>LinkedIn Profile</span>
                            </a>
                        </div>
                    </div>
                </div>
              </div>
            </Fade>
        </>

    )
}


export default Links;
