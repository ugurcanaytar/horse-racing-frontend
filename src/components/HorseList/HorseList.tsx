// src/components/HorseList/HorseList.tsx
import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  ListItemAvatar,
  Box,
} from '@mui/material';
import './HorseList.css';
import { Horse } from '../../types';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://18.159.51.223:3443', {
  withCredentials: true,
});

const HorseList: React.FC = () => {
  const [horses, setHorses] = useState<Horse[]>([]);

  // Function to fetch horses from the backend
  const fetchHorses = async () => {
    try {
      const response = await fetch('http://18.159.51.223:3443/horses');
      const data = await response.json();
      console.log('Fetched horses:', data);
      setHorses(data);
    } catch (error) {
      console.error('Error fetching horses:', error);
    }
  };

  useEffect(() => {
    // Fetch horses when the component mounts
    fetchHorses();

    // Event handler for horse updates
    const handleHorseUpdate = (updatedHorse: Horse) => {
      setHorses((prevHorses) =>
        prevHorses.map((horse) =>
          horse.id === updatedHorse.id ? updatedHorse : horse
        )
      );
    };

    // Listen for 'programGenerated' event to refetch horses
    socket.on('programGenerated', fetchHorses);

    // Cleanup socket listener on unmount
    return () => {
      socket.off('programGenerated', fetchHorses);
      socket.off('horseUpdate', handleHorseUpdate);
    };
  }, []);

  return (
    <Box
      sx={{
        maxHeight: 750, // Set the maximum height of the container
        overflowY: 'auto', // Enable vertical scrolling
        padding: 2,
        border: '1px solid #ddd', // Optional: Add a border for styling
        borderRadius: 4, // Optional: Add border-radius for rounded corners
      }}
    >
      <Typography variant="h6" sx={{ padding: 2 }}>
        Horse List
      </Typography>
      <Divider />
      {Array.isArray(horses) && horses.length > 0 ? (
        horses.map((horse) => (
          <ListItem key={horse.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: horse.color }}>
                {horse.id}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={horse.name}
              secondary={`Condition: ${horse.condition}`}
            />
          </ListItem>
        ))
      ) : (
        <Typography sx={{ padding: 2 }}>No horses available.</Typography>
      )}
    </Box>
  );
};

export default HorseList;
