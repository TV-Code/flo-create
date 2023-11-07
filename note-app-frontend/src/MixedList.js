import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import NoteCard from './NoteCard';
import CompactNoteCard from './CompactNoteCard';
import TaskCard from './TaskCard';
import CompactTaskCard from './CompactTaskCard';
import JournalCard from './JournalCard';
import CompactJournalCard from './CompactJournalCard';
import { Masonry } from '@mui/lab';

const MixedList = ({ data = [], loading, deleteItem, viewMode, getCategoryColor }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id, type) => {
    deleteItem(id, type);
  }

  const handleEdit = (item, type) => {
    navigate(`/${type}s/${item.id}`);
  };

  const renderCard = (item, index) => {
    const commonProps = {
      key: index,
      onEdit: () => handleEdit(item, item.type),
      onDelete: () => handleDelete(item.id, item.type),
    };

    if (viewMode === 'compact') {
      switch (item.type) {
        case 'note':
          return <CompactNoteCard note={item} 
          onEdit={() => handleEdit(item, 'note')}
          onDelete={() => handleDelete(item.id, 'note')}
          expandedJournal={expandedItem}
          setExpandedJournal={setExpandedItem}
          getCategoryColor={getCategoryColor}
          />;
        case 'task':
          return <CompactTaskCard task={item} 
          onEdit={() => handleEdit(item, 'task')}
          onDelete={() => handleDelete(item.id, 'task')}
          expandedJournal={expandedItem}
          setExpandedJournal={setExpandedItem} 
          getCategoryColor={getCategoryColor}
          />;
        case 'journal':
          return <CompactJournalCard journal={item} 
          onEdit={() => handleEdit(item, 'journal')}
          onDelete={() => handleDelete(item.id, 'journal')}
          expandedJournal={expandedItem}
          setExpandedJournal={setExpandedItem} 
          getCategoryColor={getCategoryColor}
          />;
        default:
          return null;
      }
    } else {
      switch (item.type) {
        case 'note':
          return (
            <NoteCard 
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
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Masonry columns={3} spacing={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          data.map(renderCard)
        )}
      </Masonry>
    </Box>
  );
};

export default MixedList;
