import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from './AppBar';
import Toolbar from './Toolbar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const rightLink = {
    fontSize: 16,
    color: 'common.white',
    ml: 3,
    cursor: 'pointer'
};

function AppAppBar() {
    const navigate = useNavigate();

    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem('token');

    let decodedToken;

    if (isLoggedIn) {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Decode the token to get user information
        decodedToken = jwt_decode(token);
    }

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        // Redirect to the home page or login page
        navigate('/');
    };

    const handleProfileClick = () => {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Decode the token to get user information
        const decodedToken = jwt_decode(token);
        // Redirect to the appropriate profile page based on the user's role
        if (decodedToken && decodedToken.role) {
            if (decodedToken.role === 'employer') {
                navigate('/employer-profile');
            } else {
                navigate('/candidate-profile');
            }
        }
    };

    const handleJobListingClick = () => {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Decode the token to get user information
        const decodedToken = jwt_decode(token);

        // Redirect to the appropriate job listing page based on the user's role
        if (decodedToken && decodedToken.role === 'candidate') {
            navigate('/all-jobs');
        } else {
            navigate('/job-listing');
        }
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }} />
                    <Link
                        variant="h6"
                        underline="none"
                        color="inherit"
                        href="/"
                        sx={{ fontSize: 20 }}
                    >
                        {'Serve Success'}
                    </Link>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    color="inherit"
                                    variant="h6"
                                    underline="none"
                                    onClick={handleProfileClick}
                                    sx={rightLink}
                                >
                                    {'Profile'}
                                </Link>
                                <Link
                                    color="inherit"
                                    variant="h6"
                                    underline="none"
                                    onClick={handleJobListingClick}
                                    sx={{ ...rightLink }}
                                >
                                    {decodedToken.role === 'candidate' ? 'Jobs' : 'Job Listing'}
                                </Link>
                                <Link
                                    color="inherit"
                                    variant="h6"
                                    underline="none"
                                    onClick={handleLogout}
                                    sx={{ ...rightLink, color: 'secondary.main' }}
                                >
                                    {'Logout'}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    color="inherit"
                                    variant="h6"
                                    underline="none"
                                    href="/Sign In"
                                    sx={rightLink}
                                >
                                    {'Sign In'}
                                </Link>
                                <Link
                                    color="inherit"
                                    variant="h6"
                                    underline="none"
                                    href="/Sign Up"
                                    sx={{ ...rightLink, color: 'secondary.main' }}
                                >
                                    {'Sign Up'}
                                </Link>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
    );
}

export default AppAppBar;