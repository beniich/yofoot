import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AIAgent from './pages/AIAgent';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Stats from './pages/Stats';
import BetSlip from './pages/BetSlip';
import BetConfirmation from './pages/BetConfirmation';
import Standings from './pages/Standings';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="min-h-screen bg-charcoal text-white font-sans selection:bg-gold selection:text-charcoal transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/betslip" element={<BetSlip />} />
        <Route path="/bet-confirmation" element={<BetConfirmation />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;

export default App;
