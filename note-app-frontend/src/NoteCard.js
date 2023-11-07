import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@emotion/react';

const NoteCard = ({ note, onEdit, onDelete, expandedNote, setExpandedNote }) => {
  const maxLength = 150;  // Max number of characters to display before showing 'Read More'
  const [readMore, setReadMore] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setReadMore(note.body.length > maxLength);
  }, [note]);

  const handleExpandClick = () => {
    setExpandedNote(expandedNote === note.id ? null : note.id);
  };

  const isExpanded = expandedNote === note.id;
  const displayDescription = isExpanded ? note.body : `${note.body.substring(0, maxLength)}${readMore ? '...' : ''}`;

  return (
    <Card sx={{ minWidth: 275, maxWidth: 345, mb: 2, backgroundColor: theme.palette.custom.cardBackground }}> 
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div">
            {note.title}
          </Typography>
          <Box display="flex" flexDirection="row">
            <IconButton onClick={() => onEdit(note)} sx={{ ml: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(note.id)} sx={{ ml: 1 }}>
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
      </CardContent>
    </Card>
  );
};

export default NoteCard;
