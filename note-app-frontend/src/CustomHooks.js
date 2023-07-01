import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const sortMixedData = (data, criteria) => {
    let sortedData;
    switch (criteria) {
      case 'alpha_asc':
        sortedData = [...data].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha_desc':
        sortedData = [...data].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date_asc':
        sortedData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date_desc':
        sortedData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        sortedData = data;
        break;
    }
    return sortedData;
  };  

const sortData = (data, criteria) => {
    let sortedData;
    switch (criteria) {
      case 'progress_desc':
        sortedData = [...data].sort((a, b) => b.progress - a.progress);
        break;
      case 'progress_asc':
        sortedData = [...data].sort((a, b) => a.progress - b.progress);
        break;
      case 'weight_desc':
        sortedData = [...data].sort((a, b) => b.weight - a.weight);
        break;
      case 'weight_asc':
        sortedData = [...data].sort((a, b) => a.weight - b.weight);
        break;
      case 'alpha_asc':
        sortedData = [...data].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha_desc':
        sortedData = [...data].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date_asc':
        sortedData = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date_desc':
        sortedData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'not_started':
        sortedData = data.filter(task => task.status === 'Not Started');
        break;
      case 'in_progress':
        sortedData = data.filter(task => task.status === 'In Progress');
        break;
      case 'completed':
        sortedData = data.filter(task => task.status === 'Completed');
      break;
      default:
        sortedData = data;
        break;
    }
    return sortedData;
  };
  
    export const useFetchNotes = (selectedCategory, searchTerm, sortCriteria, apiType) => {
        const [loading, setLoading] = useState(false);
        const [notes, setNotes] = useState([]);
    
        const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const url = `http://127.0.0.1:5000/notes?category_id=${selectedCategory || ''}&search=${searchTerm || ''}`;
            const response = await axios.get(url);
            const sortedNotes = sortData(response.data, sortCriteria);
            setNotes(sortedNotes);
            setLoading(false);
        } catch (error) {
            console.error(`There was an error retrieving the note list: ${error}`);
            setLoading(false);
        }
        }, [selectedCategory, searchTerm, sortCriteria]);
    
        useEffect(() => {
            if (apiType === 'notes' || apiType === 'all') {
              fetchNotes();
            }
          }, [fetchNotes, apiType]);

        return { loading, notes, fetchNotes };
    };

    export const useFetchTasks = (selectedCategory, searchTerm, sortCriteria, apiType) => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
        const url = `http://127.0.0.1:5000/tasks?category_id=${selectedCategory || ''}&search=${searchTerm || ''}`;
        const response = await axios.get(url);
        const sortedTasks = sortData(response.data, sortCriteria);
        setTasks(sortedTasks);
        setLoading(false);
        } catch (error) {
        console.error(`There was an error retrieving the tasks: ${error}`);
        setLoading(false);
        }
    }, [selectedCategory, searchTerm, sortCriteria]);

    useEffect(() => {
    if (apiType === 'tasks' || apiType === 'all') {
      fetchTasks();
    }
  }, [fetchTasks, apiType]); 

    return { loading, tasks, fetchTasks };
    };

    export const useFetchJournals = (selectedCategory, searchTerm, sortCriteria, apiType) => {
        const [loading, setLoading] = useState(false);
        const [journals, setJournals] = useState([]);
    
        const fetchJournals = useCallback(async () => {
        setLoading(true);
        try {
            const url = `http://127.0.0.1:5000/journal_entries?category_id=${selectedCategory || ''}&search=${searchTerm || ''}`;
            const response = await axios.get(url);
            const sortedJournals = sortData(response.data, sortCriteria);
            setJournals(sortedJournals);
            setLoading(false);
        } catch (error) {
            console.error(`There was an error retrieving the tasks: ${error}`);
            setLoading(false);
        }
        }, [selectedCategory, searchTerm, sortCriteria]);
    
        useEffect(() => {
            if (apiType === 'journals' || apiType === 'all') {
              fetchJournals();
            }
          }, [fetchJournals, apiType]);
    
        return { loading, journals, fetchJournals };
    };

  