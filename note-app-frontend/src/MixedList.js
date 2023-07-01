import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import NoteCard from './NoteCard';
import TaskCard from './TaskCard';
import JournalCard from './JournalCard';

const MixedList = ({ data, loading, deleteItem }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id, type) => {
    deleteItem(id, type);
  }

  const handleEdit = (item, type) => {
    navigate(`/${type}s/${item.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 5 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        data.map((item, index) => {
          switch (item.type) {
            case 'note':
              return (
                <NoteCard 
                  key={index}
                  note={item} 
                  onEdit={() => handleEdit(item, 'note')}
                  onDelete={() => handleDelete(item.id, 'note')}
                  expandedNote={expandedItem}
                  setExpandedNote={setExpandedItem} 
                />
              );
            case 'task':
              return (
                <TaskCard 
                  key={index}
                  task={item} 
                  onEdit={() => handleEdit(item, 'task')}
                  onDelete={() => handleDelete(item.id, 'task')}
                  expandedTask={expandedItem}
                  setExpandedTask={setExpandedItem}
                />
              );
            case 'journal':
              return (
                <JournalCard 
                  key={index}
                  journal={item} 
                  onEdit={() => handleEdit(item, 'journal')}
                  onDelete={() => handleDelete(item.id, 'journal')}
                  expandedJournal={expandedItem}
                  setExpandedJournal={setExpandedItem}
                />
              );
            default:
              return null;
          }
        })
      )}
    </Box>
  );
};

export default MixedList;
