import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';

const MainContent = ({ addNote, updateNote, currentNote, setCurrentNote, notes, deleteNote }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const note = notes.find((note) => note.id === id);
            setCurrentNote(note);
        }
    }, [id, notes, setCurrentNote]);

    return (
        <>
            {id ? (
                <NoteForm 
                    updateNote={updateNote} 
                    currentNote={currentNote} 
                    setCurrentNote={setCurrentNote}
                    navigate={navigate} 
                />
            ) : (
                <>
                    <button onClick={() => navigate('/notes/new')}>Add Note</button>
                    <NoteList 
                        notes={notes} 
                        deleteNote={deleteNote} 
                        setCurrentNote={setCurrentNote} 
                        navigate={navigate}
                    />
                </>
            )}
        </>
    );
};

export default MainContent;
