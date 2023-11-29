import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '../component/Button';
import Typography from './Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage =
    'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function ProductHero() {
    // const handleSearch = (event) => {
    //     // Implement your search logic here
    //     console.log('Search Query:', event.target.value);
    // };

    return (
        <ProductHeroLayout
            sxBackground={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: '#7fc7d9', // Average color of the background image.
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: "100vh",
                backgroundSize: 'cover',
            }}
        >
            <img
                style={{ display: 'none' }}
                src={backgroundImage}
                alt="increase priority"
            />
            <Typography color="inherit" align="center" variant="h5" marked="center"
                sx={
                    {
                        mt: 2,
                        mb: 2,
                        display: 'flex',
                        color: 'white',
                        fontSize: '2rem',
                    }
                }>
                Savor Opportunities, Toast to Careers
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={
                    {
                        mt: 2,
                        mb: 4,
                        display: 'flex',
                        color: 'white',
                        fontSize: '1.4rem',
                    }
                }
            >
                Where Talent Meets Opportunity in the Food and Bartending World
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', margin: '0 auto' }}>
                <TextField
                    placeholder="What job are you looking for?"
                    id="outlined-basic"
                    label="Job Title"
                    variant="filled"
                    sx={{
                        flex: '1',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        lineHeight: '19px',
                        letterSpacing: '0.02em',
                        boxShadow: 'rgba(0, 0, 0, 0.8) 0px 10px 24px',
                        transition: '.2s ease-in-out',
                        '&:hover': {
                            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 24px',
                            transform: 'translateY(-2px)'
                        },
                        '&::placeholder': {
                            color: 'rgba(0, 0, 0, 0.9)',
                        },
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 2, sm: 0 },
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    placeholder="Where do you want to work?"
                    id="outlined-basic"
                    label="Location"
                    variant="filled"
                    sx={{
                        flex: '1',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        lineHeight: '19px',
                        letterSpacing: '0.02em',
                        boxShadow: 'rgba(0, 0, 0, 0.8) 0px 10px 24px',
                        transition: '.2s ease-in-out',
                        '&:hover': {
                            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 24px',
                            transform: 'translateY(-2px)'
                        },
                        '&::placeholder': {
                            color: 'rgba(0, 0, 0, 0.9)',
                        },
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 2, sm: 0 },
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: '5px',
                        backgroundColor: '#ff3366',
                        lineHeight: '19px',
                        letterSpacing: '0.02em',
                        boxShadow: 'rgba(0, 0, 0, 0.8) 0px 10px 24px',
                        '&:hover': {
                            backgroundColor: '#ff3366',
                            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 24px',
                        },
                        ml: { xs: 0, sm: 2 },
                        height: '100%',
                    }}
                >
                    Search
                </Button>
            </div>
            {/* <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
                Discover the Opportunities
            </Typography> */}
        </ProductHeroLayout>
    );
}