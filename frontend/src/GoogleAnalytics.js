import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-J68NY7MKPY';

export const initGA = () => {
    ReactGA.initialize(GOOGLE_ANALYTICS_MEASUREMENT_ID);
};

export const logPageView = () => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

const GoogleAnalytics = () => {
    useEffect(() => {
        initGA();
        logPageView();
    }, []);

    return null;
};

export default GoogleAnalytics;