import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RaceProgram, RaceResult } from '../../types';

interface RaceState {
  program: RaceProgram | null;
  results: RaceResult[];
  status: string; // Add a status field to the state
}

const initialState: RaceState = {
  program: null,
  results: [],
  status: 'idle',
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setProgram(state, action: PayloadAction<RaceProgram>) {
      state.program = action.payload;
    },
    addResult(state, action: PayloadAction<RaceResult>) {
      state.results.push(action.payload);
    },
    clearRaceData(state) {
      state.program = null;
      state.results = [];
      state.status = 'idle';
    },
    setRaceStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
  },
});

export const { setProgram, addResult, clearRaceData, setRaceStatus } = raceSlice.actions;
export default raceSlice.reducer;
