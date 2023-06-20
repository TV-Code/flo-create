import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CategoryView = () => {
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesResponse = await axios.get(`https://127.0.0.1/notes?category_id=${categoryId}`);
        const tasksResponse = await axios.get(`https://127.0.0.1/tasks?category_id=${categoryId}`);
        const progressResponse = await axios.get(`https://127.0.0.1/category/progress/${categoryId}`);

        setNotes(notesResponse.data);
        setTasks(tasksResponse.data);
        setProgress(progressResponse.data.progress);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <div>
      <h2>Notes in this Category</h2>
      {/* ...display notes here ... */}

      <h2>Tasks in this Category</h2>
      {/* ... display tasks here ... */}

      <h3>Progress</h3>
      <progress value={progress} max="100"></progress>

      {/* ... code for adding new notes/tasks ... */}
    </div>
  );
};

export default CategoryView;
