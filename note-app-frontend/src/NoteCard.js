import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <Card key={note.id} sx={{ minWidth: 275 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" component="div">
            {note.title}
          </Typography>
          <Box>
            <IconButton onClick={() => onEdit(note)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(note.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2">
          {note.body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
