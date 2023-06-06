import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
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

    const addNote = async (note) => {
        setLoading(true);  
        try {
            const response = await axios.post('http://127.0.0.1:5000/notes', note);
            setNotes([...notes, response.data.data]);
        } catch (error) {
            console.error('There was an error!', error);
        }
        setLoading(false);
    };  

    const updateNote = async (updatedNote) => {
        setLoading(true);
        try {
            const response = await axios.put(`http://127.0.0.1:5000/notes/${updatedNote.id}`, updatedNote);
            setNotes(notes.map(note => (note.id === response.data.data.id ? response.data.data : note)));
        } catch (error) {
            console.error('There was an error!', error);
        }
        setLoading(false);
    };  

    const deleteNote = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://127.0.0.1:5000/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error(`There was an error deleting the note: ${error}`);
        }
        setLoading(false);
    };

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Sidebar />
                <Container>
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            My Note App
                        </Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <MainContent
                                addNote={addNote}
                                updateNote={updateNote}
                                currentNote={currentNote}
                                setCurrentNote={setCurrentNote}
                                notes={notes}
                                deleteNote={deleteNote}
                            />
                        )}
                    </Box>
                </Container>
            </ThemeProvider>
        </Router>
    );
};

export default App;
