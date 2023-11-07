import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';

const CompactJournalCard = ({ journal, onEdit, onDelete, getCategoryColor }) => {
    const categoryColor = getCategoryColor(journal.category_id);
    const theme = useTheme();
    const cardColor = theme.palette.custom.cardBackground;
    const textColor = theme.palette.text.primary;
  
    return (
        <Box 
        display="flex" 
        flexDirection="row" 
        alignItems="center" 
        p={1} 
        bgcolor={cardColor} 
        color={textColor} 
        borderRadius={1}
        height={60}
      >
        <Box 
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          width={14} 
          height={14} 
          bgcolor={categoryColor} 
          borderRadius="50%" 
          marginRight={2} 
        />
        <Box 
          flexGrow={1} 
          flexShrink={1}
          flexBasis="0"
          minWidth={100} 
          overflow="hidden" 
          pr={2}
        >
          <Typography noWrap fontWeight="bold">{journal.title}</Typography>
        </Box>
        <Box 
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          display="flex"
        >
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(journal)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(journal.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };
  
  export default CompactJournalCard;
  
