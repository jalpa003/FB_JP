import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import axios from 'axios';

const FilterBar = ({ onFilterChange }) => {
    const [datePostedFilter, setDatePostedFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [distanceFilter, setDistanceFilter] = useState('');
    const [industryTypeFilter, setIndustryTypeFilter] = useState('');
    const [payFilter, setPayFilter] = useState('');
    const [payDisplay, setPayDisplay] = useState('');
    const [workAvailabilityFilter, setWorkAvailabilityFilter] = useState('');
    const [locations, setLocations] = useState([]);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch_locations`);
                setLocations(response.data.locations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const handleClearFilters = () => {
        setDatePostedFilter('');
        setJobTypeFilter('');
        setLocationFilter('');
        setDistanceFilter('');
        setIndustryTypeFilter('');
        setPayFilter('');
        setWorkAvailabilityFilter('');

        onFilterChange('datePosted', '');
        onFilterChange('jobType', '');
        onFilterChange('location', '');
        onFilterChange('distance', '');
        onFilterChange('industryType', '');
        onFilterChange('pay', '');
        onFilterChange('workAvailability', '');
    };

    const handleSubMenuOpen = (event) => {
        setSubMenuAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
    };

    const handlePayTypeChange = (payType) => {
        let selectedPayType = '';
        let payRate = '';

        if (payType === 'perHour' || payType === 'perYear') {
            selectedPayType = payType === 'perHour' ? 'Per Hour' : 'Per Year';
            payRate = payType;
        } else {
            switch (payType) {
                case 'minimumWage':
                    selectedPayType = 'Per Hour: Minimum Wage';
                    payRate = 'perHour';
                    break;
                case 'below20':
                    selectedPayType = 'Per Hour: Below $20';
                    payRate = 'perHour';
                    break;
                case '20to25':
                    selectedPayType = 'Per Hour: $20 to $25';
                    payRate = 'perHour';
                    break;
                case '25to30':
                    selectedPayType = 'Per Hour: $25 to $30';
                    payRate = 'perHour';
                    break;
                case '30to40':
                    selectedPayType = 'Per Hour: $30 to $40';
                    payRate = 'perHour';
                    break;
                case '40plus':
                    selectedPayType = 'Per Hour: $40+';
                    payRate = 'perHour';
                    break;
                case 'below40k':
                    selectedPayType = 'Per Year: Below $40k';
                    payRate = 'perYear';
                    break;
                case '40kto50k':
                    selectedPayType = 'Per Year: $40k to $50k';
                    payRate = 'perYear';
                    break;
                case '50kto60k':
                    selectedPayType = 'Per Year: $50k to $60k';
                    payRate = 'perYear';
                    break;
                case '60kto80k':
                    selectedPayType = 'Per Year: $60k to $80k';
                    payRate = 'perYear';
                    break;
                case '80kplus':
                    selectedPayType = 'Per Year: $80k+';
                    payRate = 'perYear';
                    break;
                default:
                    break;
            }
        }

        setPayFilter(payRate); // Use payRate for internal tracking
        setPayDisplay(selectedPayType); // Use selectedPayType for display purposes

        // Update filters via onFilterChange
        onFilterChange('payRate', payRate);
        onFilterChange('pay', payType);

        // Close the submenu
        setSubMenuAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Date Posted</InputLabel>
                <Select
                    label="Date Posted"
                    value={datePostedFilter}
                    onChange={(e) => {
                        setDatePostedFilter(e.target.value);
                        onFilterChange('datePosted', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="last24hours">Last 24 Hours</MenuItem>
                    <MenuItem value="last7days">Last 7 Days</MenuItem>
                    <MenuItem value="last15days">Last 15 Days</MenuItem>
                    <MenuItem value="last30days">Last 30 Days</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Job Type</InputLabel>
                <Select
                    label="Job Type"
                    value={jobTypeFilter}
                    onChange={(e) => {
                        setJobTypeFilter(e.target.value);
                        onFilterChange('jobType', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="fullTime">Full Time</MenuItem>
                    <MenuItem value="partTime">Part Time</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="seasonal">Seasonal</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Location</InputLabel>
                <Select
                    label="Location"
                    value={locationFilter}
                    onChange={(e) => {
                        setLocationFilter(e.target.value);
                        onFilterChange('location', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    {locations.map((location, index) => (
                        <MenuItem key={index} value={location.location}>
                            {location.location}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Distance</InputLabel>
                <Select
                    label="Distance"
                    value={distanceFilter}
                    onChange={(e) => {
                        setDistanceFilter(e.target.value);
                        onFilterChange('distance', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="within10miles">Within 10 Kms</MenuItem>
                    <MenuItem value="within20miles">Within 25 Kms</MenuItem>
                    <MenuItem value="within30miles">Within 50 Kms</MenuItem>
                    <MenuItem value="within30miles">Within 100 Kms</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Industry Type</InputLabel>
                <Select
                    label="Industry Type"
                    value={industryTypeFilter}
                    onChange={(e) => {
                        setIndustryTypeFilter(e.target.value);
                        onFilterChange('industryType', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="Fine Dining">Fine Dining</MenuItem>
                    <MenuItem value="Fast Food">Fast Food</MenuItem>
                    <MenuItem value="Cafés">Cafés</MenuItem>
                    <MenuItem value="Catering">Catering</MenuItem>
                    <MenuItem value="Bakeries">Bakeries</MenuItem>
                    <MenuItem value="Pubs and Bars">Pubs and Bars</MenuItem>
                    <MenuItem value="Brewers, Winneries & Distilleries">Brewers, Winneries & Distilleries</MenuItem>
                    <MenuItem value="Casual Dining">Casual Dining</MenuItem>
                    <MenuItem value="Banquet Facilities">Banquet Facilities</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Pay</InputLabel>
                <Select
                    label="Pay"
                    value={payFilter}
                    // displayEmpty
                    renderValue={() => payDisplay || 'Select'}
                    onChange={(e) => {
                        setPayFilter(e.target.value);
                        onFilterChange('pay', e.target.value);
                    }}
                    onClick={handleSubMenuOpen}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="perHour">Per Hour</MenuItem>
                    <MenuItem value="perYear"> Per Year</MenuItem>
                </Select>
                <Menu
                    anchorEl={subMenuAnchorEl}
                    open={Boolean(subMenuAnchorEl)}
                    onClose={handleSubMenuClose}
                >
                    {payFilter === 'perHour' && (
                        <>
                            <MenuItem onClick={() => handlePayTypeChange('minimumWage')}>Minimum Wage</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('below20')}>Below $20 per hour</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('20to25')}>$20 to $25 per hour</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('25to30')}>$25 to $30 per hour</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('30to40')}>$30 to $40 per hour</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('40plus')}>$40+ per hour</MenuItem>
                        </>
                    )}
                    {payFilter === 'perYear' && (
                        <>
                            <MenuItem onClick={() => handlePayTypeChange('below40k')}>Below $40k per year</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('40kto50k')}>$40k to $50k per year</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('50kto60k')}>$50k to $60k per year</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('60kto80k')}>$60k to $80k per year</MenuItem>
                            <MenuItem onClick={() => handlePayTypeChange('80kplus')}>$80k+ per year</MenuItem>
                        </>
                    )}
                </Menu>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 200, marginBottom: 2 }}>
                <InputLabel>Work Availability</InputLabel>
                <Select
                    label="Work Availability"
                    value={workAvailabilityFilter}
                    onChange={(e) => {
                        setWorkAvailabilityFilter(e.target.value);
                        onFilterChange('workAvailability', e.target.value);
                    }}
                >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="weekDayAvailability">Weekday Availability</MenuItem>
                    <MenuItem value="weekendAvailability">Weekend Availability</MenuItem>
                    <MenuItem value="dayShift">Day Shift</MenuItem>
                    <MenuItem value="eveningShift">Evening Shift</MenuItem>
                    <MenuItem value="onCall">On Call</MenuItem>
                    <MenuItem value="holidays">Holidays</MenuItem>
                </Select>
            </FormControl>

            <Tooltip title="Clear Filters" arrow>
                <IconButton onClick={handleClearFilters} color="primary" aria-label="Clear Filters" >
                    <ClearAllIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default FilterBar;