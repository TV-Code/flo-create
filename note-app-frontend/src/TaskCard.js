import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Collapse, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TaskCard = ({ task, onEdit, onDelete, categoryColor, lightenedColor, expandedTask, setExpandedTask }) => {
  const maxLength = 100;  // Max number of characters to display before showing 'Read More'
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    setReadMore(task.description.length > maxLength);
  }, [task]);

  const handleExpandClick = () => {
    setExpandedTask(expandedTask === task.id ? null : task.id);
  };

  const isExpanded = expandedTask === task.id;
  const displayDescription = isExpanded ? task.description : `${task.description.substring(0, maxLength)}${readMore ? '...' : ''}`;

  return (
    <Card sx={{ minWidth: 275, maxWidth: 500, mb: 2, backgroundColor: '#eaddcf' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Box>
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
          Weight: {task.weight}
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status: {task.status}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Number(task.status)}
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
