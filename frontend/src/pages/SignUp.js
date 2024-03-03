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
import { motion } from 'framer-motion';

// Styled card with animation
const AnimatedCard = motion(Card);

const SignUpOptions = () => {
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        if (option === 'employer') {
            navigate('/sign-up/employer');
        } else if (option === 'candidate') {
            navigate('/sign-up/candidate');
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
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
                                <AnimatedCard
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
                                            Ready to find the perfect match for your team?
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Sign up here as an employer to discover top talent.
                                        </Typography>
                                    </Box>
                                </AnimatedCard>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOptionClick('candidate')}>
                                <AnimatedCard
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
                                            Ready to take the next step in your career?
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            Sign up here as a candidate to unlock exciting opportunities.
                                        </Typography>
                                    </Box>
                                </AnimatedCard>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default withRoot(SignUpOptions);