import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import AdminList from './pages/AdminList';
import ProfessorDetail from './pages/ProfessorDetail';
import ProfessorForm from './pages/ProfessorForm';
import About from './pages/About';
import Links from './pages/Links';
import Admin from './pages/Admin';

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
        <Route path="/admin/list" element={<AdminList/>} />
        <Route path="/admin/:id" element={<ProfessorDetail />} />
        <Route path="/admin/new" element={<ProfessorForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
