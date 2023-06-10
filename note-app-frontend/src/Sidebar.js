import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import TaskIcon from '@mui/icons-material/Task';
import BookIcon from '@mui/icons-material/Book';
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function Sidebar() {
  return (
    <List>
      <ListItem>
        <IconButton component={Link} to="/notes/new" color="primary">
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </ListItem>
      <ListItem button component={Link} to="/notes">
        <ListItemIcon>
          <NotesIcon />
        </ListItemIcon>
        <ListItemText primary="Notes" />
      </ListItem>
      <ListItem button component={Link} to="/tasks">
        <ListItemIcon>
          <TaskIcon />
        </ListItemIcon>
        <ListItemText primary="Tasks" />
      </ListItem>
      <ListItem button component={Link} to="/journal">
        <ListItemIcon>
          <BookIcon />
        </ListItemIcon>
        <ListItemText primary="Journal" />
      </ListItem>
      <ListItem button component={Link} to="/chat">
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Chat" />
      </ListItem>
    </List>
  );
}

export default Sidebar;
