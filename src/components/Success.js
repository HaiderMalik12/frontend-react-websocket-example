import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Success = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  return (
    <div>
      <h1>Payment Successful 🎉</h1>
      <p>Your subscription for team <strong>{teamId}</strong> is now active.</p>
    </div>
  );
};

export default Success;
