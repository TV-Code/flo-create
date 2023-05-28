import React, { useState } from 'react';  
import { CssBaseline, Container } from '@mui/material';  
import NoteForm from './NoteForm';  
import NoteList from './NoteList';  

const App = () => {  
    const [notes, setNotes] = useState([]);  

    const addNote = (note) => {  
        setNotes([...notes, note]);  
    };

    const updateNote = (updatedNote) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (  
        <>  
            <CssBaseline />  
            <Container>  
                <NoteForm addNote={addNote} updateNote={updateNote} />  
                <NoteList notes={notes} deleteNote={deleteNote} />  
            </Container>  
        </>  
    );  
};  

export default App;
