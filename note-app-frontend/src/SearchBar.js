import React, { useEffect, useRef, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from './SearchContext'; // import the useSearch hook

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch(); // use the hook to get searchTerm and setSearchTerm
  const inputRef = useRef(null); // create a ref for the input element

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // focus the input field whenever searchTerm changes
    }
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      label="Search"
      variant="standard"
      value={searchTerm}
      onChange={handleSearch}
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      inputRef={inputRef} // attach the ref to the input element
    />
  );
};

export default SearchBar;
