import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Select, MenuItem, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';
import LastViablePathContext from './LastViablePathContext';

const NoteForm = ({ currentNote, setCurrentNote, addNote, updateNote, action }) => {
  const { categoryId: urlCategoryId } = useParams();
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lastViablePath = useContext(LastViablePathContext);

  // Create new form state
  const [formState, setFormState] = useState({
    title: '',
    body: '',
    category_id: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories');
        setCategories(response.data);
        if (location.state && location.state.selectedCategory && action === 'new') {
          setFormState(prevFormState => ({
            ...prevFormState,
            category_id: location.state.selectedCategory,
          }));
        } else if (currentNote && action === 'edit') {
          setFormState(prevFormState => ({
            ...prevFormState,
            category_id: currentNote.category_id,
          }));
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
      setFormState(prevFormState => ({
        ...prevFormState,
        category_id: selectedCategory.id,
      }));
    }
  }, [selectedCategory, action]);

  useEffect(() => {
    if (id && currentNote) { // for editing an existing note
      setFormState({
        title: currentNote.title,
        body: currentNote.body,
        category_id: currentNote.category_id,
      });
    } else if (!id) { // for creating a new note
      setFormState({
        title: '',
        body: '',
        category_id: selectedCategory ? selectedCategory.id : null,
      });
    }
  }, [currentNote, id, selectedCategory]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState(prevFormState => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const note = {
      id,
      title: formState.title,
      body: formState.body,
      category_id: formState.category_id.toString(),
    };

    try {
      if (action === 'edit') {
        await updateNote(note);
      } else if (action === 'new') {
        await addNote(note, formState.category_id);
      }
      setCurrentNote(null);
      setOpen(true);
      navigate(lastViablePath);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setFormState({
        title: '',
        body: '',
        category_id: '',
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormState({
      title: '',
      body: '',
      category_id: '',
    });
    setCurrentNote(null);
    navigate(lastViablePath);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setFormState({
      title: '',
      body: '',
      category_id: '',
    });
    setCurrentNote(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          name="title"
          label="Title"
          value={formState.title}
          onChange={handleInputChange}
          fullWidth
          required
          autoComplete="off"
        />
      </Box>
      <Box mb={2}>
        <TextField
          name="body"
          label="Body"
          value={formState.body}
          onChange={handleInputChange}
          fullWidth
          multiline
          minRows={4}
          maxRows={17}
          autoComplete="off"
        />
      </Box>
      <Box mb={2}>
        <Select
          name="category_id"
          label="Category"
          value={formState.category_id || ''}
          onChange={handleInputChange}
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mb={2} sx={{display: 'flex', gap: 2}}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Loading...' : (action === 'new' ? 'Add Note' : 'Update Note')}
        </Button>
        <Button type="button" variant="outlined" color="primary" disabled={loading} onClick={handleCancel}>
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
        message={action === 'new' ? 'Note added successfully!' : 'Note updated successfully!'}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Box>
  );
};

export default NoteForm;