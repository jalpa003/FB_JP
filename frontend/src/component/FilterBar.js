import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const FilterBar = ({ onFilterChange }) => {
    const [datePostedFilter, setDatePostedFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [distanceFilter, setDistanceFilter] = useState('');

    const handleClearFilters = () => {
        // Implement logic to clear filters
        setDatePostedFilter('');
        setJobTypeFilter('');
        setLocationFilter('');
        setDistanceFilter('');

        // Notify parent component to clear filters
        onFilterChange('datePosted', '');
        onFilterChange('jobType', '');
        onFilterChange('location', '');
        onFilterChange('distance', '');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {/* Date Posted Filter */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Date Posted</InputLabel>
                <Select
                    label="Date Posted"
                    value={datePostedFilter}
                    onChange={(e) => {
                        setDatePostedFilter(e.target.value);
                        onFilterChange('datePosted', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select
                    </MenuItem>
                    <MenuItem value="last24hours">Last 24 Hours</MenuItem>
                    <MenuItem value="last7days">Last 7 Days</MenuItem>
                    <MenuItem value="last15days">Last 15 Days</MenuItem>
                    <MenuItem value="last30days">Last 30 Days</MenuItem>
                    {/* Add more options as needed */}
                </Select>
            </FormControl>

            {/* Job Type Filter */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Job Type</InputLabel>
                <Select
                    label="Job Type"
                    value={jobTypeFilter}
                    onChange={(e) => {
                        setJobTypeFilter(e.target.value);
                        onFilterChange('jobType', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select
                    </MenuItem>
                    <MenuItem value="fullTime">Full Time</MenuItem>
                    <MenuItem value="partTime">Part Time</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="seasonal">Seasonal</MenuItem>
                    {/* Add more options as needed */}
                </Select>
            </FormControl>

            {/* Location Filter */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Location</InputLabel>
                <Select
                    label="Location"
                    value={locationFilter}
                    onChange={(e) => {
                        setLocationFilter(e.target.value);
                        onFilterChange('location', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select
                    </MenuItem>
                    {/* Add options for cities and provinces */}
                </Select>
            </FormControl>

            {/* Distance Filter */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Distance</InputLabel>
                <Select
                    label="Distance"
                    value={distanceFilter}
                    onChange={(e) => {
                        setDistanceFilter(e.target.value);
                        onFilterChange('distance', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>
                        Select
                    </MenuItem>
                    <MenuItem value="within10miles">Within 10 Miles</MenuItem>
                    <MenuItem value="within20miles">Within 20 Miles</MenuItem>
                    <MenuItem value="within30miles">Within 30 Miles</MenuItem>
                    {/* Add more options as needed */}
                </Select>
            </FormControl>

            <IconButton onClick={handleClearFilters} color="primary" aria-label="Clear Filters">
                <ClearIcon />
            </IconButton>
        </Box>
    );
};

export default FilterBar;
