import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import AppAppBar from '../component/AppAppBar';
import withRoot from '../withRoot';

const SignInOptions = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        if (option === 'employer') {
            navigate('/sign-in/employer');
        } else if (option === 'candidate') {
            navigate('/sign-in/candidate');
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '90.8vh',
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOptionClick('employer')}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image="/images/employer (1).jpg"
                                        alt="Employer"
                                        sx={{ objectFit: 'contain' }}
                                    />
                                    <Box p={4}>
                                        <Typography variant="h6" align="center" gutterBottom>
                                            Employer
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Looking to hire the best talent for your company?
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Sign in here as an employer.
                                        </Typography>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOptionClick('candidate')}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image="/images/candidate.jpg"
                                        alt="Candidate"
                                        sx={{ objectFit: 'contain' }}
                                    />
                                    <Box p={4}>
                                        <Typography variant="h6" align="center" gutterBottom>
                                            Candidate
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Looking for your dream job?
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Sign in here as a candidate to explore opportunities.
                                        </Typography>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default withRoot(SignInOptions);