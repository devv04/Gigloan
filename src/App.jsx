import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BankConnectPage from './pages/BankConnectPage';
import WorkerSelectionPage from './pages/WorkerSelectionPage';
import DashboardPage from './pages/DashboardPage';
import ScoreBreakdownPage from './pages/ScoreBreakdownPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<BankConnectPage />} />
        <Route path="/demo" element={<WorkerSelectionPage />} />
        <Route path="/dashboard/:profileId" element={<DashboardPage />} />
        <Route path="/breakdown/:profileId" element={<ScoreBreakdownPage />} />
      </Routes>
    </Router>
  );
}

export default App;
