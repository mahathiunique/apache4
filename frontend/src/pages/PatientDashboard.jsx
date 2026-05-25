import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, HeartPulse, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#ef4444'];

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [shapData, setShapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/users/me');
        setUser(userRes.data);
        const pId = id || userRes.data.patient_id;
        
        if (pId) {
          const res = await api.get(`/patients/${pId}`);
          setPatient(res.data);
          
          const histRes = await api.get(`/predict/${pId}/history`);
          setHistory(histRes.data);
          
          try {
            const shapRes = await api.get(`/predict/${pId}/shap?type=mortality`);
            setShapData(shapRes.data.explanation);
          } catch (shapErr) {
            console.error("SHAP explanation failed", shapErr);
            setShapData([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Patient Data...</div>;
  }

  const latestPred = history[0] || {
    mortality_risk_pct: 18.4,
    survival_prob_pct: 81.6,
    predicted_los_days: 4.9,
    severity_indicator: 'Moderate'
  };

  const survivalData = [
    { name: 'Survival', value: latestPred.survival_prob_pct },
    { name: 'Mortality', value: latestPred.mortality_risk_pct }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <HeartPulse className="text-apollo-blue" size={28} />
          <h1 className="font-bold text-xl text-apollo-dark">My Health Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{patient?.name || 'Patient'}</span>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Risk Status</p>
              <h3 className="text-2xl font-bold text-gray-800">{latestPred.severity_indicator}</h3>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-full text-green-600">
              <HeartPulse size={32} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Survival Probability</p>
              <h3 className="text-2xl font-bold text-gray-800">{latestPred.survival_prob_pct}%</h3>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Predicted ICU Stay</p>
              <h3 className="text-2xl font-bold text-gray-800">{latestPred.predicted_los_days} Days</h3>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-6 text-gray-800">Survival Analysis</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={survivalData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {survivalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-6 text-gray-800">SHAP Explainability (Top Impact Factors)</h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData || [
                  { feature: 'Age', impact: 0.5 },
                  { feature: 'HeartRate', impact: 0.3 },
                  { feature: 'Creatinine', impact: 0.2 }
                ]} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="impact" fill="#005a9c" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">These factors are the primary drivers for the AI's clinical prediction.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
