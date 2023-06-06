// NoteList.js
import React, { useEffect, useState } from 'react';  
import axios from 'axios';  
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Snackbar } from '@mui/material';  
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

const NoteList = ({ deleteNote, setCurrentNote }) => {  
  const [notes, setNotes] = useState([]);  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      deleteNote(id);  
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {  
      console.error(`There was an error deleting the note: ${error}`);  
    }  
  }  

  const handleEdit = (note) => {  
    setCurrentNote(note);  
  };  

  return (  
    <>
      <List>
        {notes.map(note => (  
          <ListItem key={note.id}>
            <ListItemText
              primary={<Typography variant="h5">{note.title}</Typography>}
              secondary={note.body}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(note)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(note.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}  
      </List>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Note Deleted Successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );  
};  

export default NoteList;
