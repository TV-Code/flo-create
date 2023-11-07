import React from 'react';
import { Button } from '@mui/material';

function ThemeToggleButton({ toggleTheme, themeMode }) {
  return (
    <Button onClick={toggleTheme}>
      {themeMode === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
}

export default ThemeToggleButton;
