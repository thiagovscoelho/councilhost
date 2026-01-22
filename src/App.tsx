import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TwitterAuthProvider } from './components/auth/TwitterAuthProvider';
import HomePage from './pages/HomePage';
import CreateCouncilPage from './pages/CreateCouncilPage';
import CouncilPage from './pages/CouncilPage';
import InvitationPage from './pages/InvitationPage';

function App() {
  return (
    <BrowserRouter>
      <TwitterAuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateCouncilPage />} />
          <Route path="/council/:councilId" element={<CouncilPage />} />
          <Route path="/invite/:councilId" element={<InvitationPage />} />
        </Routes>
      </TwitterAuthProvider>
    </BrowserRouter>
  );
}

export default App;
