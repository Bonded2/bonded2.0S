import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/reusable/Button';

const DetectedImage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard/upload');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Nudity Detected</p>
      <br />

      <Button onClick={handleGoBack}>Go Back</Button>
    </div>
  );
};

export default DetectedImage;