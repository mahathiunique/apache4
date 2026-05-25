import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, PlusCircle, LogOut, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReceptionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '', age: '', heart_rate: '', map: '', fio2: '', creatinine: '',
    albumin: '', aps_score: '', apache_iv_score: '', respiratory_rate: '',
    oxygen_saturation: '', blood_pressure: '', temperature: '', glucose: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const parsedData = { ...formData };
      Object.keys(parsedData).forEach(key => {
        if (key !== 'name') parsedData[key] = parseFloat(parsedData[key]) || 0;
      });
      await api.post('/patients', parsedData);
      alert('Patient Added Successfully');
      setFormData({
        name: '', age: '', heart_rate: '', map: '', fio2: '', creatinine: '',
        albumin: '', aps_score: '', apache_iv_score: '', respiratory_rate: '',
        oxygen_saturation: '', blood_pressure: '', temperature: '', glucose: ''
      });
      fetchPatients();
      setActiveTab('patients');
    } catch (err) {
      alert('Error adding patient');
    }
  };

  const handlePredict = async (id) => {
    try {
      await api.post(`/predict/${id}`);
      alert('AI Prediction Generated Successfully');
      // Optionally navigate to a detailed view or refresh
    } catch (err) {
      alert('Error generating prediction');
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Dummy analytics data
  const pieData = [
    { name: 'Critical', value: 12 },
    { name: 'Stable', value: 25 },
    { name: 'Recovering', value: 8 },
  ];

  const lineData = [
    { name: 'Mon', predictions: 12 },
    { name: 'Tue', predictions: 19 },
    { name: 'Wed', predictions: 15 },
    { name: 'Thu', predictions: 22 },
    { name: 'Fri', predictions: 30 },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Activity className="text-apollo-blue" size={28} />
          <h1 className="font-bold text-xl text-apollo-dark">Enterprise ICU</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-apollo-light text-apollo-blue' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp size={20} /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'patients' ? 'bg-apollo-light text-apollo-blue' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={20} /> Patients
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'add' ? 'bg-apollo-light text-apollo-blue' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PlusCircle size={20} /> Add Patient
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? 'ICU Analytics Dashboard' : activeTab === 'patients' ? 'Patient Directory' : 'Register New Patient'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Monitoring
            </div>
            <div className="w-10 h-10 rounded-full bg-apollo-blue text-white flex items-center justify-center font-bold">
              AH
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-xl border-l-4 border-apollo-blue">
                  <p className="text-gray-500 font-medium">Active ICU Patients</p>
                  <h3 className="text-4xl font-bold text-gray-800 mt-2">{patients.length}</h3>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-green-500">
                  <p className="text-gray-500 font-medium">AI Uptime</p>
                  <h3 className="text-4xl font-bold text-gray-800 mt-2">99.97%</h3>
                </div>
                <div className="glass p-6 rounded-xl border-l-4 border-purple-500">
                  <p className="text-gray-500 font-medium">Predictions Today</p>
                  <h3 className="text-4xl font-bold text-gray-800 mt-2">1,284</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h4 className="font-semibold text-lg mb-4">Patient Status Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h4 className="font-semibold text-lg mb-4">AI Prediction Volume (Week)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="predictions" stroke="#005a9c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search patients..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-apollo-blue outline-none"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
                      <th className="py-3 px-4 font-semibold text-gray-600">Patient Name</th>
                      <th className="py-3 px-4 font-semibold text-gray-600">Age</th>
                      <th className="py-3 px-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(p => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-500">#{p.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{p.name}</td>
                        <td className="py-3 px-4 text-gray-600">{p.age}</td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handlePredict(p.id)}
                            className="bg-apollo-light text-apollo-blue px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                          >
                            <Activity size={16} /> Run AI Prediction
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500">No patients found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto glass rounded-xl p-8">
              <form onSubmit={handleAddPatient} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(formData).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key.replace(/_/g, ' ')} {key !== 'name' && '(Numeric)'}
                      </label>
                      <input 
                        type={key === 'name' ? 'text' : 'number'} 
                        step="any"
                        value={formData[key]}
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-apollo-blue outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button type="submit" className="bg-apollo-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
                    <PlusCircle size={18} /> Register Patient
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
