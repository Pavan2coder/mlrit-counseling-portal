import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, UserCheck, Calendar, FileText } from 'lucide-react';

export default function CounselingLogs() {
  const [htNo, setHtNo] = useState("");
  const [logs, setLogs] = useState([]);
  
  // State for the new log the student is typing
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0], // Defaults to today's date
    counselor: '',
    remarks: ''
  });

  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    if (loggedInHtNo) {
      setHtNo(loggedInHtNo);
      fetchLogs(loggedInHtNo);
    }
  }, []);

  const fetchLogs = async (rollNo) => {
    try {
      const response = await axios.get(`https://mlrit-counseling-portal.onrender.com/api/students/${rollNo}`);
      if (response.data.interactionLogs) {
        setLogs(response.data.interactionLogs);
      }
    } catch (err) {
      console.error("Error loading logs", err);
    }
  };

  // 🌟 The function to submit the new log
  const handleAddLog = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving counseling record...");

    try {
      // 1. Get the student's current data from the database
      const res = await axios.get(`https://mlrit-counseling-portal.onrender.com/api/students/${htNo}`);
      const student = res.data;

      // 2. Format the new log entry
      const logEntry = {
        date: newLog.date,
        counselor: newLog.counselor,
        remarks: newLog.remarks
      };

      // 3. Add the new log to their existing history
      const updatedLogs = student.interactionLogs ? [...student.interactionLogs, logEntry] : [logEntry];

      // 4. Send the update to MongoDB
      await axios.put(`https://mlrit-counseling-portal.onrender.com/api/students/${htNo}`, {
        ...student,
        interactionLogs: updatedLogs
      });

      // 5. Update the screen and clear the form
      setLogs(updatedLogs);
      setNewLog({ date: new Date().toISOString().split('T')[0], counselor: '', remarks: '' });
      toast.success("Counseling record added successfully!", { id: toastId });

    } catch (error) {
      toast.error("Failed to save record.", { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Counseling History</h2>
        <p className="text-slate-500 mt-1">Add and view your interactions with faculty</p>
      </div>

      {/* 🌟 FORM SECTION: Where students add their logs */}
      <div className="card p-6 md:p-8 mb-8 border-t-4 border-primary">
        <h3 className="text-primary font-semibold uppercase tracking-wider text-xs mb-6 border-b border-slate-200 pb-3">Record New Session</h3>

        <form onSubmit={handleAddLog} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-text">Date of Session</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text">Counselor / Faculty Name</label>
              <div className="relative">
                <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Dr. K. Srinivas"
                  value={newLog.counselor}
                  onChange={(e) => setNewLog({...newLog, counselor: e.target.value})}
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label-text">Remarks / Discussion Points</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <textarea
                placeholder="What was discussed during the counseling session?"
                value={newLog.remarks}
                onChange={(e) => setNewLog({...newLog, remarks: e.target.value})}
                className="input-field pl-11 min-h-[120px] resize-none"
                required
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer">
              <Save size={18} /> Save Counseling Record
            </button>
          </div>
        </form>
      </div>

      {/* 🌟 TABLE SECTION: Where past logs are displayed */}
      <div className="card overflow-x-auto">
        {logs.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200 bg-slate-50/60">
                <th className="p-5 w-1/6">Date</th>
                <th className="p-5 w-1/4">Counselor</th>
                <th className="p-5">Remarks / Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice().reverse().map((log, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 font-medium text-slate-600">{log.date}</td>
                  <td className="p-5 font-semibold text-primary">{log.counselor}</td>
                  <td className="p-5 text-slate-600">"{log.remarks}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-16 text-center text-slate-400">
            No counseling records found. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}