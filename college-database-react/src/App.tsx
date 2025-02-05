import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import AdminProfList from './pages/AdminProfList';
import AdminProfDetail from './pages/AdminProfDetail';
import AdminProfForm from './pages/AdminProfForm';
import About from './pages/About';
import Links from './pages/Links';
import Admin from './pages/Admin';
import AdminMenu from './pages/AdminMenu';

function App() {
  useEffect(() => {
    document.body.setAttribute('data-bs-theme', 'dark');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Our Welcome Page as the default route */}
        <Route path="/" element={<Welcome />} />
        
        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Links Page */}
        <Route path="/links" element={<Links />} />

        {/*Student "pages" */}
        <Route path="/student" element={<h2>Student Page (TODO)</h2>} />

        {/*Professor "pages" */}
        <Route path="/professor" element={<h2>Professor Page (TODO)</h2>} />

        {/*Administrator "pages" */}
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/menu" element={<AdminMenu/>} />
        <Route path="/admin/studentlist" element={<h2>Student Page (TODO)</h2>} />
        <Route path="/admin/proflist" element={<AdminProfList/>} />
        <Route path="/admin/courselist" element={<h2>Course Page (TODO)</h2>} />
        <Route path="/admin/:id" element={<AdminProfDetail />} />
        <Route path="/admin/newprof" element={<AdminProfForm/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
