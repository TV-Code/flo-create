import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
    Drawer, List, ListItem, ListItemText,
    TextField, IconButton, InputAdornment
} from '@mui/material';
import { CirclePicker } from 'react-color';
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import CategoryView from './CategoryView';

function SecondarySidebar({ isDrawerOpen, toggleDrawer, onCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCirclePickerVisible, setIsCirclePickerVisible] = useState(false);
    const [newCategoryColor, setNewCategoryColor] = useState('#ffffff');
    const [editedCategoryColor, setEditedCategoryColor] = useState('#ffffff');
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const circlePickerRef = useRef(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/categories')
            .then(response => {
                setCategories(response.data);
                console.log('Fetched categories:', response.data);
            })
            .catch(error => {
                console.error('Error fetching categories', error);
            });
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        toggleDrawer(false);
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCategories(items);
        //TODO: Update your backend about the new order of categories here.
    };

    const handleAddCategory = () => {
        if (newCategory.trim() !== '') {
            const categoryData = { 
                name: newCategory, 
                color: newCategoryColor 
            };
            axios
                .post('http://127.0.0.1:5000/categories', categoryData)
                .then(response => {
                    console.log('Newly added category:', response.data.data);
                    setCategories([...categories, response.data.data]);
                    setNewCategory('');
                })
                .catch(error => {
                    console.error('Error adding category', error);
                });
        }
    };

    const handleEditCategory = (categoryId) => {
        const category = categories.find(category => category.id === categoryId);
        if (category) {
            setEditedCategoryName(category.name);
            setEditedCategoryColor(category.color || '#ffffff');
        }
        setEditMode(categoryId);
    };
        

    const handleDeleteCategory = (categoryId) => {
        axios.delete(`http://127.0.0.1:5000/categories/${categoryId}`)
            .then(() => {
                setCategories(categories.filter(category => category.id !== categoryId));
            })
            .catch(error => {
                console.error('Error deleting category', error);
            });
    };

    const handleCategoryChange = (categoryId) => {
        axios.put(`http://127.0.0.1:5000/categories/${categoryId}`, { 
            name: editedCategoryName, 
            color: editedCategoryColor
        })
            .then(response => {
                const updatedCategories = categories.map(category =>
                    category.id === categoryId ? response.data.data : category
                );
                setCategories(updatedCategories);
                setEditMode(null);
            })
            .catch(error => {
                console.error('Error updating category', error);
            });
    };

    return (
        <div>
            <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                <div style={{ padding: '10px', width: 200 }}>
                <TextField
                    label="Search"
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <SearchIcon />
                        </InputAdornment>
                        ),
                    }}
                    />
                    <TextField
                        label="New Category"
                        variant="standard"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onFocus={() => setIsCirclePickerVisible(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                if (document.activeElement !== circlePickerRef.current &&
                                    !circlePickerRef.current.contains(document.activeElement)) {
                                    setIsCirclePickerVisible(false);
                                }
                            }, 100);
                        }}
                        fullWidth
                    />
                    <div ref={circlePickerRef}>
                        {isCirclePickerVisible && newCategoryColor && (
                            <CirclePicker
                                className='createCirclePicker'
                                color={newCategoryColor}
                                onChangeComplete={(color) => setNewCategoryColor(color.hex)}
                            />
                        )}
                    </div>
                    <IconButton color="primary" onClick={handleAddCategory}>
                        <AddIcon />
                    </IconButton>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <List {...provided.droppableProps} ref={provided.innerRef}>
                                    {categories
                                    .filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((category, index) => (
                                        <Draggable key={category.id} draggableId={category.id} index={index}>
                                            {(provided) => (
                                                <ListItem
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    button
                                                    onClick={() => handleCategorySelect(category)}
                                                >
                                                {selectedCategory && <CategoryView category={selectedCategory} />}
                                                    <Grid container direction="column">
                                                        <Grid item xs={12}>
                                                            <div style={{ 
                                                                width: "10px", 
                                                                height: "10px", 
                                                                backgroundColor: category.color, 
                                                                marginRight: "10px" 
                                                            }} />
                                                            {editMode === category.id ? (
                                                                <Grid container>
                                                                    <Grid item xs={7.5}>
                                                                    <TextField
                                                                        value={editedCategoryName}
                                                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                                                    />
                                                                    </Grid>
                                                                    <CirclePicker
                                                                        className='editCirclePicker'
                                                                        color={editedCategoryColor}
                                                                        onChangeComplete={(color) => setEditedCategoryColor(color.hex)}
                                                                    />
                                                                </Grid>
                                                            ) : (
                                                                <ListItemText primary={category.name} />
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                                                <IconButton edge="end" onClick={() => handleEditCategory(category.id)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                                {editMode === category.id && (
                                                                    <IconButton edge="end" onClick={() => handleCategoryChange(category.id)}>
                                                                        <SaveIcon />
                                                                    </IconButton>
                                                                )}
                                                                <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </Drawer>
        </div>
    );
}

export default SecondarySidebar;
