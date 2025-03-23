import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  User,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Edit,
  School,
  AlertCircle,
  CheckCircle,
  Download,
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { sendWorkshopInvite, sendPhase2Selection } from '../../lib/emailService';

interface AdminDashboardProps {
  isFinanceAdmin: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isFinanceAdmin }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState({
    points: 0,
    review: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const submissionsQuery = query(collection(db, 'phase1_submissions'));
      const snapshot = await getDocs(submissionsQuery);
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmit = async (submissionId: string) => {
    try {
      setLoading(true);
      
      await updateDoc(doc(db, 'phase1_submissions', submissionId), {
        points: scoreData.points,
        review: scoreData.review,
        reviewedAt: new Date().toISOString()
      });

      setEditingScore(null);
      setScoreData({ points: 0, review: '' });
      
      fetchData();
      setSuccess('Score updated successfully');
    } catch (error) {
      console.error('Error updating score:', error);
      setError('Failed to update score');
    } finally {
      setLoading(false);
    }
  };

  const publishResults = async () => {
    try {
      setPublishing(true);
      
      // Check if all submissions are scored
      const unscored = submissions.filter(sub => sub.points === undefined);
      if (unscored.length > 0) {
        throw new Error('All submissions must be scored before publishing results');
      }

      // Create the phase1Results document if it doesn't exist
      const configRef = doc(db, 'config', 'phase1Results');
      const configDoc = await getDoc(configRef);

      if (!configDoc.exists()) {
        await updateDoc(configRef, {
          published: true,
          publishedAt: new Date().toISOString()
        });
      } else {
        await updateDoc(configRef, {
          published: true,
          publishedAt: new Date().toISOString()
        });
      }

      setSuccess('Results published successfully!');
    } catch (error: any) {
      console.error('Error publishing results:', error);
      setError(error.message || 'Failed to publish results');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold gradient-text mb-6">
          {isFinanceAdmin ? 'Finance Dashboard' : 'Admin Dashboard'}
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 text-green-400 rounded-lg flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </motion.div>
        )}

        {/* Publish Results Button */}
        <div className="flex justify-end mb-8">
          <motion.button
            onClick={publishResults}
            disabled={publishing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white flex items-center"
          >
            {publishing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Publish Results
              </>
            )}
          </motion.button>
        </div>

        {/* Submissions List */}
        <div className="grid gap-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No submissions yet.
            </div>
          ) : (
            submissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl p-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{submission.teamName}</h3>
                    <div className="space-y-2 text-gray-300">
                      <p className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Team Lead: {submission.teamLeadName}
                      </p>
                      <p className="flex items-center">
                        <School className="w-5 h-5 mr-2" />
                        College: {submission.collegeName}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        WhatsApp: {submission.whatsappNumber}
                      </p>
                      <p className="text-purple-400">
                        Registration ID: {submission.registrationId}
                      </p>
                      <p className="text-gray-400">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Project Details</h4>
                    <p className="text-gray-300 mb-2">{submission.productDescription}</p>
                    <p className="text-gray-300 mb-4">{submission.solution}</p>
                    <div className="flex space-x-4">
                      {submission.fileUrl && (
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          <FileText className="w-5 h-5 mr-2" />
                          View Document
                        </a>
                      )}
                      {submission.youtubeLink && (
                        <a
                          href={submission.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 flex items-center"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Watch Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scoring Section */}
                <div className="mt-6 pt-6 border-t border-purple-500/20">
                  {editingScore === submission.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Score (0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scoreData.points}
                          onChange={(e) => setScoreData({ ...scoreData, points: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 bg-white/5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Review Comments</label>
                        <textarea
                          value={scoreData.review}
                          onChange={(e) => setScoreData({ ...scoreData, review: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setEditingScore(null)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleScoreSubmit(submission.id)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
                        >
                          Save Score
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        {submission.points !== undefined ? (
                          <div className="space-y-2">
                            <p className="text-lg">
                              <span className="text-gray-300">Score: </span>
                              <span className="text-purple-400 font-bold">{submission.points}/100</span>
                            </p>
                            <p className="text-gray-300">
                              <span className="font-semibold">Review: </span>
                              {submission.review}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Reviewed: {submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleString() : 'Not reviewed'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400">Not scored yet</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingScore(submission.id);
                          setScoreData({
                            points: submission.points || 0,
                            review: submission.review || ''
                          });
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {submission.points !== undefined ? 'Edit Score' : 'Add Score'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
