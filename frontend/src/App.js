import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import withRoot from './withRoot';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='=' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default withRoot(App);
