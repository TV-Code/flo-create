import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Select, MenuItem, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';

const NoteForm = ({ currentNote, setCurrentNote, addNote, updateNote, action }) => {
  const [title, setTitle] = useState(currentNote?.title || '');
  const [body, setBody] = useState(currentNote?.body || '');
  const { categoryId: urlCategoryId } = useParams();
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);
  const [category_id, setCategory_id] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories');
        setCategories(response.data);
        if (location.state && location.state.selectedCategory && action === 'new') {
          setCategory_id(location.state.selectedCategory);
        } else if (currentNote && action === 'edit') {
          setCategory_id(currentNote.category_id);
        }
      } catch (error) {
        console.error('There was an error fetching categories', error);
      } finally {
        setLoadingCategories(false);
      }
    };
  
    fetchCategories();
  }, [urlCategoryId, currentNote, action, location.state]);
  

  useEffect(() => {
    if (action === 'new' && selectedCategory) {
      setCategory_id(selectedCategory.id);
    }
  }, [selectedCategory, action]);  

  useEffect(() => {
    console.log('currentNote', currentNote);

    if (currentNote) {
      setTitle(currentNote.title);
      setBody(currentNote.body);
      setCategory_id(currentNote ? currentNote.category_id : '');
    } else {
      setTitle('');
      setBody('');
      setCategory_id(null); // set category_id to null when there is no current note
    }
  }, [currentNote]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const note = { id, title, body, category_id: category_id.toString() };
    
    try {
      if (action === 'edit') {
        updateNote(note);
      } else if (action === 'new') {
        addNote(note, category_id); // calling the addNote function passed as prop
      }
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setCurrentNote(null);
      setLoading(false);
      setOpen(true);
      navigate(-1);
    }
  };


  const handleCancel = () => {
    navigate(-1);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleCategoryChange = (event) => {
    setCategory_id(event.target.value);
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box mb={2}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        autoComplete="off"
      />
      </Box>
      <Box mb={2}>
      <TextField
        label="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth
        multiline
        rows={4}
        autoComplete="off"
      />
      </Box>
      <Box mb={2}>
        <Select
          label="Category"
          value={category_id || ''}
          onChange={handleCategoryChange}
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        </Box>
        <Box mb={2}>
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Loading...' : (action === 'new' ? 'Add Note' : 'Update Note')}
      </Button>
      </Box>
      <Box mb={1}>
      <Button type="button" variant="contained" color="#8c7851" disabled={loading} onClick={handleCancel}>
        Cancel
      </Button>
      </Box>
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
