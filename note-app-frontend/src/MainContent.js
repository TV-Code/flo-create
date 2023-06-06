import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';

const MainContent = ({ addNote, updateNote, currentNote, setCurrentNote, notes, deleteNote }) => {
    return (
        <Routes>
            <Route
                path="/"
                exact
                render={() => <NoteList notes={notes} deleteNote={deleteNote} setCurrentNote={setCurrentNote} />}
            />
            <Route
                path="/edit/:id"
                render={() => <NoteForm updateNote={updateNote} currentNote={currentNote} setCurrentNote={setCurrentNote} />}
            />
            <Route
                path="/add"
                render={() => <NoteForm addNote={addNote} currentNote={currentNote} setCurrentNote={setCurrentNote} />}
            />
        </Routes>
    );
};

export default MainContent;
