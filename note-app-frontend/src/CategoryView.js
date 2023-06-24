import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import CategoryContext from './CategoryContext';
import NoteList from './NoteList';
import TaskList from './TaskList';
import { Box, Typography, LinearProgress, Button } from '@mui/material';  

const CategoryView = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setSelectedCategory } = useContext(CategoryContext);

  useEffect(() => {
    setSelectedCategory(id); // When component mounts or unmounts, update the selectedCategory state in App component
    return () => setSelectedCategory(null); // Reset selectedCategory when component unmounts
  }, [id, setSelectedCategory]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`http://127.0.0.1:5000/categories/${id}`),
      axios.get(`http://127.0.0.1:5000/notes?category_id=${id}`),
      axios.get(`http://127.0.0.1:5000/tasks?category_id=${id}`)
    ]).then((responses) => {
      setCategory(responses[0].data);
      setNotes(responses[1].data);
      setTasks(responses[2].data);
      setLoading(false);
    }).catch((error) => {
      console.error(`There was an error: ${error}`);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(progress);
  }, [tasks]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexDirection: 'column' }}>
      <Typography variant="h5" component="div">
        {category ? category.name : "Loading..."}
      </Typography>
      {loading ? "Loading..." : 
        <>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body1" component="div">
            {`${Math.round(progress)}% of tasks completed`}
          </Typography>
          <NoteList notes={notes} loading={loading} />
          <TaskList tasks={tasks} loading={loading} />
        </>
      }
    </Box>
  );  
};  

export default CategoryView;