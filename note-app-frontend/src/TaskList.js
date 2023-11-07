import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box, CircularProgress, LinearProgress, Typography, Grid } from '@mui/material';
import { Masonry } from '@mui/lab';
import { useNavigate, useLocation } from 'react-router-dom';
import AllItemsContext from './AllItemsContext';
import TaskCard from './TaskCard';
import CompactTaskCard from './CompactTaskCard';

function TaskList({ tasks, loading, deleteTask, categoryColor, lightenedColor, showProgressBar, viewMode, getCategoryColor }) {
  const [ expandedTask, setExpandedTask ] = useState(null);
  const { currentTask, setCurrentTask } = useContext(AllItemsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (id) => {
    deleteTask(id);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    navigate(`/tasks/${task.id}`);
  };

  const calculateTotalProgress = () => {
    const totalWeightedProgress = tasks.reduce((total, task) => total + (task.progress * task.weight), 0);
    const totalPossibleWeight = tasks.reduce((total, task) => total + (100 * task.weight), 0);
    return totalPossibleWeight > 0 ? (totalWeightedProgress / totalPossibleWeight) * 100 : 0;
  };

  const totalProgress = useMemo(() => calculateTotalProgress(), [tasks]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {showProgressBar && (
            <>
              <LinearProgress
                variant="determinate"
                value={totalProgress}
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
                {`${Math.round(totalProgress)}% of total progress completed`}
              </Typography>
            </>
          )}
            <Masonry columns={3} spacing={2}>
            {tasks.map(task => (
              viewMode === 'regular' ? (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryColor={getCategoryColor}
                  categoryColor={categoryColor}
                  lightenedColor={lightenedColor}
                  expandedTask={expandedTask}
                  setExpandedTask={setExpandedTask}
                />
              ) : (
                <CompactTaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getCategoryColor={getCategoryColor}
                />
              )
            ))}
            </Masonry>
        </>
      )}
    </Box>
  );
}

export default TaskList;
