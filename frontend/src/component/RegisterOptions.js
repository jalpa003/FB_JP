import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const section = {
    textAlign: 'center',
    p: 3,
};

const RegisterSection = ({ title, description, buttonText, linkTo }) => (
    <Box sx={section}>
        <Typography variant="h4" component="div" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            {description}
        </Typography>
        <Button component={Link} to={linkTo} variant="contained">
            {buttonText}
        </Button>
    </Box>
);

const RegisterOptions = () => {
    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                bgcolor: 'secondary.light',
                pt: 5,
                pb: 10,
                backgroundImage: 'url("/images/snow.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <RegisterSection
                            title="Register as a Job Seeker"
                            description="Discover a variety of job opportunities in the food and beverage industry. Connect with top employers and start your culinary journey."
                            buttonText="Register as a Job Seeker"
                            linkTo="/sign-up/candidate"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RegisterSection
                            title="Register as an Employer"
                            description="Post job listings, connect with talented individuals. Explore the perfect candidates for your culinary business."
                            buttonText="Register as an Employer"
                            linkTo="/sign-up/employer"
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RegisterOptions;
