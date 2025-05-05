import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/docs/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Upload successful');
      navigate('/');
    } catch {
      alert('Upload failed');
    }
  };

  return (
    <div className="container">
      <h2>Upload Document</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;
