export interface Horse {
    id: number;
    name: string;
    condition: number;
    color: string;
  }
  
  export interface HorsePosition {
    id: number;
    name: string;
    color: string;
    position: number; // Position on the track, e.g., percentage completed
  }
  
  export interface RaceProgram {
    rounds: RaceRound[];
  }
  
  export interface RaceRound {
    id: number;
    distance: number;
    horses: Horse[];
  }
  
  export interface RaceResult {
    roundId: number;
    results: Result[];
  }
  
  export interface Result {
    horseId: number;
    position: number; // Finish position in the race
    time: number;     // Time taken to finish
  }
  
  // For Redux state
  export interface RootState {
    user: UserState;
    race: RaceState;
  }
  
  export interface UserState {
    username: string;
    role: 'user' | 'admin';
  }
  
  export interface RaceState {
    program: RaceProgram | null;
    results: RaceResult[];
  }
  