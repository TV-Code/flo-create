import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Select, MenuItem, Snackbar, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import CategoryContext from './CategoryContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const JournalForm = ({ currentJournal, setCurrentJournal, addJournal, updateJournal, deleteJournal, action }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(new Date());
  const [category_id, setCategory_id] = useState('');
  const { selectedCategory } = useContext(CategoryContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/categories');
        setCategories(response.data);
        if (location.state && location.state.selectedCategory && action === 'new') {
          setCategory_id(location.state.selectedCategory);
        } else if (currentJournal && action === 'edit') {
          setCategory_id(currentJournal.category_id);
        }
      } catch (error) {
        console.error('There was an error fetching categories', error);
      }
    };

    fetchCategories();
  }, [location.state, currentJournal, action]);

  useEffect(() => {
    if (action === 'new' && selectedCategory) {
      setCategory_id(selectedCategory.id);
    }
  }, [selectedCategory, action]);

  useEffect(() => {
    if (typeof currentJournal === 'object' && currentJournal !== null) {
      setTitle(currentJournal.title);
      setBody(currentJournal.body);
      setDate(new Date(currentJournal.date));
      setCategory_id(currentJournal.category_id);
    } else {
      setTitle('');
      setBody('');
      setDate(new Date());
      setCategory_id('');
    }
  }, [currentJournal]);  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const journal = { title, body, date: date.toISOString(), category_id };

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
      setLoading(false);
      setOpen(true);
      navigate(-1);
    }
  };

  const handleCancel = () => {
    setCurrentJournal(null);
    setTitle('');
    setBody('');
    setDate(new Date());
    setCategory_id('');
    navigate(-1);
  };  

  const handleCategoryChange = (event) => {
    setCategory_id(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      setCurrentJournal(null);
      setTitle('');
      setBody('');
      setDate(new Date());
      setCategory_id('');
      return;
    }
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <DatePicker
            label="Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            TextField={(props) => <TextField {...props} />}
            disableFuture
          />
        </Box>
        <Box mb={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              label="Category"
              labelId="category-label"
              value={category_id || ''}
              onChange={handleCategoryChange}
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
            {loading ? 'Loading...' : (action === 'new' ? 'Add Journal Entry' : 'Update Journal Entry')}
          </Button>
          <Button type="button" variant="outlined" color="primary" disabled={loading} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Journal entry saved successfully"
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Box>
    </LocalizationProvider>
  );
};

export default JournalForm;
