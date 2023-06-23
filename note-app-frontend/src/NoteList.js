import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom'; 
import { Box, Snackbar } from '@mui/material';
import NoteCard from './NoteCard';
import MuiAlert from '@mui/material/Alert';

const NoteList = ({ deleteNote, setCurrentNote }) => {  
  const [notes, setNotes] = useState([]);  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {  
    setLoading(true);
    axios.get('http://127.0.0.1:5000/notes')  
    .then(response => {  
      setNotes(response.data);  
      setLoading(false);
    })  
    .catch(error => {
      console.error(`There was an error retrieving the note list: ${error}`);
      setLoading(false);
    });
  }, []);  

  const handleDelete = async (id) => {  
    try {  
      await axios.delete(`http://127.0.0.1:5000/notes/${id}`);  
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {  
      console.error(`There was an error deleting the note: ${error}`);  
    }  
  }  

  const handleEdit = (note) => {  
    navigate(`/notes/${note.id}`);  
  };  

  return (  
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Note Deleted Successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );  
};  

export default NoteList;
