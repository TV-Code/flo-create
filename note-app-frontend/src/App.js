import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Box, Typography, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Sidebar from './Sidebar';
import Tasks from './Tasks';
import Journal from './Journal';
import Chat from './Chat';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f9CB08',
    },
    secondary: {
      main: '#e3dac9',
    },
  },
});

const App = () => {
  const [notes, setNotes] = useState([]);  
  const [currentNote, setCurrentNote] = useState({ title: '', body: '', id: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
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

  const fetchNote = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/notes/${id}`);
      setCurrentNote(response.data);
    } catch (error) {
      console.error(`There was an error retrieving the note: ${error}`);
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
        <Container maxWidth="md">
          <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
            Note Taking App
          </Typography>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <Routes>
             <Route path="/notes" element={<NoteList notes={notes} loading={loading} deleteNote={deleteNote} setCurrentNote={setCurrentNote} />} />
             <Route path="/notes/new" element={<NoteForm addNote={addNote} currentNote={currentNote} setCurrentNote={setCurrentNote} />} />
             <Route path="/notes/:id" element={<NoteForm updateNote={updateNote} currentNote={currentNote} setCurrentNote={setCurrentNote} fetchNote={fetchNote} />} />
             <Route path="/tasks" element={<Tasks />} />
             <Route path="/journal" element={<Journal />} />
             <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;