import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Collapse } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format, isValid } from 'date-fns';
import { useTheme } from '@emotion/react';

const JournalCard = ({ journal, onEdit, onDelete, expandedJournal, setExpandedJournal }) => {
  const maxLength = 150;  // Max number of characters to display before showing 'Read More'
  const [readMore, setReadMore] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setReadMore(journal.body.length > maxLength);
  }, [journal]);

  const handleExpandClick = () => {
    setExpandedJournal(expandedJournal === journal.id ? null : journal.id);
  };

  const isExpanded = expandedJournal === journal.id;
  const displayDescription = isExpanded ? journal.body : `${journal.body.substring(0, maxLength)}${readMore ? '...' : ''}`;

  const formattedDate = isValid(new Date(journal.date))
    ? format(new Date(journal.date), 'dd/MM/yyyy')
    : '';

  return (
    <Card sx={{ minWidth: 275, maxWidth: 345, mb: 2, backgroundColor: theme.palette.custom.cardBackground }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div">
            {journal.title}
          </Typography>
          <Box>
            <Typography variant="h7" component="div">
              {formattedDate}
            </Typography>
            <Box display="flex" flexDirection="row">
              <IconButton onClick={() => onEdit(journal)} sx={{ ml: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(journal.id)} sx={{ ml: 1 }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2">
          {displayDescription}
        </Typography>
        {readMore && (
          <Box display="flex" alignItems="center" onClick={handleExpandClick} sx={{ cursor: 'pointer', mt: 1 }}>
            <Typography variant="body2" color="primary">
              {isExpanded ? 'Read Less' : 'Read More'}
            </Typography>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalCard;
