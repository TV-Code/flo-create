import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Select, MenuItem, Snackbar, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import CategoryContext from './CategoryContext';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LastViablePathContext from './LastViablePathContext';

const JournalForm = ({ currentJournal, setCurrentJournal, addJournal, updateJournal, action }) => {
  const { categoryId: urlCategoryId } = useParams();
  const { selectedCategory } = useContext(CategoryContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lastViablePath = useContext(LastViablePathContext);

  // Create new form state
  const [formState, setFormState] = useState({
    title: '',
    body: '',
    date: new Date(),
    category_id: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories');
        setCategories(response.data);
        if (location.state && location.state.selectedCategory && action === 'new') {
          setFormState(prevFormState => ({
            ...prevFormState,
            category_id: location.state.selectedCategory,
          }));
        } else if (currentJournal && action === 'edit') {
          setFormState(prevFormState => ({
            ...prevFormState,
            category_id: currentJournal.category_id,
          }));
        }
      } catch (error) {
        console.error('There was an error fetching categories', error);
      }
    };

    fetchCategories();
  }, [location.state, currentJournal, action]);

  useEffect(() => {
    if (action === 'new' && selectedCategory) {
      setFormState(prevFormState => ({
        ...prevFormState,
        category_id: selectedCategory.id,
      }));
    }
  }, [selectedCategory, action]);

  useEffect(() => {
    if (id && currentJournal) { // for editing an existing journal
      setFormState({
        title: currentJournal.title,
        body: currentJournal.body,
        date: new Date(currentJournal.date),
        category_id: currentJournal.category_id,
      });
    } else if (!id) { // for creating a new journal
      setFormState({
        title: '',
        body: '',
        date: new Date(),
        category_id: selectedCategory ? selectedCategory.id : null,
      });
    }
  }, [currentJournal, id, selectedCategory]);

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

    const journal = {
      id,
      title: formState.title,
      body: formState.body,
      date: formState.date,
      category_id: formState.category_id,
    };

    try {
      if (action === 'edit' && currentJournal) {
        updateJournal({ ...journal, id: currentJournal.id });
      } else {
        addJournal(journal);
      }
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setCurrentJournal(null);
      setFormState({
        title: '',
        body: '',
        date: new Date(),
        category_id: '',
      });
      setLoading(false);
      setOpen(true);
      navigate(lastViablePath);
    }
  };

  const handleCancel = () => {
    setCurrentJournal(null);
    setFormState({
      title: '',
      body: '',
      date: new Date(),
      category_id: '',
    });
    navigate(lastViablePath);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCurrentJournal(null);
    setFormState({
      title: '',
      body: '',
      date: new Date(),
      category_id: '',
    });
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <DatePicker
            name="date"
            label="Date"
            value={formState.date}
            onChange={(newDate) => setFormState(prevFormState => ({
              ...prevFormState,
              date: newDate,
            }))}
            TextField={(props) => <TextField {...props} />}
            disableFuture
          />
        </Box>
        <Box mb={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              name="category_id"
              label="Category"
              labelId="category-label"
              value={formState.category_id || ''}
              onChange={handleInputChange}
              input={<OutlinedInput label="Category" />}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} sx={{display: 'flex', gap: 2}}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Loading...' : (action === 'new' ? 'Add Journal' : 'Update Journal')}
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
          message={action === 'new' ? 'Journal added successfully!' : 'Journal updated successfully!'}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </LocalizationProvider>
  );
};

export default JournalForm;
