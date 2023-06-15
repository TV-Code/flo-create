import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error(`There was an error retrieving the tasks: ${error}`);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
};

export default Tasks;
