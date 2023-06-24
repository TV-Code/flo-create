import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Typography, CircularProgress, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import CategoryContext from './CategoryContext';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Sidebar from './Sidebar';
import Tasks from './Tasks';
import TaskForm from './TaskForm';
import SecondarySidebar from './SecondarySidebar';
import CategoryView from './CategoryView';
import Header from './Header';
import Journal from './Journal';
import Chat from './Chat';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f9CB08',
    },
    secondary: {
      main: '#fbeec1',
    },
  },
});

const App = () => {
  const [noteId, setNoteId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [notes, setNotes] = useState([]);  
  const [tasks, setTasks] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  const toggleSecondarySidebar = () => {
    setIsSecondarySidebarOpen(!isSecondarySidebarOpen);
  }
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/notes');
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the note list: ${error}`);
      setLoading(false);
    }
  };


  const fetchNote = async (id) => {
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
  };

  const addNote = async (note, category_id = null) => {
    setLoading(true);  
    note.category_id = category_id; // If category_id is not provided, it will be set to null
    try {
      const response = await axios.post('http://127.0.0.1:5000/notes', note);
      setNotes([...notes, response.data.data]);
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
      setNotes(notes.map(note => (note.id === response.data.data.id ? response.data.data : note)));
    } catch (error) {
      console.error('There was an error!', error);
    }
    setLoading(false);
  };  

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
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
    return (
      <NoteForm
        addNote={addNote}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        action='new'
        selectedCategory={selectedCategory}
      />
    );
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the tasks: ${error}`);
      setLoading(false);
    }
  };

  const fetchTask = async (id) => {
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
};


const addTask = async (task, category_id = null) => {
  setLoading(true);  
  task.category_id = category_id; // If category_id is not provided, it will be set to null
  try {
    const response = await axios.post('http://127.0.0.1:5000/tasks', task);
    setTasks([...tasks, response.data.data]);
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
      setTasks(tasks.map(task => (task.id === response.data.data.id ? response.data.data : task)));
    } catch (error) {
      console.error('There was an error!', error);
    }
    setLoading(false);
};

  const NewTaskRoute = () => {
    return (
      <TaskForm
        addTask={addTask}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
        action='new'
        selectedCategory={selectedCategory}
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
  
  const renderSecondarySidebar = () => {
    const currentPath = window.location.pathname;
    return (
      <div className="App">
            <SecondarySidebar 
              isDrawerOpen={isSecondarySidebarOpen} 
              toggleDrawer={toggleSecondarySidebar} 
             />
           </div>
      );
    };

  const MainRoutes = () => {
    const location = useLocation();

    return (
      <Routes>
        <Route path="/notes" element={<NoteList notes={notes} loading={loading} deleteNote={deleteNote} setCurrentNote={setCurrentNote} />} />
        <Route path="/notes/new" element={<NoteForm action="new" addNote={addNote} currentCategory={selectedCategory} />} />
        <Route path="/notes/:id" element={<EditNoteRoute />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} />} />
        <Route path="/tasks/new" element={<TaskForm action="new" addTask={addTask} currentCategory={selectedCategory} />} />
        <Route path="/tasks/:id" element={<EditTaskRoute />} />
        <Route path="/category/:id" element={<CategoryView setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    )
  }

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Sidebar />
            </div>
            <div style={{ flexGrow: 1, overflow: 'hidden', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleSecondarySidebar}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h3" align="center" color="textPrimary" style={{ flexGrow: 1 }}>
                  MindMap
                </Typography>
                <Header 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange} 
                  searchTerm={searchTerm} 
                  onSearch={handleSearch} 
                />
              </div>
              {renderSecondarySidebar()}
              <MainRoutes />
            </div>
          </div>
        </ThemeProvider>
      </Router>
      </CategoryContext.Provider>
  );
};


export default App;
