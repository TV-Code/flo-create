import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useFetchNotes = (selectedCategory, searchTerm) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const url = `http://127.0.0.1:5000/notes?category_id=${selectedCategory || ''}&search=${searchTerm || ''}`;
      const response = await axios.get(url);
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the note list: ${error}`);
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { loading, notes, fetchNotes };
};

export const useFetchTasks = (selectedCategory, searchTerm) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const url = `http://127.0.0.1:5000/tasks?category_id=${selectedCategory || ''}&search=${searchTerm || ''}`;
      const response = await axios.get(url);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the tasks: ${error}`);
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { loading, tasks, fetchTasks };
};

  