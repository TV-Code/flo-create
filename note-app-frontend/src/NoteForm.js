import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NoteForm = ({ addNote, updateNote, currentNote, setCurrentNote }) => {
  const [title, setTitle] = useState(currentNote ? currentNote.title : '');
  const [body, setBody] = useState(currentNote ? currentNote.body : '');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setTitle(currentNote ? currentNote.title : '');
    setBody(currentNote ? currentNote.body : '');
  }, [currentNote]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const note = { title, body };

    if (currentNote && currentNote.id) {
      try {
        const response = await axios.put(`http://127.0.0.1:5000/notes/${currentNote.id}`, note);
        updateNote(response.data.data);
        setCurrentNote({ title: '', body: '', id: null });
      } catch (error) {
        console.error('There was an error!', error);
      }
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:5000/notes', note);
        addNote(response.data.data);
        setCurrentNote({ title: '', body: '', id: null });
      } catch (error) {
        console.error('There was an error!', error);
      }
    }

    setLoading(false);
    setOpen(true);
    setTitle('');
    setBody('');
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
      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        {currentNote && currentNote.id ? 'Update Note' : 'Add Note'}
      </Button>
      <Snackbar
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
