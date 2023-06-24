import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Slider, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = ({ currentTask, setCurrentTask, addTask, updateTask, action }) => {

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category_id, setCategory_id] = useState('');
  const [category_name, setCategory_name] = useState('');
  const [categories, setCategories] = useState([]);
  const [weight, setWeight] = useState(1);  // default weight to 1
  const [status, setStatus] = useState(0);  // default status to 0%
  const { categoryId } = useParams();

  const serializedCurrentTask = JSON.stringify(currentTask);

  useEffect(() => {
    if (currentTask && typeof currentTask === 'object') {
      setTitle(currentTask.title ? currentTask.title : '');
      setDescription(currentTask.description ? currentTask.description : '');

      // Find the category name corresponding to the category_id
      const category = categories.find(cat => cat.id === currentTask.category_id);
      if (category) {
        setCategory_name(category.name);
      }

      setWeight(currentTask.weight ? currentTask.weight : 1);
      setStatus(currentTask.status ? currentTask.status : 0);
    }
  }, [currentTask, serializedCurrentTask, categories]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching categories')
        })
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      if (currentTask && currentTask.category_id) {
        setCategory_id(currentTask.category_id);
      } else {
        setCategory_id(categories[0].id); // Set to default category
      }
    }
  }, [categories, currentTask]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Find the category ID that corresponds to the selected name
    const category = categories.find(cat => cat.name === category_name);
    let categoryIdToSend = category ? category.id : '';

    const task = {
      title,
      description,
      category_id: categoryIdToSend,
      weight,
      status,
    };

    if (action === 'new') {
      addTask(task, categoryId);
    } else if (action === 'edit') {
      task.id = currentTask.id;
      updateTask(task);
    }

    navigate('/tasks');
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      <Select
        label="Category"
        value={category_name}
        onChange={(e) => setCategory_name(e.target.value)}
        fullWidth
        >
        {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
            {category.name}
            </MenuItem>
        ))}
        </Select>
      <Select
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        fullWidth
      >
        {[1, 2, 3, 4, 5].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Slider
        label="Status"
        value={status}
        onChange={(e, value) => setStatus(Number(value))}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
        step={1}
        marks
        min={0}
        max={100}
        />
      <Button type="submit" variant="contained" color="primary">
        {action === 'new' ? 'Add' : 'Update'} Task
      </Button>
      {action === 'edit' && (
        <Button onClick={handleCancel} variant="contained" color="secondary">
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default TaskForm;
