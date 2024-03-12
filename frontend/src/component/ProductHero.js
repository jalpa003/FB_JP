import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '../component/Button';
import Typography from './Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage = 'https://t.ly/Dxms5';

export default function ProductHero() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobLocation, setJobLocation] = useState('');

    const handleSearch = () => {
        // Build the search query
        const queryParams = {};
        if (jobTitle) {
            queryParams.jobTitle = jobTitle;
        }
        if (jobLocation) {
            queryParams.jobLocation = jobLocation;
        }

        // Redirect to the job listing page with the search query parameters
        window.location.href = `/all-jobs?${new URLSearchParams(queryParams).toString()}`;
    };

    return (
        <ProductHeroLayout
            sxBackground={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: '#7fc7d9',
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
                sx={{
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    color: 'white',
                    fontSize: '2rem',
                }}
            >
                Savour Opportunities, Toast to Careers
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={{
                    mt: 2,
                    mb: 4,
                    display: 'flex',
                    color: 'white',
                    fontSize: '1.4rem',
                }}
            >
                Where Talent Meets Opportunity in the Food and Beverage World
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <TextField
                    placeholder="What job are you looking for?"
                    id="outlined-basic"
                    label="Job Title"
                    variant="filled"
                    onChange={(e) => setJobTitle(e.target.value)}
                    sx={{
                        width: '40%',
                        marginRight: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    placeholder="Where do you want to work?"
                    id="outlined-basic"
                    label="Location"
                    variant="filled"
                    onChange={(e) => setJobLocation(e.target.value)}
                    sx={{
                        width: '40%',
                        marginRight: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{
                        width: '20%',
                        borderRadius: '5px',
                        backgroundColor: '#ff3366',
                    }}
                >
                    Search
                </Button>
            </div>
        </ProductHeroLayout>
    );
}