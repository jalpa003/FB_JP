import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AppAppBar from '../component/AppAppBar';
import withRoot from '../withRoot';

const SignUpOptions = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleSignUp = () => {
        if (selectedOption === 'employer') {
            navigate('/sign-up/employer');
        } else if (selectedOption === 'candidate') {
            navigate('/sign-up/candidate');
        }
    };

    return (
        <React.Fragment>
            <AppAppBar />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    minHeight: '90.8vh',
                    backgroundImage: 'url("https://shorturl.at/mpBDO")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        padding: '2rem',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                        width: '40%',
                        minWidth: '300px',
                    }}
                >
                    <Typography variant="h4" gutterBottom marked="center" align="center">
                        Choose Your Role
                    </Typography>
                    <Paper
                        sx={{
                            padding: 3,
                            backgroundColor: selectedOption === 'employer' ? '#c7cdd4' : '#fff',
                            cursor: 'pointer',
                            transition: 'background-color 0.5s',
                            marginBottom: '1rem',
                        }}
                        onClick={() => handleOptionClick('employer')}
                    >
                        <Typography variant="h6" align="center" color="primary.main">
                            Register as Employer
                        </Typography>
                    </Paper>
                    <Paper
                        sx={{
                            padding: 3,
                            backgroundColor: selectedOption === 'candidate' ? '#fae1f7' : '#fff',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onClick={() => handleOptionClick('candidate')}
                    >
                        <Typography variant="h6" align="center" color="secondary.main">
                            Register as Candidate
                        </Typography>
                    </Paper>
                    {selectedOption && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </Button>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default withRoot(SignUpOptions);
