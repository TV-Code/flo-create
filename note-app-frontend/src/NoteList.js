import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box } from '@mui/material';

const NoteList = ({ deleteNote, setCurrentNote }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/notes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => console.error(`There was an error retrieving the note list: ${error}`));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/notes/${id}`);
            deleteNote(id);
        } catch (error) {
            console.error(`There was an error deleting the note: ${error}`);
        }
    }

    const handleEdit = (note) => {
        setCurrentNote(note);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'body', headerName: 'Body', width: 130 },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                const onClick = () => {
                    handleDelete(params.row.id);
                };

                return <Button onClick={onClick}>Delete</Button>;
            },
        },
    ];

    return (
        <div>
            {notes.map(note => (
                <Box key={note.id}>
                    <h2>{note.title}</h2>
                    <p>{note.body}</p>
                    <Button onClick={() => handleEdit(note)}>Edit</Button>
                    <Button onClick={() => handleDelete(note.id)}>Delete</Button>
                </Box>
            ))}
        </div>
    );
};

export default NoteList; 