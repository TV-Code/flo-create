import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Slider, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = ({ currentTask, setCurrentTask, addTask, updateTask, action }) => {

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category_id, setCategory_id] = useState('');
  const [categories, setCategories] = useState([]);
  const [weight, setWeight] = useState(1);  // default weight to 1
  const [status, setStatus] = useState(0);  // default status to 0%
  const { categoryId } = useParams();

  const serializedCurrentTask = JSON.stringify(currentTask);

  useEffect(() => {
    if (currentTask && typeof currentTask === 'object') {
      setTitle(currentTask.title ? currentTask.title : '');
      setDescription(currentTask.description ? currentTask.description : '');
      setCategory_id(currentTask.category_id ? currentTask.category_id : '');
      setWeight(currentTask.weight ? currentTask.weight : 1);
      setStatus(currentTask.status ? currentTask.status : 0);
    }
  }, [currentTask, serializedCurrentTask]);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching categories')
        })
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const task = {
      title,
      description,
      category_id,
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
        value={category_id}
        onChange={(e) => setCategory_id(e.target.value)}
        fullWidth
        >
        {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
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
        onChange={(e, value) => setStatus(value)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value * 100}%`}
        step={0.01}
        marks
        min={0}
        max={1}
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
