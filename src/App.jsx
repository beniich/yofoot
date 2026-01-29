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
import Members from './pages/Members';
import Events from './pages/Events';
import Tickets from './pages/Tickets';
import Shop from './pages/Shop';
import TicketScanner from './pages/TicketScanner';
import News from './pages/News';
import Leagues from './pages/Leagues';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';

function App() {
  return (
    <div className="min-h-screen bg-charcoal text-white font-sans selection:bg-gold selection:text-charcoal transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/events" element={<Events />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/scanner" element={<TicketScanner />} />
        <Route path="/members" element={<Members />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/betslip" element={<BetSlip />} />
        <Route path="/bet-confirmation" element={<BetConfirmation />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/news" element={<News />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchDetail />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
