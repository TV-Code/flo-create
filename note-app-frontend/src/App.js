import React, { useState } from 'react';
import { CssBaseline, Container } from '@mui/material';
import NoteForm from './NoteForm';
import NoteList from './NoteList';

const App = () => {
    const [notes, setNotes] = useState([]);

    const addNote = (note) => {
        setNotes([...notes, note]);
    };

    return (
        <>
            <CssBaseline />
            <Container>
                <NoteForm addNote={addNote} />
                <NoteList notes={notes} />
            </Container>
        </>
    );
};

export default App;
