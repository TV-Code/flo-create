import Note from './Note';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NoteList = ({ handleAddNote, handleDeleteNote }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('/api/notes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => console.error(`There was an error retrieving the note list: ${error}`));
    }, []);

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
                    handleDeleteNote(params.row.id);
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
