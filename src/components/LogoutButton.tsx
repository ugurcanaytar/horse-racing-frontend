// src/components/LogoutButton.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { Button } from '@mui/material';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
