import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
} from '@mui/material';
import { CirclePicker } from 'react-color';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useTheme } from '@emotion/react';

function SecondarySidebar({ isDrawerOpen, toggleDrawer, onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isCirclePickerVisible, setIsCirclePickerVisible] = useState(false);
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [newCategoryColor, setNewCategoryColor] = useState('#f25042');
  const [editedCategoryColor, setEditedCategoryColor] = useState('#f25042');
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const circlePickerRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/categories')
      .then((response) => {
        setCategories(response.data);
        console.log('Fetched categories:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories', error);
      });
  }, []);

  useEffect(() => {
    const clickOutsideListener = (event) => {
      if (
        circlePickerRef.current &&
        !circlePickerRef.current.contains(event.target) &&
        event.target !== document.getElementById('newCategoryTextField')
      ) {
        setIsCirclePickerVisible(false);
      }
    };

    document.addEventListener('mousedown', clickOutsideListener);

    return () => {
      document.removeEventListener('mousedown', clickOutsideListener);
    };
  }, []);

  const handleCategorySelect = (event, category) => {
    event.stopPropagation();
    onCategorySelect(category);
    toggleDrawer(false);
    navigate(`/category/${category.id}`);
  };

  const handleOnDragStart = () => {
    setIsDragging(true);
  };

  const handleOnDragEnd = (result) => {
    setIsDragging(false);

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
        color: newCategoryColor,
      };
      axios
        .post('http://127.0.0.1:5000/categories', categoryData)
        .then((response) => {
          console.log('Newly added category:', response.data.data);
          setCategories([...categories, response.data.data]);
          setNewCategory('');
          setIsCirclePickerVisible(false); // close color picker after adding category
        })
        .catch((error) => {
          console.error('Error adding category', error);
        });
    }
    setNewCategoryColor('#f25042');
  };

  const handleEditCategory = (event, categoryId) => {
    event.stopPropagation();
    const category = categories.find((category) => category.id === categoryId);
    if (category) {
      setEditedCategoryName(category.name);
      setEditedCategoryColor(category.color || '#ffffff');
    }
    setEditMode(categoryId);
  };

  const handleDeleteCategory = (event, categoryId) => {
    event.stopPropagation();
    axios
      .delete(`http://127.0.0.1:5000/categories/${categoryId}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== categoryId));
      })
      .catch((error) => {
        console.error('Error deleting category', error);
      });
  };

  const handleCategoryChange = (event, categoryId) => {
    event.stopPropagation();
    axios
      .put(`http://127.0.0.1:5000/categories/${categoryId}`, {
        name: editedCategoryName,
        color: editedCategoryColor,
      })
      .then((response) => {
        const updatedCategories = categories.map((category) =>
          category.id === categoryId ? response.data.data : category
        );
        setCategories(updatedCategories);
        setEditMode(null);
      })
      .catch((error) => {
        console.error('Error updating category', error);
      });
  };

  const handleColorPickerButton = () => {
    setIsCirclePickerVisible(prevState => !prevState);
  };


  return (
    <div>
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => {toggleDrawer(false); setNewCategoryColor('#f25042');}}>
        <div style={{ padding: '10px', height: '100%', width: 200, backgroundColor: theme.palette.background.paper }}>
          <TextField
            label="Search"
            variant="standard"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: theme.palette.text.primary }}/>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="newCategoryTextField"
            label="New Category"
            variant="standard"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            autoComplete="off"
          />
          <div ref={circlePickerRef}>
          <IconButton color="primary" onClick={handleAddCategory} id="addButton">
            <AddIcon style={{ color: theme.palette.text.primary }}/>
          </IconButton>
          <IconButton color="primary" onClick={handleColorPickerButton} id="colorPickerButton">
            <div
                style={{
                width: '20px',
                height: '20px',
                backgroundColor: newCategoryColor,
                borderRadius: '50%',
                marginRight: '10px',
                }}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path
                fillRule="evenodd"
                d="M8 10.34L4.787 7.127a.25.25 0 01.354-.354L8 9.646l2.859-2.873a.25.25 0 01.354.354L8 10.34z"
                />
            </svg>
            </IconButton>
            {isCirclePickerVisible && (
              <CirclePicker
                className="createCirclePicker"
                color={newCategoryColor}
                onChangeComplete={(color) => {
                    setNewCategoryColor(color.hex);
                    setIsCirclePickerVisible(false);
                }}
              />
            )}
          </div>
           {categories ? (
            <DragDropContext onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="categories">
                {(provided) => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                    {categories
                        .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((category, index) => (
                        <Draggable key={category.id} draggableId={category.id} index={index}>
                            {(provided) => (
                            <ListItem
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                button
                                onClick={(event) => handleCategorySelect(event, category)}
                            >
                                <Grid container direction="column">
                                <Grid item xs={12}>
                                    <div
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: category.color,
                                        marginRight: '10px',
                                    }}
                                    />
                                    {editMode === category.id ? (
                                    <Grid container>
                                        <Grid item xs={7.5}>
                                        <TextField
                                            value={editedCategoryName}
                                            onChange={(e) => setEditedCategoryName(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoComplete="off"
                                        />
                                        </Grid>
                                        <div onClick={(e) => e.stopPropagation()}>
                                        <CirclePicker
                                            className="editCirclePicker"
                                            color={editedCategoryColor}
                                            onChangeComplete={(color) => setEditedCategoryColor(color.hex)}
                                        />
                                        </div>
                                    </Grid>
                                    ) : (
                                    <ListItemText primary={category.name} />
                                    )}
                                </Grid>
                                <Grid item xs={6}>
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <IconButton edge="end" onClick={(event) => handleEditCategory(event, category.id)} disabled={isDragging}>
                                        <EditIcon />
                                    </IconButton>
                                    {editMode === category.id && (
                                        <IconButton
                                        edge="end"
                                        onClick={(event) => handleCategoryChange(event, category.id)}
                                        disabled={isDragging}
                                        >
                                        <SaveIcon />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        edge="end"
                                        onClick={(event) => handleDeleteCategory(event, category.id)}
                                        disabled={isDragging}
                                    >
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
           ) : (
               <div>Loading...</div>
           )}
        </div>
      </Drawer>
    </div>
  );
}

export default SecondarySidebar;
