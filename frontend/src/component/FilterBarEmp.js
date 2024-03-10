import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Autocomplete from '@mui/material/Autocomplete';
import { canadianLocations } from './canadianLocations';

const trainingOptions = [
    { value: 'culinaryTraining', label: 'Culinary Training' },
    { value: 'redSeal', label: 'Red Seal' },
    { value: 'smartServe', label: 'Smart Serve' },
    { value: 'customerService', label: 'Customer Service' },
    { value: 'workplaceSafety', label: 'Workplace Safety' },
    { value: 'fineDining', label: 'Fine Dining' },
    { value: 'POSExperience', label: 'POS Experience' }
];

const FilterBarEmp = ({ onFilterChange, onClearFilters }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [desiredJobType, setDesiredJobType] = useState('');
    const [training, setTraining] = useState('');
    const [languageSkills, setLanguageSkills] = useState('');

    const jobTitles = [
        'Chef', 'Sous Chef', 'Line Cook', 'Pastry Chef', 'Baker', 'Kitchen Manager',
        'Food and Beverage Manager', 'Bartender', 'Server', 'Host/Hostess',
        'Catering Manager', 'Event Planner', 'Sommelier', 'Mixologist', 'Bar Manager',
        'Barista', 'Dishwasher', 'Busser', 'Food Runner', 'Prep Cook', 'Food Expeditor', 'Door Supervisor',
        'Culinary Instructor', 'Restaurant Manager', 'General Manager', 'Shift Supervisor', 'Restaurant Owner',
    ];

    const sortedJobTitles = jobTitles.sort((a, b) => a.localeCompare(b));

    const handleJobTitleChange = (event) => {
        const value = event.target.value;
        setJobTitle(value);
        onFilterChange('desiredJobTitle', value);
    };

    const handleLocationChange = (event, newValue) => {
        const value = newValue || ''; // If newValue is null, set value to empty string
        setLocation(value);
        onFilterChange('location', value);
    };

    const handleExperienceLevelChange = (event) => {
        const value = event.target.value;
        setExperienceLevel(value);
        onFilterChange('experienceLevel', value);
    };

    const handleDesiredJobTypeChange = (event) => {
        const value = event.target.value;
        setDesiredJobType(value);
        onFilterChange('desiredJobType', value);
    };

    const handleTrainingChange = (event) => {
        const value = event.target.value;
        setTraining(value);
        onFilterChange('jobTraining', value);
    };

    const handleLanguageSkillsChange = (event) => {
        const value = event.target.value;
        setLanguageSkills(value);
        onFilterChange('languageSkills', value);
    };

    const handleClearFilters = () => {
        // Reset all filter state variables to their initial empty values
        setJobTitle('');
        setLocation('');
        setExperienceLevel('');
        setDesiredJobType('');
        setTraining('');
        setLanguageSkills('');
        // Notify parent component that filters have been cleared
        onClearFilters();
    };

    return (
        <Box p={2} boxShadow={9} border="1px solid #ccc" borderRadius={4} bgcolor="#f9f9f9" mb={2} display="flex" flexDirection="column">
            <Box display="flex" flexWrap="wrap" gap={2}>
                <TextField select variant="outlined" size="small" label="Job Title" value={jobTitle} onChange={handleJobTitleChange} sx={{ minWidth: 'calc(50% - 8px)' }}>
                    <MenuItem value="" disabled>Select</MenuItem>
                    {sortedJobTitles.map((title, index) => (
                        <MenuItem key={index} value={title}>{title}</MenuItem>
                    ))}
                </TextField>
                <Autocomplete
                    value={location}
                    onChange={handleLocationChange}
                    options={canadianLocations}
                    sx={{ minWidth: 'calc(50% - 8px)' }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location"
                            size="small"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter a city or province"
                        />
                    )}
                />
                <TextField select variant="outlined" size="small" label="Experience Level" value={experienceLevel} onChange={handleExperienceLevelChange} sx={{ minWidth: 'calc(50% - 8px)' }}>
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="<1">Less than 1 Year</MenuItem>
                    <MenuItem value="1-3">1-3 Years</MenuItem>
                    <MenuItem value="3-5">3-5 Years</MenuItem>
                    <MenuItem value="5-7">5-7 Years</MenuItem>
                    <MenuItem value="7-10">7-10 Years</MenuItem>
                    <MenuItem value="10+">10+ Years</MenuItem>
                </TextField>
                <TextField select variant="outlined" size="small" label="Desired Job Type" value={desiredJobType} onChange={handleDesiredJobTypeChange} sx={{ minWidth: 'calc(50% - 8px)' }}>
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="fullTime">Full Time</MenuItem>
                    <MenuItem value="partTime">Part Time</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="seasonal">Seasonal</MenuItem>
                </TextField>
                <TextField select variant="outlined" size="small" label="Training" value={training} onChange={handleTrainingChange} sx={{ minWidth: 'calc(50% - 8px)' }}>
                    <MenuItem value="" disabled>Select</MenuItem>
                    {trainingOptions.map((option, index) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))}
                </TextField>
                <TextField select variant="outlined" size="small" label="Language Skills" value={languageSkills} onChange={handleLanguageSkillsChange} sx={{ minWidth: 'calc(50% - 8px)' }}>
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                </TextField>

            </Box>
            <Tooltip title="Clear Filters" arrow>
                <IconButton color="primary" aria-label="Clear Filters" onClick={handleClearFilters}>
                    <ClearAllIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default FilterBarEmp;