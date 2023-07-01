import React, { useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from './SearchContext';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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
      inputRef={inputRef}
    />
  );
};

export default React.memo(SearchBar);
