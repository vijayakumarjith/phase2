import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Download,
  Search,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Mail,
  Phone,
  User,
  School,
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const FinanceDashboard: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [paidTeams, setPaidTeams] = useState(0);
  const [pendingTeams, setPendingTeams] = useState(0);
  const [averagePayment, setAveragePayment] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchTerm, dateFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setTotalRegistrations(usersData.length);

      // First, get all teams to build a map of team emails
      const teamsSnapshot = await getDocs(collection(db, 'teams'));
      const teamEmailMap = new Map();
      const teamsData: any[] = [];
      teamsSnapshot.forEach((doc) => {
        const teamData = { id: doc.id, ...doc.data() };
        teamsData.push(teamData);
        if (teamData.members) {
          teamData.members.forEach((member: any) => {
            if (member.email) {
              teamEmailMap.set(member.email.toLowerCase(), doc.id);
            }
          });
        }
      });
      setTeams(teamsData);

      // Fetch all paid payments
      const paymentsQuery = query(collection(db, 'payments'), where('status', '==', 'paid'));
      const paymentsSnapshot = await getDocs(paymentsQuery);
      let paymentsData: any[] = [];
      let total = 0;
      const paidEmailSet = new Set();
      
      paymentsSnapshot.forEach((doc) => {
        const paymentData = { id: doc.id, ...doc.data() };
        paymentsData.push(paymentData);
        
        if (paymentData.email) {
          paidEmailSet.add(paymentData.email.toLowerCase());
        }
        
        if (paymentData.amount) {
          total += parseFloat(paymentData.amount);
        }
      });

      // Count paid teams based on email matches
      let paidTeamsCount = 0;
      let pendingTeamsCount = 0;
      const processedTeams = new Set();

      paidEmailSet.forEach((email: string) => {
        const teamId = teamEmailMap.get(email);
        if (teamId && !processedTeams.has(teamId)) {
          paidTeamsCount++;
          processedTeams.add(teamId);
        }
      });

      // Count remaining teams as pending
      teamEmailMap.forEach((teamId) => {
        if (!processedTeams.has(teamId)) {
          pendingTeamsCount++;
        }
      });
      
      // Apply date filter if active
      if (dateFilter !== 'all') {
        const now = new Date();
        let filterDate = new Date();
        
        if (dateFilter === 'today') {
          filterDate.setHours(0, 0, 0, 0);
        } else if (dateFilter === 'week') {
          filterDate.setDate(now.getDate() - 7);
        } else if (dateFilter === 'month') {
          filterDate.setMonth(now.getMonth() - 1);
        }
        
        paymentsData = paymentsData.filter(payment => {
          if (!payment.createdAt) return false;
          const paymentDate = new Date(payment.createdAt);
          return paymentDate >= filterDate;
        });
      }
      
      // Apply search filter
      if (searchTerm) {
        paymentsData = paymentsData.filter(payment => 
          payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.payment_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setPayments(paymentsData);
      setTotalRevenue(total);
      setAveragePayment(paidTeamsCount > 0 ? total / paidTeamsCount : 0);
      setPaidTeams(paidTeamsCount);
      setPendingTeams(pendingTeamsCount);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markTeamAsPaid = async (teamId: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Update team document
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        paymentStatus: 'paid',
        paymentCompletedAt: new Date().toISOString()
      });

      // Show success message
      setSuccess('Team payment status updated successfully!');
      
      // Refresh data
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sanitizeCSVField = (field: any): string => {
    if (field === null || field === undefined) return 'N/A';
    const stringField = String(field);
    return stringField.includes(',') ? `"${stringField}"` : stringField;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPaymentsToCSV = async () => {
    if (exporting) return;
    
    try {
      setExporting(true);
      setError('');
      
      if (!payments.length) {
        throw new Error('No payment records to export');
      }

      const headers = ['Date', 'Name', 'Email', 'Amount', 'Status', 'Payment ID'];
      const csvRows = [headers.join(',')];
      
      payments.forEach(payment => {
        const row = [
          payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A',
          sanitizeCSVField(payment.buyerName),
          sanitizeCSVField(payment.email),
          sanitizeCSVField(payment.amount),
          sanitizeCSVField(payment.status),
          sanitizeCSVField(payment.payment_id)
        ];
        
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `payments_export_${timestamp}.csv`);
      
    } catch (error: any) {
      console.error('Error exporting payments CSV:', error);
      setError(error.message || 'Failed to export payments. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportTeamsToCSV = async () => {
    if (exporting) return;
    
    try {
      setExporting(true);
      setError('');
      
      if (!teams.length) {
        throw new Error('No team records to export');
      }
      
      const headers = ['Team Name', 'Registration ID', 'Team Size', 'Members', 'Payment Status', 'Created At'];
      const csvRows = [headers.join(',')];
      
      teams.forEach(team => {
        const membersInfo = team.members?.map((m: any) => 
          `${sanitizeCSVField(m.name)}(${sanitizeCSVField(m.email)})`
        ).join('; ') || 'N/A';
        
        const row = [
          sanitizeCSVField(team.teamName),
          sanitizeCSVField(team.registrationId),
          sanitizeCSVField(team.teamSize),
          sanitizeCSVField(membersInfo),
          sanitizeCSVField(team.paymentStatus || 'pending'),
          team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'
        ];
        
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `teams_export_${timestamp}.csv`);
      
    } catch (error: any) {
      console.error('Error exporting teams CSV:', error);
      setError(error.message || 'Failed to export teams. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Finance Dashboard
          </h1>
          <p className="text-gray-300">
            Track payments and manage financial records
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 text-green-400 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-green-400">₹{totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <IndianRupee className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center text-xs text-green-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+{Math.round(paidTeams / (paidTeams + pendingTeams || 1) * 100)}% collection rate</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <h3 className="text-2xl font-bold text-blue-400">{totalRegistrations}</h3>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center text-xs text-blue-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{teams.length} teams formed</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Paid Teams</p>
                <h3 className="text-2xl font-bold text-purple-400">{paidTeams}</h3>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center text-xs text-purple-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>{pendingTeams} teams pending payment</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-xl rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Average Payment</p>
                <h3 className="text-2xl font-bold text-yellow-400">₹{averagePayment.toFixed(2)}</h3>
              </div>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center text-xs text-yellow-400">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>Based on {paidTeams} payments</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, email, payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm ${
                dateFilter === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/5 text-gray-300'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-2 rounded-lg text-sm ${
                dateFilter === 'today' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/5 text-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-2 rounded-lg text-sm ${
                dateFilter === 'week' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/5 text-gray-300'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-2 rounded-lg text-sm ${
                dateFilter === 'month' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-white/5 text-gray-300'
              }`}
            >
              Last 30 Days
            </button>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={exportPaymentsToCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white flex items-center justify-center"
              disabled={payments.length === 0 || exporting}
            >
              <Download className="w-5 h-5 mr-2" />
              Export Payments
            </motion.button>

            <motion.button
              onClick={exportTeamsToCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white flex items-center justify-center"
              disabled={teams.length === 0 || exporting}
            >
              <Download className="w-5 h-5 mr-2" />
              Export Teams
            </motion.button>
          </div>
        </div>

        {/* Teams Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Teams</h3>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-gray-300">Team Name</th>
                    <th className="text-left py-3 px-4 text-gray-300">Registration ID</th>
                    <th className="text-left py-3 px-4 text-gray-300">Members</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        No teams found.
                      </td>
                    </tr>
                  ) : (
                    teams.map((team, index) => (
                      <tr 
                        key={team.id} 
                        className={`border-b border-purple-500/10 ${index % 2 === 0 ? 'bg-purple-900/10' : ''}`}
                      >
                        <td className="py-3 px-4 text-white">{team.teamName}</td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                          {team.registrationId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {team.members?.map((member: any, idx: number) => (
                              <div key={idx} className="text-sm text-gray-300">
                                {member.name} ({member.email})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            team.paymentStatus === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {team.paymentStatus || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {team.paymentStatus !== 'paid' && (
                            <motion.button
                              onClick={() => markTeamAsPaid(team.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-green-600 rounded-lg text-white text-sm flex items-center"
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark as Paid
                            </motion.button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Payment Records</h3>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        {searchTerm || dateFilter !== 'all' ? 'No payments match your search criteria.' : 'No payment records found.'}
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, index) => (
                      <tr 
                        key={payment.id} 
                        className={`border-b border-purple-500/10 ${index % 2 === 0 ? 'bg-purple-900/10' : ''}`}
                      >
                        <td className="py-3 px-4 text-gray-300">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-white">{payment.buyerName || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-300">{payment.email || 'N/A'}</td>
                        <td className="py-3 px-4 text-green-400">₹{payment.amount || '0'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {payment.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                          {payment.payment_id || 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
