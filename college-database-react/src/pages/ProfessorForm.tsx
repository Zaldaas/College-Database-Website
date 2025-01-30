import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfessorForm = () => {
  const navigate = useNavigate();
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [number, setNumber] = useState('');
  const [sex, setSex] = useState('');
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [collegeDegrees, setCollegeDegrees] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/professors', {
        social_security_number: socialSecurityNumber,
        name,
        street_address: streetAddress,
        city,
        state,
        zip_code: zipCode,
        area_code: areaCode,
        number,
        sex,
        title,
        salary,
        college_degrees: collegeDegrees,
      });
      alert('Professor created successfully!');
      navigate('/professors');
    } catch (error) {
      console.error('Error creating professor:', error);
      alert('Failed to create professor. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Professor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>SSN:</label>
          <input
            type="text"
            value={socialSecurityNumber}
            onChange={(e) => setSocialSecurityNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Street Address:</label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div>
          <label>Zip Code:</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>
        <div>
          <label>Area Code:</label>
          <input
            type="text"
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
          />
        </div>
        <div>
          <label>Number:</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Sex:</label>
          <input
            type="text"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Salary:</label>
          <input
            type="number"
            step="0.01"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div>
          <label>College Degrees:</label>
          <input
            type="text"
            value={collegeDegrees}
            onChange={(e) => setCollegeDegrees(e.target.value)}
          />
        </div>

        <button type="submit">Create Professor</button>
      </form>
    </div>
  );
};

export default ProfessorForm;
