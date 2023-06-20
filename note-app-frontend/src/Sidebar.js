import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import TaskIcon from '@mui/icons-material/Task';
import BookIcon from '@mui/icons-material/Book';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const styles = {
  sidebar: {
    background: '#333',
    color: '#fff',
    padding: '20px',
    height: '100vh',
    minWidth: '200px',
  },
  listItem: {
    marginBottom: '15px',
    '&:hover': {
      background: '#444',
    },
  },
  active: {
    background: '#444',
  },
};

function Sidebar() {
  const location = useLocation();
  let addLink = '/';

  if (location.pathname.startsWith('/notes')) {
    addLink = '/notes/new';
  } else if (location.pathname.startsWith('/tasks')) {
    addLink = '/tasks/new';
  }

  return (
    <List style={styles.sidebar}>
      <ListItem>
        <IconButton component={Link} to={addLink} color="inherit">
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </ListItem>
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
          <NotesIcon fontSize="large" style={{ color: '#fff' }} />
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
          <TaskIcon fontSize="large" style={{ color: '#fff' }} />
        </ListItemIcon>
        <ListItemText primary="Tasks" primaryTypographyProps={{ variant: 'h6' }} />
      </ListItem>
      <ListItem button component={Link} to="/journal" style={styles.listItem}>
        <ListItemIcon>
          <BookIcon fontSize="large" style={{ color: '#fff' }} />
        </ListItemIcon>
        <ListItemText primary="Journal" primaryTypographyProps={{ variant: 'h6' }} />
      </ListItem>
      <ListItem button component={Link} to="/chat" style={styles.listItem}>
        <ListItemIcon>
          <ChatIcon fontSize="large" style={{ color: '#fff' }} />
        </ListItemIcon>
        <ListItemText primary="Chat" primaryTypographyProps={{ variant: 'h6' }} />
      </ListItem>
    </List>
  );
}

export default Sidebar;
