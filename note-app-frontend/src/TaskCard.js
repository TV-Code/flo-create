import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, Typography, Box, IconButton, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@emotion/react';

const TaskCard = ({ task, onEdit, onDelete, categoryColor, lightenedColor, expandedTask, setExpandedTask }) => {
  const maxLength = 100;  // Max number of characters to display before showing 'Read More'
  const [readMore, setReadMore] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setReadMore(task.description.length > maxLength);
  }, [task]);

  const handleExpandClick = () => {
    setExpandedTask(expandedTask === task.id ? null : task.id);
  };

  const isExpanded = expandedTask === task.id;
  const displayDescription = isExpanded ? task.description : `${task.description.substring(0, maxLength)}${readMore ? '...' : ''}`;

  const taskStatus = task.progress === 0 
    ? "Not Started" 
    : task.progress < 100 
    ? "In Progress" 
    : "Completed";

  return (
    <Card sx={{ minWidth: 275, maxWidth: 345, mb: 2, backgroundColor: theme.palette.custom.cardBackground }}> 
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <IconButton onClick={() => onEdit(task)} sx={{ ml: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(task.id)} sx={{ ml: 1 }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2">
          {displayDescription}
        </Typography>
        {readMore && (
          <Box display="flex" alignItems="center" onClick={handleExpandClick} sx={{ cursor: 'pointer', mt: 1 }}>
            <Typography variant="body2" color="primary">
              {isExpanded ? 'Read Less' : 'Read More'}
            </Typography>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        )}
        <Typography variant="body2">
          Priority: {task.weight}
        </Typography>
        <Typography variant="body2">
          Status: {taskStatus}
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Progress: {task.progress}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Number(task.progress)}
            sx={{
                height: 5,
                borderRadius: 5,
                bgcolor: lightenedColor,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: categoryColor,
                },
              }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
