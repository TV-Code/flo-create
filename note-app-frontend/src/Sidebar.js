import React, { useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import TaskIcon from '@mui/icons-material/Task';
import BookIcon from '@mui/icons-material/Book';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BookMarkAdd from '@mui/icons-material/BookmarkAdd';
import Analytics from '@mui/icons-material/Analytics'
import CategoryContext from './CategoryContext';
import { useTheme } from '@emotion/react';
import AllItemsContext from './AllItemsContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const { setCurrentTask } = useContext(AllItemsContext);
  const theme = useTheme();
  let addLink = '/';

  const styles = {
    sidebar: {
      background: theme.palette.custom.sidebar,
      color: theme.palette.custom.text,
      padding: '20px',
      height: '100vh',
      minWidth: '200px',
    },
    listItem: {
      marginBottom: '15px',
      '&:hover': {
        background: theme.palette.custom.listItem,
      },
    },
    active: {
      background: theme.palette.custom.active,
    },
  };

  if (location.pathname.startsWith('/notes')) {
    addLink = '/notes/new';
  } else if (location.pathname.startsWith('/tasks')) {
    addLink = '/tasks/new';
  } else if (location.pathname.startsWith('/journals')) {
    addLink = '/journals/new';
  }

  const handleAddNote = () => {
    navigate('/notes/new', { state: { selectedCategory } });
  }

  const handleAddTask = () => {
    navigate('/tasks/new', { state: { selectedCategory } });
  };

  const handleAddJournal = () => {
    navigate('/journals/new', { state: { selectedCategory } });
  };

  return (
    <List style={styles.sidebar}>
        <IconButton onClick={() => handleAddNote()} style={{ color: theme.palette.custom.icon }}>
            <PlaylistAddIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={() => handleAddTask()} style={{ color: theme.palette.custom.icon }}>
            <NoteAddIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={() => handleAddJournal()} style={{ color: theme.palette.custom.icon }}>
            <BookMarkAdd fontSize="large" />
        </IconButton>
        <Box style={{ marginTop: '20px' }}>
            <ListItem
                button
                component={Link}
                to="/notes"
                style={
                    location.pathname.startsWith('/notes')
                        ? { ...styles.listItem, ...styles.active }
                        : styles.listItem
                }
            >
                <ListItemIcon>
                    <NotesIcon fontSize="large" style={{ color: theme.palette.custom.icon }} />
                </ListItemIcon>
                <ListItemText primary="Notes" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem
                button
                component={Link}
                to="/tasks"
                style={
                    location.pathname.startsWith('/tasks')
                        ? { ...styles.listItem, ...styles.active }
                        : styles.listItem
                }
            >
                <ListItemIcon>
                    <TaskIcon fontSize="large" style={{ color: theme.palette.custom.icon }} />
                </ListItemIcon>
                <ListItemText primary="Tasks" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem
                button
                component={Link}
                to="/journals"
                style={
                    location.pathname.startsWith('/journals')
                        ? { ...styles.listItem, ...styles.active }
                        : styles.listItem
                }
            >
                <ListItemIcon>
                    <BookIcon fontSize="large" style={{ color: theme.palette.custom.icon }} />
                </ListItemIcon>
                <ListItemText primary="Journals" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            {/* <ListItem
                button
                component={Link}
                to="/analytics"
                style={
                    location.pathname.startsWith('/analytics')
                        ? { ...styles.listItem, ...styles.active }
                        : styles.listItem
                }
            >
                <ListItemIcon>
                    <Analytics fontSize="large" style={{ color: theme.palette.custom.icon }} />
                </ListItemIcon>
                <ListItemText primary="Analytics" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem> */}
        </Box>
    </List>
  );
}

export default Sidebar;
