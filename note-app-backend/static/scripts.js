import React from 'react';
import ReactDOM from 'react-dom';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    editable: true,
  },
  {
    field: 'body',
    headerName: 'Body',
    width: 150,
    editable: true,
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 150,
    editable: true,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 150,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    width: 150,
  },
];

const getNotes = async () => {
    const response = await fetch('http://localhost:5000/notes');
    const data = await response.json();
    return data;
}

const NotesApp = () => {
    const [notes, setNotes] = React.useState([]);

    React.useEffect(() => {
        getNotes().then(data => setNotes(data));
    }, []);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={notes}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
            />
        </div>
    );
}

ReactDOM.render(<NotesApp />, document.getElementById('root'));
