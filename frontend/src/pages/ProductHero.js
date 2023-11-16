import * as React from 'react';
import TextField from '@mui/material/TextField';
// import Button from '../component/Button';
import Typography from '../component/Typography';
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
            {/* Increase the network loading priority of the background image. */}
            <img
                style={{ display: 'none' }}
                src={backgroundImage}
                alt="increase priority"
            />
            <Typography color="inherit" align="center" variant="h5" marked="center">
                Savor Opportunities, Toast to Careers
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
            >
                Where Talent Meets Opportunity in the Food and Beverage World
            </Typography>
            <TextField
                placeholder="Search for Jobs... e.g., Chef, Barista, Manager"
                id="outlined-basic"
                label="Search"
                variant="filled"
                sx={{
                    width: '70%',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    lineHeight: '19px',
                    letterSpacing: '0.02em',
                    padding: '10px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 24px',
                    transition: '.2s ease-in-out',
                    '&:hover': {
                        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 8px 24px',
                        transform: 'translateY(-2px)'
                    },
                    '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.9)',
                    },
                }}
                InputLabelProps={{ shrink: true }}

            />


            {/* <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
                Discover the Opportunities
            </Typography> */}
        </ProductHeroLayout>
    );
}