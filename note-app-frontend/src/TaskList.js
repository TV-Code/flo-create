import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(`Error fetching data: ${error}`);
      })
  }, []);

  const handleDelete = async (id) => {  
    try {  
      await axios.delete(`http://127.0.0.1:5000/tasks/${id}`);  
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {  
      console.error(`There was an error deleting the note: ${error}`);  
    }  
  }

  const handleEdit = (task) => {  
    navigate(`/tasks/${task.id}`);  
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
    </Box>
  );
}

export default TaskList;
