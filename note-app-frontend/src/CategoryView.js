import React from 'react';
import NoteList from './NoteList';
import TaskList from './TaskList';
import { Box, Typography } from '@mui/material';  

const CategoryView = ({ category }) => {  
  return (  
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexDirection: 'column' }}>
      <Typography variant="h5" component="div">
        {category.name}
      </Typography>
      
      <Typography variant="h6" component="div">
        Notes
      </Typography>
      <NoteList category={category} />

      <Typography variant="h6" component="div">
        Tasks
      </Typography>
      <TaskList category={category} />
    </Box>
  );  
};  

export default CategoryView;
