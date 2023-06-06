import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Customize your main color
    },
    secondary: {
      main: '#f50057', // Customize your secondary main color
    },
  },
});

const App = () => {
    const [notes, setNotes] = useState([]);  
    const [currentNote, setCurrentNote] = useState({ title: '', body: '', id: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
        setLoading();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5000/notes');
            setNotes(response.data);
        } catch (error) {
            console.error(`There was an error retrieving the note list: ${error}`);
        }
        setLoading(false);
    };

    const addNote = (note) => {  
        setNotes([...notes, note]);  
    };  

    const updateNote = (updatedNote) => {  
        setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));  
    };  

    const deleteNote = (id) => {  
        setNotes(notes.filter(note => note.id !== id));
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Note App
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <NoteForm
                addNote={addNote}
                updateNote={updateNote}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
              />
              <NoteList
                notes={notes}
                deleteNote={deleteNote}
                setCurrentNote={setCurrentNote}
                setLoading={setLoading}
              />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
