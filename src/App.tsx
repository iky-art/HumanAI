import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Chat from './pages/Chat';
import History from './pages/History';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import Operator from './pages/Operator';
import Admin from './pages/Admin';
import Founder from './pages/Founder';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />

      {/* Any signed-in role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Operator, Admin, and Founder can all work the Operator Panel
          ("founder juga bisa jadi operator, all-in-one"). */}
      <Route element={<ProtectedRoute allowedRoles={['operator', 'admin', 'founder']} />}>
        <Route element={<AppShell />}>
          <Route path="/operator" element={<Operator />} />
        </Route>
      </Route>

      {/* Admin panel: admin AND founder (founder can do everything admin can). */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'founder']} />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* Founder panel: founder only. */}
      <Route element={<ProtectedRoute allowedRoles={['founder']} />}>
        <Route element={<AppShell />}>
          <Route path="/founder" element={<Founder />} />
        </Route>
      </Route>
    </Routes>
  );
}
