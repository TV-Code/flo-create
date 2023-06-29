import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';
import NoteList from './NoteList';
import TaskList from './TaskList';
import Header from './Header';
import { alpha } from '@mui/system';
import { Box, Typography, LinearProgress } from '@mui/material';

const CategoryView = ({ filteredNotes, filteredTasks }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(2); // Default to 'All'
  const [category, setCategory] = useState(null);
  const [categoryColor, setCategoryColor] = useState('default');
  const [lightenedColor, setLightenedColor] = useState('default');
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedCategory } = useContext(CategoryContext);
  const [progress, setProgress] = useState(0);

  const loadData = () => {
    setLoading(true);
    axios.get(`http://127.0.0.1:5000/categories/${id}`)
    .then((response) => {
      setSelectedCategory(id);
      setCategory(response.data);
      setCategoryColor(response.data.color);
      setLightenedColor(alpha(response.data.color, 1 - 0.6));
    })
    .catch(error => {
      console.error(`There was an error: ${error}`);
      setLoading(false);
    });

    switch (activeTab) {
      case 0: // Load notes
        axios.get(`http://127.0.0.1:5000/notes?category_id=${id}`)
        .then((response) => {
          setNotes(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(`There was an error: ${error}`);
          setLoading(false);
        });
        break;
      case 1: // Load tasks
        axios.get(`http://127.0.0.1:5000/tasks?category_id=${id}`)
        .then((response) => {
          setTasks(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(`There was an error: ${error}`);
          setLoading(false);
        });
        break;
      case 2: // Load both notes and tasks
      default:
        axios.all([
          axios.get(`http://127.0.0.1:5000/notes?category_id=${id}`),
          axios.get(`http://127.0.0.1:5000/tasks?category_id=${id}`)
        ])
        .then(axios.spread((notesResponse, tasksResponse) => {
          setNotes(notesResponse.data);
          setTasks(tasksResponse.data);
          setLoading(false);
        }))
        .catch(error => {
          console.error(`There was an error: ${error}`);
          setLoading(false);
        });
        break;
    }
  };

  useEffect(() => {
    loadData();
  }, [id, activeTab]);

  const progressValue = useMemo(() => {
    const totalWeightedProgress = tasks.reduce((total, task) => total + (task.status * task.weight), 0);
    const totalPossibleWeight = tasks.reduce((total, task) => total + (100 * task.weight), 0);
    return totalPossibleWeight > 0 ? (totalWeightedProgress / totalPossibleWeight) * 100 : 0;
  }, [tasks]);

  useEffect(() => {
    setProgress(progressValue);
  }, [progressValue]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    loadData();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <NoteList notes={filteredNotes} loading={loading} />;
      case 1:
        return <TaskList tasks={filteredTasks} loading={loading} categoryColor={categoryColor} lightenedColor={lightenedColor} showProgressBar={false} />
      case 2:
      default:
        return (
          <>
            <NoteList notes={filteredNotes} loading={loading} />
            <TaskList tasks={filteredTasks} loading={loading} categoryColor={categoryColor} lightenedColor={lightenedColor} showProgressBar={false} />
          </>
        );
    }
  };

  const shouldDisplayProgress = activeTab === 1;

  return (
    <>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexDirection: 'column' }}>
        <Typography variant="h4" component="div">
          {category ? category.name : "Loading..."}
        </Typography>
        {loading ? "Loading..." : 
          <>
            {shouldDisplayProgress && 
              <>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{
                    height: 7,
                    borderRadius: 5,
                    bgcolor: lightenedColor,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: categoryColor,
                    },
                  }}
                />
                <Typography variant="body1" component="div">
                  {`${Math.round(progress)}% of total progress completed`}
                </Typography>
              </>
            }
            {renderTabContent()}
          </>
        }
      </Box>
    </>
  );  
};  

export default CategoryView;
