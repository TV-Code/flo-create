import { createContext } from 'react';

const CategoryContext = createContext({
    selectedCategory: null, // selectedCategory now contains whole category object
    setSelectedCategory: () => {},
  });

export default CategoryContext;
