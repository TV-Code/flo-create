import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function SecondarySidebar({ isDrawerOpen, toggleDrawer}) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div>
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <div style={{ padding: '10px', width: 250 }}>
          <TextField
            label="New Category"
            variant="standard"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
          />
          <IconButton color="primary" onClick={handleAddCategory}>
            <AddIcon />
          </IconButton>
          <List>
            {categories.map((category, index) => (
              <ListItem button key={index}>
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default SecondarySidebar;
