import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Masonry } from '@mui/lab';
import JournalCard from './JournalCard';
import CompactJournalCard from './CompactJournalCard';
import AllItemsContext from './AllItemsContext';

const JournalList = ({ deleteJournal, journals, loading, viewMode, getCategoryColor }) => {
  const [expandedJournal, setExpandedJournal] = useState(null);
  const { currentJournal, setCurrentJournal } = useContext(AllItemsContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    deleteJournal(id);
  }

  const handleEdit = (journal) => {
    setCurrentJournal(journal);
    navigate(`/journals/${journal.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Masonry columns={3} spacing={2}>
          {journals.map(journal => (
              viewMode === 'regular' ? (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryColor={getCategoryColor}
                  expandedJournal={expandedJournal}
                  setExpandedJournal={setExpandedJournal}
                />
              ) : (
                <CompactJournalCard
                  key={journal.id}
                  journal={journal}
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


export default JournalList;
