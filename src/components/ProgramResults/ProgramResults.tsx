import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setProgram, addResult } from '../../store/slices/raceSlice';
import { RaceProgram, RaceResult } from '../../types';
import { io } from 'socket.io-client';
import { getAuthHeaders } from '../../utils/api';

const socket = io('http://18.159.51.223:3443', { withCredentials: true });

const ProgramResults: React.FC = () => {
  const dispatch = useDispatch();
  const program: RaceProgram | null = useSelector(
    (state: RootState) => state.race.program
  );
  const results = useSelector((state: RootState) => state.race.results);

  // Function to fetch the latest race program
  const fetchProgramData = async () => {
    try {
      const response = await fetch('http://18.159.51.223:3443/races/current', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      console.log('Fetched program data:', data);
      dispatch(setProgram(data || null)); // Ensure that data is either an object or null
    } catch (error) {
      console.error('Error fetching race program:', error);
    }
  };

  useEffect(() => {
    // Fetch the initial race program data
    fetchProgramData();

    // Listen for 'programGenerated' event to refetch data
    socket.on('programGenerated', fetchProgramData);

    // Handle race results updates from the WebSocket
    const handleRaceResults = (data: RaceResult) => {
      // Prevent adding duplicate results by checking roundId and comparing lengths
      if (!results.some((result) => result.roundId === data.roundId)) {
        dispatch(addResult(data));
      }
    };
    socket.on('raceResults', handleRaceResults);

    // Cleanup event listeners on component unmount
    return () => {
      socket.off('programGenerated', fetchProgramData);
      socket.off('raceResults', handleRaceResults);
    };
  }, [dispatch, results]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Program
      </Typography>
      {program ? (
        program.rounds.map((round) => (
          <Accordion key={round.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                Round {round.id} - {round.distance}m
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {round.horses.map((horse) => (
                  <ListItem key={horse.id}>
                    <ListItemText
                      primary={horse.name}
                      secondary={`Condition: ${horse.condition}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>Loading program...</Typography>
      )}

      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Results
      </Typography>
      {results.length > 0 ? (
        // Filter to remove any duplicate results based on roundId
        Array.from(new Set(results.map((result) => result.roundId)))
          .map((uniqueRoundId) => {
            const resultData = results.find(
              (result) => result.roundId === uniqueRoundId
            );
            return (
              <Accordion key={uniqueRoundId}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Round {uniqueRoundId} Results</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {resultData &&
                      [...resultData.results]
                        .sort((a, b) => a.position - b.position)
                        .map((res) => (
                          <ListItem key={res.horseId}>
                            <ListItemText
                              primary={`Position ${res.position}: Horse ${res.horseId}`}
                              secondary={`Time: ${res.time.toFixed(2)}s`}
                            />
                          </ListItem>
                        ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })
      ) : (
        <Typography>No results yet.</Typography>
      )}
    </Box>
  );
};

export default ProgramResults;
