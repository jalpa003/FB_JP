import * as React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '../component/Paper';

function CenteredAppForm(props) {
    const { children } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0', // Set your desired background color
            }}
        >
            <Container maxWidth="md">
                <Paper
                    background="light"
                    sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 6 }, width: '100%' }}
                >
                    {children}
                </Paper>
            </Container>
        </Box>
    );
}

CenteredAppForm.propTypes = {
    children: PropTypes.node,
};

export default CenteredAppForm;
