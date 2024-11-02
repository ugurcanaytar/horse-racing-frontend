// src/components/Controls/Controls.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { clearRaceData } from '../../store/slices/raceSlice';

const socket = io('http://18.159.51.223:3443', {
  withCredentials: true,
});

const Controls: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check the user's role from the token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.role === 'admin');
    }
  }, []);

  const generateProgram = async () => {
    try {
      dispatch(clearRaceData());
      await fetch('http://18.159.51.223:3443/races/generate', { method: 'POST' });
      socket.emit('programGenerated');
      setIsRunning(false); // Reset running state
    } catch (error) {
      console.error('Error generating program:', error);
    }
  };

  const toggleRace = () => {
    fetch('http://18.159.51.223:3443/races/toggle', {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          setIsRunning((prev) => !prev);
        } else {
          console.error('Error toggling race');
        }
      })
      .catch((error) => console.error('Error toggling race:', error));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
      <Button variant="contained" onClick={generateProgram} disabled={!isAdmin}>
        Generate Program
      </Button>
      <Button variant="contained" onClick={toggleRace} disabled={!isAdmin}>
        {isRunning ? 'Pause Race' : 'Start Race'}
      </Button>
    </Box>
  );
};

export default Controls;
