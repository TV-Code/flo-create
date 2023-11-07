import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Masonry } from '@mui/lab';
import NoteCard from './NoteCard';
import CompactNoteCard from './CompactNoteCard';
import AllItemsContext from './AllItemsContext';

const NoteList = ({ deleteNote, notes, loading, viewMode, getCategoryColor }) => {
  const [expandedNote, setExpandedNote] = useState(null);
  const { currentNote, setCurrentNote } = useContext(AllItemsContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {  
    deleteNote(id);
  }

  const handleEdit = (note) => {
    setCurrentNote(note);
    navigate(`/notes/${note.id}`);
  };  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Masonry columns={3} spacing={2}>
          {notes.map(note => (
              viewMode === 'regular' ? (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryColor={getCategoryColor}
                  expandedNote={expandedNote}
                  setExpandedNote={setExpandedNote}
                />
              ) : (
                <CompactNoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryColor={getCategoryColor}
                />
              )
            ))}
        </Masonry>
      )}
    </Box>
  );
};

export default NoteList;
