import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from './AppBar';
import Toolbar from './Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from './Typography';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const rightLink = {
    fontSize: 16,
    color: 'common.white',
    ml: 3,
    cursor: 'pointer'
};

function AppAppBar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem('token');

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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

    const handlePricingClick = () => {
        // Redirect to the pricing page
        navigate('/pricing');
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Link
                                underline="none"
                                color="ButtonShadow"
                                href="/"
                                sx={{
                                    fontSize: 20,
                                    alignItems: 'center'
                                }}
                            >
                                {'Serve Success'}
                            </Link>
                        </Typography>
                    </Box>
                    <Box>
                        {isLoggedIn ? (
                            <>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleMenuClick}
                                    sx={{ ml: 2 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleProfileClick}>
                                        <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleJobListingClick}>
                                        <WorkIcon sx={{ mr: 1 }} />
                                        {decodedToken.role === 'candidate' ? 'Find Jobs' : 'Job Listing'}
                                    </MenuItem>
                                    {decodedToken.role === 'employer' && (
                                        <MenuItem onClick={handlePricingClick}>
                                            <MonetizationOnIcon sx={{ mr: 1 }} />
                                            Subscriptions
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogout}>
                                        <ExitToAppIcon sx={{ mr: 1 }} />
                                        Logout
                                    </MenuItem>
                                </Menu>
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