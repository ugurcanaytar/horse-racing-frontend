import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import HorseList from '../components/HorseList/HorseList';
import RaceTrack from '../components/RaceTrack/RaceTrack';
import ProgramResults from '../components/ProgramResults/ProgramResults';
import Controls from '../components/Controls/Controls';
import { io } from 'socket.io-client';

// Initialize WebSocket connection
const socket = io('http://localhost:3443', {
  withCredentials: true,
});

const HomePage: React.FC = () => {
  // State to hold the race data
  const [, setRaceData] = useState<any>(null);

  // Function to fetch updated race data
  const fetchData = async () => {
    console.log("Fetching updated race data...");
    try {
      // Fetch updated race data from the backend
      const response = await fetch('http://localhost:3443/races/current');
      const updatedRaceData = await response.json();
      setRaceData(updatedRaceData); // Update the state
    } catch (error) {
      console.error("Error fetching updated race data:", error);
    }
  };

  useEffect(() => {
    // Add a listener to the 'programGenerated' WebSocket event
    socket.on('programGenerated', () => {
      // Refetch data when the program is generated
      fetchData();
    });

    return () => {
      // Cleanup socket listener on unmount
      socket.off('programGenerated');
    };
  }, []);

  return (
    <Grid container>
      {/* Left Panel */}
      <Grid item xs={12} md={2}>
        <HorseList /> {/* Pass raceData as prop */}
      </Grid>

      {/* Center Panel */}
      <Grid item xs={12} md={8}>
        <RaceTrack /> {/* Pass raceData as prop */}
      </Grid>

      {/* Right Panel */}
      <Grid item xs={12} md={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <Box sx={{ marginBottom: 2 }}>
            <Controls />
          </Box>
          <ProgramResults /> {/* Pass raceData as prop */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
