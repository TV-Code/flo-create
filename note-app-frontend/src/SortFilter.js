import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

const SortFilter = ({ sortCriteria, setSortCriteria, activeTab }) => {
  const location = useLocation();
  const isTasksRoute = location.pathname === '/tasks';
  const handleChange = (event) => {
    setSortCriteria(event.target.value);
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 5 }}>
      <InputLabel id="sort-criteria-select-label">Sort By</InputLabel>
      {activeTab === 1 || isTasksRoute ? (
        <Select
          labelId="sort-criteria-select-label"
          id="sort-criteria-select"
          value={sortCriteria}
          onChange={handleChange}
          label="Sort By"
        >
          <MenuItem value={'default'}>Default</MenuItem>
          <MenuItem value={'alpha_asc'}>Alphabetical - A to Z</MenuItem>
          <MenuItem value={'alpha_desc'}>Alphabetical - Z to A</MenuItem>
          <MenuItem value={'date_asc'}>Date - Oldest to Newest</MenuItem>
          <MenuItem value={'date_desc'}>Date - Newest to Oldest</MenuItem>
          <MenuItem value={'progress_desc'}>Progress - High to Low</MenuItem>
          <MenuItem value={'progress_asc'}>Progress - Low to High</MenuItem>
          <MenuItem value={'weight_desc'}>Weight - High to Low</MenuItem>
          <MenuItem value={'weight_asc'}>Weight - Low to High</MenuItem>
          <MenuItem value={'incomplete'}>Incomplete</MenuItem>
          <MenuItem value={'completed'}>Completed</MenuItem>
        </Select>
      ) : (
        <Select
          labelId="sort-criteria-select-label"
          id="sort-criteria-select"
          value={sortCriteria}
          onChange={handleChange}
          label="Sort By"
        >
          <MenuItem value={'default'}>Default</MenuItem>
          <MenuItem value={'alpha_asc'}>Alphabetical - A to Z</MenuItem>
          <MenuItem value={'alpha_desc'}>Alphabetical - Z to A</MenuItem>
          <MenuItem value={'date_asc'}>Date - Oldest to Newest</MenuItem>
          <MenuItem value={'date_desc'}>Date - Newest to Oldest</MenuItem>
        </Select>
      )}
    </FormControl>
  );
};

export default SortFilter;
