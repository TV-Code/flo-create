import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskCard from './TaskCard';

function TaskList({ tasks, loading, deleteTask, categoryColor, lightenedColor, showProgressBar }) {
  const [expandedTask, setExpandedTask] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (id) => {
    deleteTask(id);
  };

  const handleEdit = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const calculateTotalProgress = () => {
    const totalWeightedProgress = tasks.reduce((total, task) => total + (task.status * task.weight), 0);
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                categoryColor={categoryColor}
                lightenedColor={lightenedColor}
                expandedTask={expandedTask}
                setExpandedTask={setExpandedTask}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default TaskList;
