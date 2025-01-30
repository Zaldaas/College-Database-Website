import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Professor } from '../types.d';

const ProfessorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the professor details
    api.get(`/professors/${id}`)
      .then(response => {
        setProfessor(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching professor:', error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this professor?')) return;
    try {
      await api.delete(`/professors/${id}`);
      alert('Professor deleted successfully!');
      navigate('/professors');
    } catch (error) {
      console.error('Error deleting professor:', error);
      alert('Failed to delete professor.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!professor) {
    return <div>Professor not found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Professor Detail</h2>
      <p><strong>ID:</strong> {professor.id}</p>
      <p><strong>Name:</strong> {professor.name}</p>
      <p><strong>SSN:</strong> {professor.social_security_number}</p>
      <p><strong>Title:</strong> {professor.title}</p>
      <p><strong>Salary:</strong> {professor.salary}</p>
      <p><strong>College Degrees:</strong> {professor.college_degrees}</p>

      <button onClick={handleDelete}>Delete Professor</button>
    </div>
  );
};

export default ProfessorDetail;
