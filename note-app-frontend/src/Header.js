import { Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';

function Header({ activeTab, onTabChange, searchTerm, onSearch }) {
    const location = useLocation();

    const showHeader = !location.pathname.includes('/notes/') && !location.pathname.includes('/tasks/');

    if(!showHeader) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tabs value={activeTab} onChange={onTabChange}>
                <Tab label="Notes" />
                <Tab label="Tasks" />
            </Tabs>
            <TextField
                label="Search"
                variant="standard"
                value={searchTerm}
                onChange={onSearch}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}

export default Header;
