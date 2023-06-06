import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div>
            <Link to="/">Home</Link>
            <Link to="/add">Add Note</Link>
        </div>
    );
};

export default Sidebar;
