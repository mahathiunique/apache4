import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Lock, Mail } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('admin@apollo.com');
  const [password, setPassword] = useState('apollo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await api.post('/token', formData);
      localStorage.setItem('token', res.data.access_token);
      
      // Fetch user profile
      const userRes = await api.get('/users/me');
      localStorage.setItem('role', userRes.data.role);
      
      if (userRes.data.role === 'receptionist') {
        navigate('/receptionist');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-apollo-dark/70 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass rounded-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-apollo-blue p-4 rounded-full text-white shadow-xl">
            <Stethoscope size={40} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-apollo-dark mb-2">Apollo Hospitals</h2>
        <p className="text-center text-gray-500 mb-8">ICU AI Decision Support System</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-apollo-blue focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-apollo-blue focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-apollo-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          Authorized personnel only. Data is protected under HIPAA compliance.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
