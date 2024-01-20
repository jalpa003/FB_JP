import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import withRoot from '../withRoot';
import axios from 'axios';

const PricingPage = () => {
  const [pricingPlans, setPricingPlans] = useState([]);

  useEffect(() => {
    // Fetch pricing details from the backend API
    const fetchPricingDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/pricing-plans`);
        setPricingPlans(response.data);
      } catch (error) {
        console.error('Error fetching pricing details:', error);
      }
    };

    fetchPricingDetails();
  }, []);

  return (
    <React.Fragment>
      <AppAppBar />
      <Box
        sx={{
          display: 'flex',
          backgroundImage: 'url("https://t.ly/BnYyp")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom marked="center" align="center" sx={{ mt: 3, mb: 2 }}>
            Pricing Plans
          </Typography>
          <Grid container spacing={3}>
            {pricingPlans.map((plan) => (
              <Grid item key={plan._id} xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" mb={2} align="center">
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" mb={2} align="center">
                      {plan.price}$
                    </Typography>
                    <Typography variant="body2" mb={2} align="center">
                      {plan.description}
                    </Typography>
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button variant="contained" color="primary">
                        Buy Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default withRoot(PricingPage);
