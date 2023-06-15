import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error(`Error fetching data: ${error}`);
            })
    }, []);

    return (
        <div>
            {tasks.map(task => (
                <div key={task.id}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                </div>
            ))}
        </div>
    );
}

export default TaskList;
