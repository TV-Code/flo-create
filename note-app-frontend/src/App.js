import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Typography, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
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
      main: '#fbeec1',
    },
  },
});

const App = () => {
  const [noteId, setNoteId] = useState(null);
  const [notes, setNotes] = useState([]);  
  const [tasks, setTasks] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/notes');
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the note list: ${error}`);
      setLoading(false);
    }
  };


  const fetchNote = async (id) => {
    setLoading(true);
    setNoteId(id);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/notes/${id}`);
      setCurrentNote(response.data);
    } catch (error) {
      console.error(`There was an error retrieving the note: ${error}`);
      setCurrentNote(null);
    } finally {
        setLoading(false);
    }
  };

  const addNote = async (note) => {
    setLoading(true);  
    try {
      const response = await axios.post('http://127.0.0.1:5000/notes', note);
      setNotes([...notes, response.data.data]);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
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

  const EditNoteRoute = () => {
    const { id } = useParams();
  
    useEffect(() => {
      if (id !== noteId) {
        fetchNote(id);
      }
    }, [id]);
  
    return loading ? (
      <CircularProgress />
    ) : (
      <NoteForm
        updateNote={updateNote}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        action='edit'
      />
    );
  };
  
  const NewNoteRoute = () => {
    return (
      <NoteForm
        addNote={addNote}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        action='new'
      />
    );
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the tasks: ${error}`);
      setLoading(false);
    }
  };
  

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
            Note Taking App
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Sidebar />
            <Routes>
             <Route path="/notes" element={<NoteList notes={notes} loading={loading} deleteNote={deleteNote} setCurrentNote={setCurrentNote} />} />
             <Route path="/notes/new" element={<NewNoteRoute />} />
             <Route path="/notes/:id" element={<EditNoteRoute />} />
             <Route path="/tasks" element={<Tasks tasks={tasks} />} />
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
