import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";

export default function App() {
  const { t } = useTranslation();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/other" element={<div className="text-center text-xl">{t('app.comingSoon')}</div>} />
      </Routes>
    </Router>
  );
}
