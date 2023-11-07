import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CategoryContext from './CategoryContext';
import { useSearch } from './SearchContext';
import NoteList from './NoteList';
import TaskList from './TaskList';
import JournalList from './JournalList';
import MixedList from './MixedList';
import Header from './Header';
import { alpha } from '@mui/system';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useFetchNotes, useFetchTasks, useFetchJournals, sortMixedData } from './CustomHooks';

const CategoryView = ({ activeTab, setActiveTab, sortCriteria, setSortCriteria, deleteItem, getCategoryColor, viewMode }) => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryColor, setCategoryColor] = useState('default');
  const [lightenedColor, setLightenedColor] = useState('default');
  const { setSelectedCategory } = useContext(CategoryContext);
  const { searchTerm, setSearchTerm } = useSearch();
  const [progress, setProgress] = useState(0);
  const [apiType, setApiType] = useState('');

  useEffect(() => {
    switch (activeTab) {
      case 0:
        setApiType('notes');
        break;
      case 1:
        setApiType('tasks');
        break;
      case 2:
        setApiType('journals');
        break;
      default:
        setApiType('all');
    }
  }, [activeTab]);

  const { notes, fetchNotes } = useFetchNotes(id, searchTerm, sortCriteria, apiType);
  const { tasks, fetchTasks } = useFetchTasks(id, searchTerm, sortCriteria, apiType);
  const { journals, fetchJournals } = useFetchJournals(id, searchTerm, sortCriteria, apiType);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/categories/${id}`)
      .then((response) => {
        setSelectedCategory(id);
        setCategory(response.data);
        setCategoryColor(response.data.color);
        setLightenedColor(alpha(response.data.color, 1 - 0.6));
      })
      .catch(error => console.error(`There was an error: ${error}`));

    fetchNotes();
    fetchTasks();
    fetchJournals();
  }, [id, searchTerm, fetchNotes, fetchTasks, fetchJournals]);

  const prepareMixedListData = () => {
    // Combine notes, tasks, and journals
    const mixedData = [...notes, ...tasks, ...journals];
  
    // Sort the mixed data
    const sortedMixedData = sortMixedData(mixedData, sortCriteria);
  
    return sortedMixedData;
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <NoteList notes={notes} getCategoryColor={getCategoryColor} viewMode={viewMode} />;
      case 1:
        return <TaskList tasks={tasks} categoryColor={categoryColor} lightenedColor={lightenedColor} showProgressBar={false} getCategoryColor={getCategoryColor} viewMode={viewMode} />;
      case 2:
        return <JournalList journals={journals} getCategoryColor={getCategoryColor} viewMode={viewMode} />;
      case 3:
      default:
        const mixedListData = prepareMixedListData();
        return <MixedList data={mixedListData} categoryColor={categoryColor} lightenedColor={lightenedColor} deleteItem={deleteItem} getCategoryColor={getCategoryColor} viewMode={viewMode} />
    }
  };

  const progressValue = useMemo(() => {
    const totalWeightedProgress = tasks.reduce((total, task) => total + (task.progress * task.weight), 0);
    const totalPossibleWeight = tasks.reduce((total, task) => total + (100 * task.weight), 0);
    return totalPossibleWeight > 0 ? (totalWeightedProgress / totalPossibleWeight) * 100 : 0;
  }, [tasks]);

  useEffect(() => {
    setProgress(progressValue);
  }, [progressValue]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSortCriteria('default');
    setSearchTerm('');
  };
  
  const shouldDisplayProgress = activeTab === 1;

  return (
    <>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexDirection: 'column' }}>
        <Typography variant="h4" component="div">
          {category ? category.name : "Loading..."}
        </Typography>
        <>
          {shouldDisplayProgress && (
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
          )}
          {renderTabContent()}
        </>
      </Box>
    </>
  );  
};

export default CategoryView;
