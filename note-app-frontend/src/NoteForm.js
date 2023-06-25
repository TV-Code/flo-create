import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Snackbar, IconButton, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CategoryContext from './CategoryContext';

const NoteForm = ({ addNote, updateNote, currentNote, setCurrentNote, action }) => {
  const [title, setTitle] = useState(currentNote ? currentNote.title : '');
  const [body, setBody] = useState(currentNote ? currentNote.body : '');
  const { categoryId: urlCategoryId } = useParams();
  const { selectedCategory } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);
  const [category_id, setCategory_id] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories');
        setCategories(response.data);
        if (urlCategoryId || selectedCategory) {
          const currentCategory = response.data.find(cat => cat.id === urlCategoryId) || selectedCategory;
          setCategory_id(currentCategory.id);
        }
      } catch (error) {
        console.error('There was an error fetching categories', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [urlCategoryId, selectedCategory]);

  useEffect(() => {
    if (categories.length) {
      if (currentNote) {
        setCategory_id(currentNote.category_id);
      } else if (urlCategoryId || selectedCategory) {
        const categoryFromUrl = categories.find(cat => cat.id === urlCategoryId);
        const category = categoryFromUrl || selectedCategory;
        setCategory_id(category ? category.id : '');
      }
    }
}, [categories, urlCategoryId, selectedCategory, currentNote]);


  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setBody(currentNote.body);
      setCategory_id(currentNote.category_id);
    } else {
      setTitle('');
      setBody('');
    }
  }, [currentNote]);

  useEffect(() => {
    if (action === 'new' && selectedCategory) {
      setCategory_id(selectedCategory.id); // Set to selected category as default
    }
  }, [selectedCategory, action]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const note = { title, body, category_id };
    
    if (action === 'edit') {
        try {
          const response = await axios.put(`http://127.0.0.1:5000/notes/${id}`, note);
          updateNote(response.data.data);
          setCurrentNote(null);
        } catch (error) {
          console.error('There was an error!', error);
        }
      } else if (action === 'new') {
        try {
          const response = await axios.post('http://127.0.0.1:5000/notes', note);
          addNote(response.data.data);
          setCurrentNote(null);
        } catch (error) {
          console.error('There was an error!', error);
        }
      }
  
      setLoading(false);
      setOpen(true);
      navigate('/notes');
    };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        variant="outlined"
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        label="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
        variant="outlined"
        multiline
        rows={4}
        sx={{ mb: 1 }}
      />
      {!loadingCategories && (
        <Select
          label="Category"
          value={category_id || ''}
          onChange={(e) => setCategory_id(e.target.value)}
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      
      )}
      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Save'}
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note saved successfully"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Box>
  );
};

export default NoteForm;
