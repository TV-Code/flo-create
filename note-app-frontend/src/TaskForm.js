import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Box, Slider, Select, MenuItem, Snackbar, IconButton, FormControl, Typography, InputLabel, OutlinedInput } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';

const TaskForm = ({ currentTask, setCurrentTask, addTask, updateTask, action }) => {
  const [title, setTitle] = useState(currentTask?.title || '');
  const [description, setDescription] = useState(currentTask?.description || '');
  const [weight, setWeight] = useState(currentTask?.weight || 1);
  const [status, setStatus] = useState(Number(currentTask?.status) || 0);
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
        } else if (currentTask && action === 'edit') {
          setCategory_id(currentTask.category_id);
        }
      } catch (error) {
        console.error('There was an error fetching categories', error);
      } finally {
        setLoadingCategories(false);
      }
    };
  
    fetchCategories();
  }, [urlCategoryId, currentTask, action, location.state]);
  

  useEffect(() => {
    if (action === 'new' && selectedCategory) {
      setCategory_id(selectedCategory.id);
    }
  }, [selectedCategory, action]);  

  useEffect(() => {
    console.log('currentTask', currentTask);

    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setCategory_id(currentTask ? currentTask.category_id : '');
      setWeight(currentTask.weight);
      setStatus(currentTask ? Number(currentTask.status) : Number(0));
    } else {
      setTitle('');
      setDescription('');
      setWeight(1);
      setStatus(Number(0));
      setCategory_id(null); // set category_id to null when there is no current task
    }
  }, [currentTask]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const task = { id, title, description, category_id: category_id.toString(), weight, status };
    
    try {
      if (action === 'edit') {
        updateTask(task);
      } else if (action === 'new') {
        addTask(task, category_id); // calling the addTask function passed as prop
      }
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setCurrentTask(null);
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
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        autoComplete="off"
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
    <Box mb={2}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          label="Priority"
          labelId="priority-label"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          input={<OutlinedInput label="Priority" />}
        >
          {[1, 2, 3, 4, 5].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Box mb={2}>
      <Typography id="status-slider" gutterBottom>
        Progress:
      </Typography>
      <Slider
        aria-labelledby="status-slider"
        value={status}
        onChange={(e, value) => setStatus(Number(value))}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
        step={1}
        marks
        min={0}
        max={100}
      />
    </Box>
    <Box mb={2}>
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Loading...' : (action === 'new' ? 'Add Task' : 'Update Task')}
      </Button>
      </Box>
      <Box mb={1}>
      <Button type="button" variant="contained" color="secondary" disabled={loading} onClick={handleCancel}>
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
        message="Task saved successfully"
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

export default TaskForm;
