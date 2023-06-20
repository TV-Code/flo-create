import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NoteForm = ({ addNote, updateNote, currentNote, setCurrentNote, action }) => {
  const [title, setTitle] = useState(currentNote ? currentNote.title : '');
  const [body, setBody] = useState(currentNote ? currentNote.body : '');
  const [category_id, setCategory_id] = useState(currentNote ? currentNote.category_id : '');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setBody(currentNote.body);
      setCategory_id(currentNote.category_id);
    } else {
      setTitle('');
      setBody('');
      setCategory_id('');
    }
  }, [currentNote]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const note = { title, body, category_id };
    
    if (action === 'edit') {
        try {
          const response = await axios.put(`http://127.0.0.1:5000/notes/${id}`, note);
          updateNote(response.data.data);
          setCurrentNote(null);
        } catch (error) {
          console.error('There was an error!', error);
        }
      } else if (action === 'new') {
        try {
          const response = await axios.post('http://127.0.0.1:5000/notes', note);
          addNote(response.data.data);
          setCurrentNote(null);
        } catch (error) {
          console.error('There was an error!', error);
        }
      }
  
      setLoading(false);
      setOpen(true);
      navigate('/notes');
    };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        variant="outlined"
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        label="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        variant="outlined"
        multiline
        rows={4}
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        label="Category"
        value={category_id}
        onChange={e => setCategory_id(e.target.value)}
        variant="outlined"
        sx={{ mb: 1}}
      />
      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Save'}
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note saved successfully"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Box>
  );
};

export default NoteForm;
