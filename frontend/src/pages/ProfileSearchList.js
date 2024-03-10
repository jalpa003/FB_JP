import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppAppBar from '../component/AppAppBar';
import FilterBarEmp from '../component/FilterBarEmp';
import CandidateCard from '../component/CandidateCard';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const ProfileSearchList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [noDataFound, setNoDataFound] = useState(false);

    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_candidates`, {
                    params: filters,
                    headers: {
                        Authorization: token,
                    },
                });
                const fetchedCandidates = response.data.candidates;
                if (fetchedCandidates.length === 0) {
                    setNoDataFound(true);
                    setCandidates([]); // Reset candidates list if no data is found
                } else {
                    setNoDataFound(false);
                    setCandidates(fetchedCandidates);
                }
            } catch (error) {
                setError('Error fetching candidates');
                setNoDataFound(true); // Set noDataFound to true to prevent rendering of candidates
                setCandidates([]); // Reset candidates list
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [filters]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({}); // Clear all filters
        setError(null); // Reset error state when filters are cleared
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Container>
                <Box my={3}>
                    {/* Pass onClearFilters prop to FilterBarEmp component */}
                    <FilterBarEmp onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
                </Box>
                <Grid container spacing={2}>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100vh">
                            <CircularProgress color="primary" />
                        </Box>
                    )}
                    {error && <p>{error}</p>}
                    {noDataFound && !loading && ( // Only render the message when no data is found and loading is completed
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" align="center" color="textSecondary">
                                        No candidates found matching your criteria.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {!noDataFound && !loading && candidates.map(candidate => ( // Only render candidates when there are candidates and loading is completed
                        <Grid item key={candidate._id} xs={12} sm={6} md={4}>
                            <CandidateCard candidate={candidate} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ProfileSearchList;
