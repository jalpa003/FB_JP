import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-J68NY7MKPY";

export const initGA = () => {
    ReactGA.initialize(GOOGLE_ANALYTICS_MEASUREMENT_ID, { debug: true });
};

export const logPageView = () => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    console.log(window.location.pathname);
};

const GoogleAnalytics = () => {
    useEffect(() => {
        initGA();
        logPageView();
    }, []);

    return null;
};

export default GoogleAnalytics;