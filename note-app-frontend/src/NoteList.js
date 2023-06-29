import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import NoteCard from './NoteCard';

const NoteList = ({ deleteNote, notes, loading }) => {
  const [expandedNote, setExpandedNote] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {  
    deleteNote(id);
  }

  const handleEdit = (note) => {
    navigate(`/notes/${note.id}`);
  };  

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        notes.map(note => {
            console.log(note.id);
            return <NoteCard 
                    key={note.id} 
                    note={note} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    expandedNote={expandedNote}
                    setExpandedNote={setExpandedNote}
                   />
          })          
      )}
    </Box>
  );
}  

export default NoteList;
