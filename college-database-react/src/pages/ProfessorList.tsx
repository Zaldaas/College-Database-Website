import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Professor } from '../types.d';

const ProfessorList = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    api.get<Professor[]>('/professors')
      .then(response => {
        setProfessors(response.data);
      })
      .catch(error => {
        console.error('Error fetching professors:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Professors</h2>
      <Link to="/professors/new">Add New Professor</Link>

      {professors.length === 0 ? (
        <p>No professors found.</p>
      ) : (
        <ul>
          {professors.map((prof) => (
            <li key={prof.id}>
              <Link to={`/professors/${prof.id}`}>
                {prof.name} (SSN: {prof.social_security_number})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfessorList;
