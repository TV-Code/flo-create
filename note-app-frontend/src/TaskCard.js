import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <Card key={task.id} sx={{ minWidth: 275 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" component="div">
            {task.title}
          </Typography>
          <Box>
            <IconButton onClick={() => onEdit(task)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(task.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2">
          {task.description}
        </Typography>
        <Typography variant="body2">
          Weight: {task.weight}
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status: {task.status}%
          </Typography>
          <LinearProgress variant="determinate" value={Number(task.status)} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
