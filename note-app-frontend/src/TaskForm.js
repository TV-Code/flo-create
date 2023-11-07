import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Box, Slider, Select, MenuItem, Snackbar, IconButton, FormControl, Typography, InputLabel, OutlinedInput } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';
import LastViablePathContext from './LastViablePathContext';

const TaskForm = ({ currentTask, setCurrentTask, addTask, updateTask, action }) => {
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
    description: '',
    weight: 1,
    progress: Number(0),
    category_id: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState(prevFormState => ({
      ...prevFormState,
      [name]: value,
    }));
  };

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
        } else if (currentTask && action === 'edit') {
          setFormState(prevFormState => ({
            ...prevFormState,
            category_id: currentTask.category_id,
          }));
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
      setFormState(prevFormState => ({
        ...prevFormState,
        category_id: selectedCategory.id,
      }));
    }
  }, [selectedCategory, action]);

  useEffect(() => {
    if (id && currentTask) { // for editing an existing task
      setFormState({
        title: currentTask.title,
        description: currentTask.description,
        category_id: currentTask.category_id,
        weight: currentTask.weight,
        progress: Number(currentTask.progress),
      });
    } else if (!id) { // for creating a new task
      setFormState({
        title: '',
        description: '',
        weight: 1,
        progress: Number(0),
        category_id: selectedCategory ? selectedCategory.id : null,
      });
    }
  }, [currentTask, id, selectedCategory]);  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const task = {
      id,
      title: formState.title,
      description: formState.description,
      category_id: formState.category_id.toString(),
      weight: formState.weight,
      progress: formState.progress,
    };

    try {
      if (action === 'edit') {
        await updateTask(task);
      } else if (action === 'new') {
        await addTask(task, formState.category_id);
      }
      setCurrentTask(null);
      setOpen(true);
      navigate(lastViablePath);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setFormState({
        title: '',
        description: '',
        weight: 1,
        progress: Number(0),
        category_id: null,
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormState({
      title: '',
      description: '',
      weight: 1,
      progress: Number(0),
      category_id: null,
    });
    setCurrentTask(null);
    navigate(lastViablePath);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setFormState({
      title: '',
      description: '',
      weight: 1,
      progress: Number(0),
      category_id: null,
    });
    setCurrentTask(null);
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
          name="description"
          label="Description"
          value={formState.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          minRows={4}
          maxRows={17}
          autoComplete="off"
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
      <Box mb={2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            name="weight"
            label="Priority"
            labelId="priority-label"
            value={formState.weight}
            onChange={handleInputChange}
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
        <Typography id="progress-slider" gutterBottom>
          Progress:
        </Typography>
        <Slider
          aria-labelledby="progress-slider"
          value={formState.progress}
          onChange={(e, value) => setFormState(prevFormState => ({
            ...prevFormState,
            progress: Number(value),
          }))}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          step={1}
          marks
          min={0}
          max={100}
        />
      </Box>
      <Box mb={2} sx={{display: 'flex', gap: 2}}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Loading...' : (action === 'new' ? 'Add Task' : 'Update Task')}
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
        message={action === 'new' ? 'Task added successfully!' : 'Task updated successfully!'}
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
  );
};

export default TaskForm;
