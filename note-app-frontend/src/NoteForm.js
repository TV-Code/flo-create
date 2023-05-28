import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const NoteForm = ({ addNote, updateNote, currentNote, setCurrentNote }) => {
    const [title, setTitle] = useState(currentNote.title);
    const [body, setBody] = useState(currentNote.body);

    useEffect(() => {
        setTitle(currentNote.title);
        setBody(currentNote.body);
    }, [currentNote]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const note = { title, body };

        if (currentNote.id) {
            try {
                const response = await axios.put(`http://localhost:5000/notes/${currentNote.id}`, note);
                // Update the note in the App component
                updateNote(response.data.data);
                setCurrentNote({ title: '', body: '', id: null });
            } catch (error) {
                console.error('There was an error!', error);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:5000/notes', note);
                // Add the new note to the App component
                addNote(response.data.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }

        setTitle('');
        setBody('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <TextField
                label="Body"
                value={body}
                onChange={e => setBody(e.target.value)}
            />
            <Button type="submit">{currentNote.id ? 'Update Note' : 'Add Note'}</Button>
        </Box>
    );
};

export default NoteForm;
