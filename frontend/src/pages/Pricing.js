import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '../component/Typography';
import AppAppBar from '../component/AppAppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PricingPage = () => {
  const [pricingPlans, setPricingPlans] = useState([]);

  useEffect(() => {
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

  const handleBuyNow = async (planName) => {
    try {
      const token = localStorage.getItem('token');

      // Check if the token exists
      if (!token) {
        toast.error('Please log in to purchase a plan.');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,
        { selectedPlan: planName },
        { headers: { 'Authorization': `${token}` } }
      );

      const checkoutUrl = response.data.checkoutUrl;

      // Redirect to the checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      const errorData = error.response.data;
      console.log(errorData.message);
      toast.error(errorData.message);
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <Box
        sx={{
          display: 'flex',
          backgroundImage: 'url("http://tinyurl.com/3yfbbbun")',
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
                      ${plan.price}
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
                      {plan.price !== 0 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleBuyNow(plan.name)}
                        >
                          Buy Now
                        </Button>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Free Plan
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <ToastContainer />
    </React.Fragment>
  );
};

export default PricingPage;
