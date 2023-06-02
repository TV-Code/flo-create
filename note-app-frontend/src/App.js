import React, { useState, useEffect } from 'react';  
import axios from 'axios';  
import { CssBaseline, Container } from '@mui/material';  
import NoteForm from './NoteForm';  
import NoteList from './NoteList';  

const App = () => {  
    const [notes, setNotes] = useState([]);  
    const [currentNote, setCurrentNote] = useState({ title: '', body: '', id: null });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const response = await axios.get('http://localhost:5000/notes');
        setNotes(response.data);
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
        <>  
            <CssBaseline />  
            <Container>  
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
                />  
            </Container>  
        </>  
    );  
};  

export default App;
