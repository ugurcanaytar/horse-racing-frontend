import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, LinearProgress, Button } from '@mui/material';
import { HorsePosition } from '../../types';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/userSlice';

const socket = io('http://18.159.51.223:3443', {
  withCredentials: true,
});

const RaceTrack: React.FC = () => {
  const [positions, setPositions] = useState<HorsePosition[]>([]);
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const username = useSelector((state: RootState) => state.user.username);
  const token = localStorage.getItem('token');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    dispatch(logout());
    navigate('/');
  };

  const fetchRaceData = async () => {
    if (!token) {
      console.error('No token available. Redirecting to login.');
      navigate('/');
      return;
    }
    try {
      const response = await fetch('http://18.159.51.223:3443/races/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch race data.');
      }
      const raceData = await response.json();
      if (raceData.rounds && raceData.rounds.length > 0) {
        setPositions(
          raceData.rounds[0].horses.map((horse: any) => ({
            id: horse.id,
            name: horse.name,
            color: horse.color,
            position: 0,
          }))
        );
        setCurrentRound(raceData.rounds[0].id);
        setDistance(raceData.rounds[0].distance);
      } else {
        resetRaceTrack();
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching race data:', error);
      resetRaceTrack();
      setIsLoading(false);
    }
  };

  const resetRaceTrack = () => {
    setPositions([]);
    setCurrentRound(null);
    setDistance(null);
    console.log('Race track reset for new program');
  };

  useEffect(() => {
    if (token) {
      // Fetch initial race data
      fetchRaceData();

      // Subscribe to race updates
      socket.on('raceUpdate', (data) => {
        setPositions(data.positions);
        setCurrentRound(data.round);
        setDistance(data.distance);
      });

      // Listen for the 'programGenerated' event to reset and refetch the race data
      socket.on('programGenerated', fetchRaceData);
    } else {
      // Redirect to login if no token
      navigate('/');
    }

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('raceUpdate');
      socket.off('programGenerated', fetchRaceData);
    };
  }, [token, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Loading race data...</Typography>
      </Box>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">No race in progress</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">Race Track</Typography>
        {username && (
          <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
            Welcome, {username}
          </Typography>
        )}
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Round {currentRound} - {distance}m
      </Typography>
      <Grid container spacing={2}>
        {positions.map((horse) => (
          <Grid item xs={12} key={horse.id}>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {horse.name}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={horse.position}
              sx={{
                height: 10,
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: horse.color,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RaceTrack;
