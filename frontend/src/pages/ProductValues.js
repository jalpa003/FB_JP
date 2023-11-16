import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../component/Typography';

const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5,
};

function ProductValues() {
    return (
        <Box
            component="section"
            sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}
        >
            <Container sx={{ mt: 13, mb: 20, display: 'flex', position: 'relative' }}>
                <Box
                    component="img"
                    src="/images/productCurvyLines.png"
                    alt="curvy lines"
                    sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
                />
                <Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src="/images/opportunities.png"
                                alt="opportunities"
                                sx={{ height: 95 }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }}>
                                Discover  Opportunities
                            </Typography>
                            <Typography variant="h5">
                                {
                                    'Explore a diverse range of job listings in the food and beverage industry'
                                }

                                {
                                    ', from bustling restaurants to dynamic catering services.'
                                }
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src="/images/connect.png"
                                alt="Connect"
                                sx={{ height: 95 }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }}>
                                Connect with Top Employers
                            </Typography>
                            <Typography variant="h5">
                                {
                                    'Build your career in a sizzling kitchen or a vibrant dining setting by connecting with leading employers seeking your culinary skills. '
                                }

                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <Box
                                component="img"
                                src="/images/journey.png"
                                alt="Journey"
                                sx={{ height: 95 }}
                            />
                            <Typography variant="h5" sx={{ my: 5 }}>
                                Savor Your Career Journey
                            </Typography>
                            <Typography variant="h5">
                                {'Navigate a world of flavors in your professional journey- '}
                                {'find the perfect job, showcase your talents, and savor success in the food industry.'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ProductValues;