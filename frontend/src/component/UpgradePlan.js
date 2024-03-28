import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundImage: 'linear-gradient(45deg, #FF4081 30%, #FF5C7F 90%)', // Pinkish gradient
    color: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 5px 2px rgba(255, 64, 129, .3)', // Pink shadow
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #FF5C7F 30%, #FF4081 90%)', // Darker pinkish gradient on hover
    },
    transition: 'background-image 0.3s',
    position: 'relative',
}));

const UpgradePlanButton = () => {
    const [sessionUrl, setSessionUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if sessionUrl is not null and redirect to the billing portal
        if (sessionUrl) {
            setIsLoading(false);
            window.location.href = sessionUrl;
        }
    }, [sessionUrl]);

    const handleUpgradePlan = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/upgrade_Subscription`, {}, { headers: { Authorization: `${token}` } });
            if (response.data.success) {
                setSessionUrl(response.data.sessionUrl);
            } else {
                console.error('Failed to create billing portal session');
            }
        } catch (error) {
            console.error('Error upgrading subscription:', error);
        }
    };

    return (
        <div>
            <StyledButton
                variant="contained"
                color="primary"
                onClick={handleUpgradePlan}
                disabled={isLoading}
            >
                {isLoading && (
                    <CircularProgress size={24} style={{ position: 'absolute', left: '50%', top: '50%', marginTop: -12, marginLeft: -12 }} />
                )}
                Upgrade Your Plan
            </StyledButton>
        </div>
    );
};

export default UpgradePlanButton;
