import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import withRoot from './withRoot';
import SignUpCandidate from './pages/SignUpCandidate';
import SignUpEmployer from './pages/SignUpEmployer';
import SignInCandidate from './pages/SignInCandidate';
import SignInEmployer from './pages/SignInEmployer';
import ForgetPassword from './pages/ForegtPassword';
import EmployerProfile from './pages/EmployerProfile';
import Profile from './pages/Profile';
import JobPosting from './pages/JobPosting';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='=' element={<NotFound />} />
          <Route path="/sign-up/candidate" element={<SignUpCandidate />} />
          <Route path="/sign-up/employer" element={<SignUpEmployer />} />
          <Route path="/sign-in/candidate" element={<SignInCandidate />} />
          <Route path="/sign-in/employer" element={<SignInEmployer />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/employer-profile" element={<EmployerProfile />} />
          <Route path="/candidate-profile" element={<Profile />} />
          <Route path="/job-posting" element={<JobPosting />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default withRoot(App);
