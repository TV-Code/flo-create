import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CssBaseline, Typography, CircularProgress, IconButton, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import CategoryContext from './CategoryContext';
import { useSearch } from './SearchContext';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import SecondarySidebar from './SecondarySidebar';
import SearchBar from './SearchBar';
import CategoryView from './CategoryView';
import Journal from './Journal';
import Chat from './Chat';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFetchNotes, useFetchTasks } from './CustomHooks';

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
});

const App = () => {
  const [noteId, setNoteId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [notesUpdated, setNotesUpdated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem('selectedCategory') || null);
  const [activeTab, setActiveTab] = useState(0);
  const { searchTerm, setSearchTerm } = useSearch();
  const [loading, setLoading] = useState(false);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { loading: notesLoading, notes, fetchNotes } = useFetchNotes(selectedCategory, searchTerm);
  const { loading: tasksLoading, tasks, fetchTasks } = useFetchTasks(selectedCategory, searchTerm);



  useEffect(() => {
    console.log('Selected category in context provider:', selectedCategory);
    // Whenever selectedCategory changes, update the session storage
    sessionStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, [tasksUpdated, notesUpdated, selectedCategory, searchTerm]);

  useEffect(() => {
    let newFilteredNotes = [...notes];
    let newFilteredTasks = [...tasks];
  
    if (selectedCategory) {
      newFilteredNotes = newFilteredNotes.filter(note => note.category_id === selectedCategory);
      newFilteredTasks = newFilteredTasks.filter(task => task.category_id === selectedCategory);
    }
  
    if (activeTab === 0) {
      // Show both notes and tasks
    } else if (activeTab === 1) {
      // Show only notes
      newFilteredTasks = [];
    } else if (activeTab === 2) {
      // Show only tasks
      newFilteredNotes = [];
    }
  
    // add this to filter notes and tasks based on the searchTerm
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      newFilteredNotes = newFilteredNotes.filter(note => (note.title?.toLowerCase().includes(lowerCaseSearchTerm)) || (note.content?.toLowerCase().includes(lowerCaseSearchTerm)));
      newFilteredTasks = newFilteredTasks.filter(task => (task.title?.toLowerCase().includes(lowerCaseSearchTerm)) || (task.content?.toLowerCase().includes(lowerCaseSearchTerm)));
    }
  
    setFilteredNotes(newFilteredNotes);
    setFilteredTasks(newFilteredTasks);
  }, [notes, tasks, activeTab, selectedCategory, searchTerm]);



  const toggleSecondarySidebar = () => {
    setIsSecondarySidebarOpen(!isSecondarySidebarOpen);
  }

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, [setSearchTerm]);

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
    setTasksUpdated(!tasksUpdated); // Toggle tasksUpdated state to trigger re-fetching of tasks
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

    useEffect(() => {
      if (location.pathname === '/tasks') {
        setSelectedCategory(null);
      } else if (location.pathname === '/notes') {
        setSelectedCategory(null);
      }
    }, [location, setSelectedCategory]);

    return loading ? (
      <CircularProgress />
    ) : (
      <Routes>
        <Route path="/notes" element={<Box pt={4}><NoteList notes={filteredNotes} loading={loading} deleteNote={deleteNote} setCurrentNote={setCurrentNote} /></Box>} />
        <Route path="/notes/new" element={<Box pt={4}><NewNoteRoute /></Box>} />
        <Route path="/notes/:id" element={<Box pt={4}><EditNoteRoute /></Box>} />
        <Route path="/tasks" element={<Box pt={4}><TaskList tasks={filteredTasks} loading={loading} deleteTask={deleteTask} setCurrentTask={setCurrentTask} showProgressBar={true} /></Box>} />
        <Route path="/tasks/new" element={<Box pt={4}><NewTaskRoute /></Box>} />
        <Route path="/tasks/:id" element={<Box pt={4}><EditTaskRoute /></Box>} />
        <Route path="/category/:id" element={<CategoryView setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} filteredNotes={filteredNotes} filteredTasks={filteredTasks} />} />
        <Route path="/journal" element={<Box pt={4}><Journal /></Box>} />
        <Route path="/chat" element={<Box pt={4}><Chat /></Box>} />
      </Routes>
    )
  }

  const AppHeader = ({ toggleSecondarySidebar, handleSearch, searchTerm }) => (
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
        <MenuIcon />
      </IconButton>
      <Typography variant="h3" align="center" color="textPrimary" style={{ flexGrow: 1 }}>
        MindMap
      </Typography>
      <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
    </Box>
  );

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
