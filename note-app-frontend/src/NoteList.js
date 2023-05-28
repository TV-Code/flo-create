import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const NoteList = ({ deleteNote }) => {
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

                return <button onClick={onClick}>Delete</button>;
            },
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid 
                rows={notes} 
                columns={columns} 
                pageSize={5} 
                rowsPerPageOptions={[5]} 
            />
        </div>
    );
};

export default NoteList;
