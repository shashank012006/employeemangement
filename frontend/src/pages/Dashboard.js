import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/docs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs(res.data);
    };
    fetchDocs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>My Documents</h2>
      <button onClick={() => navigate('/upload')}>Upload Document</button>
      <button onClick={handleLogout} style={{ background: 'gray', marginTop: '1rem' }}>Logout</button>
      <ul>
        {docs.map((doc) => (
          <li key={doc._id}>
            <a href={`http://localhost:5000/uploads/${doc.filename}`} target="_blank" rel="noreferrer">
              {doc.originalname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
