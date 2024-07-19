import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Session = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios.get('/Session')
      .then(response => {
        setUserId(response.data.userId);
      })
      .catch(error => {
        console.error('Error fetching user ID:', error);
      });
  }, []);

  return (
    <div>
      {userId ? (
        <p>User ID: {userId}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Session;
