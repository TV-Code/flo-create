import React, { useState } from 'react';
import { Box, Snackbar, CircularProgress } from '@mui/material';
import NoteCard from './NoteCard';
import MuiAlert from '@mui/material/Alert';

const NoteList = ({ deleteNote, setCurrentNote, notes, loading }) => {  
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDelete = async (id) => {  
    deleteNote(id);
    setOpen(true);
  }  

  const handleEdit = (note) => {  
    setCurrentNote(note);
  };  

  return (  
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        notes.map(note => (
          <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
        ))
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Note Deleted Successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );  
};  

export default NoteList;
