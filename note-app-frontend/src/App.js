import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { CssBaseline, Typography, CircularProgress, IconButton, Box, Container, Menu } from '@mui/material';
import MenuOpen from '@mui/icons-material/MenuOpen';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import CategoryContext from './CategoryContext';
import { useSearch } from './SearchContext';
import NoteList from './NoteList';
import NoteForm from './NoteForm';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import JournalList from './JournalList';
import JournalForm from './JournalForm';
import Sidebar from './Sidebar';
import SecondarySidebar from './SecondarySidebar';
import SearchBar from './SearchBar';
import SortFilter from './SortFilter';
import CategoryView from './CategoryView';
import Chat from './Chat';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFetchNotes, useFetchTasks, useFetchJournals } from './CustomHooks';

const theme = createTheme({
  typography: {
    fontFamily: 'Lora, serif',
  },
  palette: {
    primary: {
      main: '#f25042',
    },
    secondary: {
      main: '#8c7851',
    },
    background: {
      default: '#f9f4ef'
    }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px" // Optional: Modify the outline width if needed
          },
        },
      },
    },
  },
});

const App = () => {
  const [noteId, setNoteId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [journalId, setJournalId] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem('selectedCategory') || null);
  const { searchTerm, setSearchTerm } = useSearch();
  const [sortCriteria, setSortCriteria] = useState('default');
  const [loading, setLoading] = useState(false);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
  const { loading: notesLoading, notes, fetchNotes } = useFetchNotes(selectedCategory, searchTerm, sortCriteria);
  const { loading: tasksLoading, tasks, fetchTasks } = useFetchTasks(selectedCategory, searchTerm, sortCriteria);
  const { loading: journalsLoading, journals, fetchJournals } = useFetchJournals(selectedCategory, searchTerm, sortCriteria);
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = sessionStorage.getItem('activeTab');
    return storedTab !== null ? Number(storedTab) : 3;
  });
  
  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchNotes();
    fetchTasks();
    fetchJournals();
  }, [selectedCategory, searchTerm, sortCriteria]);

  const toggleSecondarySidebar = () => {
    setIsSecondarySidebarOpen(!isSecondarySidebarOpen);
  }

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, [setSearchTerm]);  

  const deleteItem = async (id, type) => {
    switch (type) {
      case 'note':
        deleteNote(id);
        break;
      case 'task':
        deleteTask(id);
        break;
      case 'journal':
        deleteJournal(id);
        break;
      default:
        console.error('Invalid item type');
    }
  };

  const fetchNote = useCallback(async (id) => {
    setLoading(true);
    setNoteId(id);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/notes/${id}`);
      setCurrentNote(response.data);
    } catch (error) {
      console.error(`There was an error retrieving the note: ${error}`);
      setCurrentNote(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const addNote = async (note, category_id = null) => {
    setLoading(true);  
    note.category_id = category_id; // If category_id is not provided, it will be set to null
    try {
      const response = await axios.post('http://127.0.0.1:5000/notes', note);
      fetchNotes([...notes, response.data.data]);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };  
    

  const updateNote = async (updatedNote) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/notes/${updatedNote.id}`, updatedNote);
      fetchNotes(notes.map(note => (note.id === response.data.data.id ? response.data.data : note)));
    } catch (error) {
      console.error('There was an error!', error);
    }
    setLoading(false);
  };  

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/notes/${id}`);
      fetchNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error(`There was an error deleting the note: ${error}`);
    }
    setLoading(false);
  };

  const EditNoteRoute = () => {
    const { id } = useParams();
  
    useEffect(() => {
      if (id !== noteId) {
        fetchNote(id);
      }
    }, [id]);
  
    return loading ? (
      <CircularProgress />
    ) : (
      <NoteForm
        updateNote={updateNote}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        action='edit'
      />
    );
  };
  
  const NewNoteRoute = () => {
    const location = useLocation();
    const categoryFromPreviousPage = location.state?.selectedCategory ?? selectedCategory;
  
    const handleAddNote = async (note, category_id) => {
        await addNote(note, category_id);
        fetchNotes();
    }
  
    return (
        <NoteForm
            addNote={handleAddNote}
            currentNote={currentNote}
            setCurrentNote={setCurrentNote}
            action='new'
            selectedCategory={categoryFromPreviousPage}
        />
    );
  };

  useEffect(() => {
    let isMounted = true; // add this flag to prevent setting state on unmounted component
    fetchTasks().then((data) => {
      if (isMounted) fetchTasks(data);
    });
    return () => { isMounted = false }; // cleanup function
  }, [fetchTasks]);

  const fetchTask = useCallback(async (id) => {
    setLoading(true);
    setTaskId(id); 
    try {
      const response = await axios.get(`http://127.0.0.1:5000/tasks/${id}`);
      setCurrentTask(response.data);
    } catch (error) {
      console.error(`There was an error retrieving the task: ${error}`);
      setCurrentTask(null);
    } finally {
        setLoading(false);
    }
  }, []);


  const addTask = async (task, category_id = null) => {
    setLoading(true);  
    task.category_id = category_id; // If category_id is not provided, it will be set to null
    console.log("Adding task:", task);
    try {
      const response = await axios.post('http://127.0.0.1:5000/tasks', task);
      console.log("Response data:", response.data.data);
      const newTask = {...task, id: response.data.data};  // Combine the posted task object with the returned task id
      fetchTasks([...tasks, newTask]);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };



  const updateTask = async (updatedTask) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/tasks/${updatedTask.id}`, updatedTask);
      fetchTasks(tasks.map(task => (task.id === response.data.data.id ? response.data.data : task)));
    } catch (error) {
      console.error('There was an error!', error);
    }
    setLoading(false);
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/tasks/${id}`);
      fetchTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(`There was an error deleting the note: ${error}`);
    }
    setLoading(false);
  };

  const NewTaskRoute = () => {
    const location = useLocation();
    const categoryFromPreviousPage = location.state?.selectedCategory ?? selectedCategory;

    const handleAddTask = async (task, category_id) => {
        await addTask(task, category_id);
        fetchTasks();
    }

    return (
        <TaskForm
            addTask={handleAddTask}
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            action='new'
            selectedCategory={categoryFromPreviousPage}
        />
    );
  };

  const EditTaskRoute = () => {
    const { id } = useParams();
  
    useEffect(() => {
      if (id !== taskId) {
        fetchTask(id);
      }
    }, [id]);
    
    useEffect(() => {
      if (currentTask && tasks.length) {
        const matchingTask = tasks.find(task => task.id === currentTask.id);
        if (!matchingTask || matchingTask !== currentTask) {
          setCurrentTask(matchingTask);
        }
      }
    }, [tasks, currentTask]);
    

    return loading ? (
      <CircularProgress />
    ) : (
      <TaskForm
        updateTask={updateTask}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        action='edit'
      />
    );
  };
    
  const fetchJournal = useCallback(async (id) => {
    setLoading(true);
    setJournalId(id);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/journal_entries/${id}`);
      setCurrentJournal(response.data);
    } catch (error) {
      console.error(`There was an error retrieving the journal: ${error}`);
      setCurrentJournal(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const addJournal = async (journal, category_id = null) => {
      setLoading(true);  
      journal.category_id = category_id; // If category_id is not provided, it will be set to null
      try {
        const response = await axios.post('http://127.0.0.1:5000/journal_entries', journal);
        fetchJournals([...journals, response.data.data]);
      } catch (error) {
        console.error('There was an error!', error);
      } finally {
        setLoading(false);
      }
  };  

  const updateJournal = async (updatedJournal) => {
      setLoading(true);
      try {
        const response = await axios.put(`http://127.0.0.1:5000/journal_entries/${updatedJournal.id}`, updatedJournal);
        fetchJournals(journals.map(journal => (journal.id === response.data.data.id ? response.data.data : journal)));
      } catch (error) {
        console.error('There was an error!', error);
      }
      setLoading(false);
  }; 

  const deleteJournal = async (id) => {
      setLoading(true);
      try {
        await axios.delete(`http://127.0.0.1:5000/journal_entries/${id}`);
        fetchJournals(journals.filter(journal => journal.id !== id));
      } catch (error) {
        console.error(`There was an error deleting the journal: ${error}`);
      }
      setLoading(false);
  };

  const NewJournalRoute = () => {
    const location = useLocation();
    const categoryFromPreviousPage = location.state?.selectedCategory ?? selectedCategory;
    
    const handleAddJournal = async (journal, category_id) => {
        await addJournal(journal, category_id);
        fetchJournals();
    }
    
    return (
      <JournalForm 
          key={currentJournal ? currentJournal.id : 'new'} 
          currentJournal={currentJournal}
          setCurrentJournal={setCurrentJournal} 
          addJournal={handleAddJournal} 
          updateJournal={updateJournal} 
          deleteJournal={deleteJournal} 
          action='new'
      />
  
      );
  };

  const EditJournalRoute = () => {
    const { id } = useParams();
  
    useEffect(() => {
      if (id !== journalId) {
        fetchJournal(id);
      }
    }, [id]);
    
    useEffect(() => {
      if (currentJournal && journals.length) {
        const matchingJournal = journals.find(journal => journal.id === currentJournal.id);
        if (!matchingJournal || matchingJournal !== currentJournal) {
          setCurrentJournal(matchingJournal);
        }
      }
    }, [journals, currentJournal]);

    return loading ? (
      <CircularProgress />
    ) : (
      <JournalForm
        updateJournal={updateJournal}
        currentJournal={currentJournal}
        setCurrentJournal={setCurrentJournal}
        action='edit'
      />
    );
  };
    
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const renderSecondarySidebar = () => {
    const currentPath = window.location.pathname;
    return (
      <div className="App">
            <SecondarySidebar 
              isDrawerOpen={isSecondarySidebarOpen} 
              toggleDrawer={toggleSecondarySidebar} 
              onCategorySelect={handleCategorySelect}
             />
           </div>
      );
    };

  const MainRoutes = () => {
    const location = useLocation();
    const prevPath = useRef(location.pathname);

    useEffect(() => {
      if (['/tasks', '/notes', '/journals'].includes(location.pathname)) {
        setSelectedCategory(null);
        setActiveTab(3);
      }
    }, [location, setSelectedCategory, setActiveTab]);    

    useEffect(() => {
      if (prevPath.current !== location.pathname) {
        if (['/tasks', '/notes', '/journals'].includes(location.pathname) || location.pathname.startsWith('/category')) {
          setSearchTerm('');
          setSortCriteria('default');
        }
        prevPath.current = location.pathname;
      }
    }, [location.pathname]);

    return loading ? (
      <CircularProgress />
    ) : (
      <Routes>
        <Route path="/notes" element={<Box pt={4}><NoteList notes={notes} loading={loading} deleteNote={deleteNote} setCurrentNote={setCurrentNote} /></Box>} />
        <Route path="/notes/new" element={<Box pt={4}><NewNoteRoute /></Box>} />
        <Route path="/notes/:id" element={<Box pt={4}><EditNoteRoute /></Box>} />
        <Route path="/tasks" element={<Box pt={4}><TaskList tasks={tasks} loading={loading} deleteTask={deleteTask} setCurrentTask={setCurrentTask} showProgressBar={true} /></Box>} />
        <Route path="/tasks/new" element={<Box pt={4}><NewTaskRoute /></Box>} />
        <Route path="/tasks/:id" element={<Box pt={4}><EditTaskRoute /></Box>} />
        <Route path="/journals" element={<Box pt={4}><JournalList journals={journals} loading={loading} deleteJournal={deleteJournal} setCurrentJournal={setCurrentJournal} /></Box>} />
        <Route path="/journals/new" element={<Box pt={4}><NewJournalRoute /></Box>} />
        <Route path="/journals/:id" element={<Box pt={4}><EditJournalRoute /></Box>} />
        <Route path="/category/:id" element={<CategoryView activeTab={activeTab} setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} notes={notes} tasks={tasks} journals={journals} sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} deleteItem={deleteItem} />} />
        <Route path="/chat" element={<Box pt={4}><Chat /></Box>} />
      </Routes>
    )
  }

  const AppHeader = ({ toggleSecondarySidebar, handleSearch, searchTerm, activeTab }) => {
    const prevTabRef = useRef();
    const prevSearchTermRef = useRef();

    useEffect(() => {
      if (prevTabRef.current !== activeTab && prevSearchTermRef.current === searchTerm) {
        // The tab has changed. Reset the search term.
        handleSearch({ target: { value: '' } });
      }
      // Store current tab for the next render
      prevTabRef.current = activeTab;
      prevSearchTermRef.current = searchTerm;
    }, [activeTab, searchTerm]);

    return (
      <Box 
        component="header" 
        position="sticky" 
        top={0} 
        left={0}
        right={0} 
        height={80}
        display="flex" 
        alignItems="center" 
        px={2} 
        bgcolor="#eaddcf"
        boxShadow={1}
        zIndex={999} // This will keep the header on top of other content
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={(event) => { event.stopPropagation(); toggleSecondarySidebar(); }}
        >
          <MenuOpen />
        </IconButton>
        <Typography variant="h3" align="center" color="textPrimary" style={{ flexGrow: 1 }}>
          Inkwell
        </Typography>
        <SortFilter activeTab={activeTab} sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
        <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
      </Box>
    );
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" height="100vh">
          <Box width={200} borderRight={1} borderColor="divider">
            <Sidebar />
          </Box>
          <Box flex={1} overflow="auto">
          <AppHeader 
            toggleSecondarySidebar={toggleSecondarySidebar}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            activeTab={activeTab}
          />
            {renderSecondarySidebar()}
            <Container>
              <MainRoutes />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  </CategoryContext.Provider>
  );
};


export default App;
