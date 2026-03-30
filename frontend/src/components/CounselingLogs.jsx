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
      toast.success("Counseling record added successfully! ✅", { id: toastId });

    } catch (error) {
      toast.error("Failed to save record.", { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800">My Counseling History</h2>
        <p className="text-slate-400 font-medium">Add and view your interactions with faculty</p>
      </div>

      {/* 🌟 FORM SECTION: Where students add their logs */}
      <div className="glass-card p-10 mb-10 border-t-8 border-[#1a4d2e]">
        <h3 className="text-[#1a4d2e] font-black uppercase tracking-widest text-sm mb-6 border-b pb-2">Record New Session</h3>
        
        <form onSubmit={handleAddLog} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Date of Session</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  value={newLog.date}
                  onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1a4d2e] outline-none font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Counselor / Faculty Name</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Dr. K. Srinivas"
                  value={newLog.counselor}
                  onChange={(e) => setNewLog({...newLog, counselor: e.target.value})}
                  className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1a4d2e] outline-none font-bold text-slate-700"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 block">Remarks / Discussion Points</label>
            <div className="relative">
              <FileText className="absolute left-4 top-6 text-slate-400" size={18} />
              <textarea 
                placeholder="What was discussed during the counseling session?"
                value={newLog.remarks}
                onChange={(e) => setNewLog({...newLog, remarks: e.target.value})}
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1a4d2e] outline-none min-h-[120px] font-medium text-slate-700 resize-none"
                required
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-[#1a4d2e] text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
              <Save size={20} /> Save Counseling Record
            </button>
          </div>
        </form>
      </div>

      {/* 🌟 TABLE SECTION: Where past logs are displayed */}
      <div className="glass-card overflow-x-auto bg-white shadow-xl border border-slate-100">
        {logs.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-black text-slate-400 uppercase border-b-2 border-slate-100 bg-slate-50">
                <th className="p-6 w-1/6">Date</th>
                <th className="p-6 w-1/4">Counselor</th>
                <th className="p-6">Remarks / Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice().reverse().map((log, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-bold text-slate-600">{log.date}</td>
                  <td className="p-6 font-black text-[#1a4d2e]">{log.counselor}</td>
                  <td className="p-6 text-slate-600 font-medium">"{log.remarks}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-16 text-center text-slate-400 font-bold bg-white rounded-b-[2rem]">
            No counseling records found. Add your first one above!
          </div>
        )}
      </div>
    </div>
  );
}