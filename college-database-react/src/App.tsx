import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfessorList from './pages/ProfessorList';
import ProfessorForm from './pages/ProfessorForm';
import ProfessorDetail from './pages/ProfessorDetail';
// Import your other resource pages similarly...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home or default route */}
        <Route path="/" element={<h1>Welcome to the University Database</h1>} />

        {/* Professors */}
        <Route path="/professors" element={<ProfessorList />} />
        <Route path="/professors/new" element={<ProfessorForm />} />
        <Route path="/professors/:id" element={<ProfessorDetail />} />

        {/* (You can add other routes here for Departments, Courses, etc.) */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
