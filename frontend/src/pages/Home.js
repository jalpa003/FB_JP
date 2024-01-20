import * as React from 'react';
import ProductCategories from '../component/ProductCategories';
import ProductSmokingHero from '../component/ProductSmokingHero';
import AppFooter from '../component/AppFooter';
import ProductHero from '../component/ProductHero';
import ProductValues from '../component/ProductValues';
import RegisterOptions from '../component/RegisterOptions';
// import ProductHowItWorks from './ProductHowItWorks';
import ProductCTA from '../component/ProductCTA';
import AppAppBar from '../component/AppAppBar';
import withRoot from '../withRoot';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProductHero />
      <RegisterOptions />
      <ProductCategories />
      <ProductValues />
      {/* <ProductHowItWorks /> */}
      <ProductCTA />
      <ProductSmokingHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);