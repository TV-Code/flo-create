import React, { useState } from 'react';

const AllItemsContext = React.createContext();

export const AllItemsProvider = ({ children }) => {
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  
  const [currentJournal, setCurrentJournal] = useState(null);
  const [journals, setJournals] = useState([]);

  return (
    <AllItemsContext.Provider value={{
      currentTask, setCurrentTask, tasks, setTasks,
      currentNote, setCurrentNote, notes, setNotes,
      currentJournal, setCurrentJournal, journals, setJournals,
    }}>
      {children}
    </AllItemsContext.Provider>
  );
};

export default AllItemsContext;