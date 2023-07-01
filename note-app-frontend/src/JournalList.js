import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import JournalCard from './JournalCard';

const JournalList = ({ deleteJournal, journals, loading }) => {
  const [expandedJournal, setExpandedJournal] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    deleteJournal(id);
  }

  const handleEdit = (journal) => {
    navigate(`/journals/${journal.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 5 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        journals.map(journal => (
          <JournalCard
            key={journal.id}
            journal={journal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            expandedJournal={expandedJournal}
            setExpandedJournal={setExpandedJournal}
          />
        ))
      )}
    </Box>
  );
};

export default JournalList;
