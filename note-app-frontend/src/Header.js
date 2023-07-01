import { Tabs, Tab } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Header = ({ activeTab, onTabChange }) => {
    const location = useLocation();
    const showHeader = !location.pathname.includes('/notes') && !location.pathname.includes('/tasks') && !location.pathname.includes('/journals');

    if(!showHeader) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tabs value={activeTab} onChange={onTabChange}>
                <Tab label="Notes" />
                <Tab label="Tasks" />
                <Tab label="Journals" />
                <Tab label="All" />
            </Tabs>
        </div>
    );
}

export default Header;
