import { useState } from 'react';
import axios from 'axios';

export default function ActivitiesCerts() {
  const [htNo, setHtNo] = useState("");
  
  // States for our two new tables
  const [certifications, setCertifications] = useState([{ courseName: "", issuer: "", date: "" }]);
  const [activities, setActivities] = useState([{ eventName: "", role: "", date: "" }]);

  // Handlers to add new rows
  const handleAddCert = () => setCertifications([...certifications, { courseName: "", issuer: "", date: "" }]);
  const handleAddActivity = () => setActivities([...activities, { eventName: "", role: "", date: "" }]);

  // Handlers to update text in the rows
  const handleCertChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };
  
  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  // 🔍 The Search Function
  const handleSearch = async () => {
    if (!htNo) return alert("⚠️ Please enter a Hall Ticket Number to search!");

    try {
      const response = await axios.get(`https://mlrit-counseling-portal.onrender.com/api/students/${htNo}`);
      
      if (response.data.certifications?.length > 0) setCertifications(response.data.certifications);
      if (response.data.activities?.length > 0) setActivities(response.data.activities);
      
      alert("Activities & Certifications loaded successfully! 📥");
    } catch (error) {
      console.error("Search Error:", error);
      alert("❌ Student not found in the database!");
    }
  };

  // 💾 The Save Function
  const handleSaveData = async () => {
    if (!htNo) return alert("⚠️ Please enter the student's Hall Ticket Number first!");

    try {
      await axios.post('https://mlrit-counseling-portal.onrender.com/api/students/save', {
        htNo: htNo,
        certifications: certifications,
        activities: activities
      });
      alert("Activities & Certifications Saved Successfully! 🏆✅");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save. Check if your backend is running!");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800">Activities & Certs</h2>
          <p className="text-slate-400 font-medium">Co-curricular & Extra-curricular Records</p>
        </div>
        <button onClick={handleSaveData} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-black shadow-xl hover:-translate-y-1 transition-all">
          💾 Save Records
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card mb-8 p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-orange-500 bg-orange-50/30">
        <label className="font-bold text-slate-700">🔍 Fetch Student Records:</label>
        <div className="flex w-full md:w-auto gap-2">
          <input type="text" value={htNo} onChange={(e) => setHtNo(e.target.value)} placeholder="Enter HT No. (e.g. 24R21A0501)" className="input-field flex-1 md:w-64" />
          <button onClick={handleSearch} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors">Search</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table 1: Certifications */}
        <div className="glass-card overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700">🏆 Technical Certifications</h3>
            <button onClick={handleAddCert} className="text-sm bg-slate-800 text-white px-3 py-1 rounded font-bold">+ Add Row</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-black text-slate-400 uppercase border-b-2 border-slate-100">
                <th className="p-2">Course / Cert Name</th>
                <th className="p-2">Issued By</th>
                <th className="p-2">Date/Year</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((row, index) => (
                <tr key={index} className="border-b border-slate-50">
                  <td className="p-2"><input value={row.courseName} onChange={(e) => handleCertChange(index, 'courseName', e.target.value)} placeholder="e.g. React Basics" className="w-full p-2 rounded bg-white border border-slate-200" /></td>
                  <td className="p-2"><input value={row.issuer} onChange={(e) => handleCertChange(index, 'issuer', e.target.value)} placeholder="Coursera" className="w-full p-2 rounded bg-white border border-slate-200" /></td>
                  <td className="p-2"><input type="text" value={row.date} onChange={(e) => handleCertChange(index, 'date', e.target.value)} placeholder="Oct 2025" className="w-24 p-2 rounded bg-white border border-slate-200" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 2: Activities */}
        <div className="glass-card overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700">🎯 Co-Curricular Activities</h3>
            <button onClick={handleAddActivity} className="text-sm bg-slate-800 text-white px-3 py-1 rounded font-bold">+ Add Row</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-black text-slate-400 uppercase border-b-2 border-slate-100">
                <th className="p-2">Event Name</th>
                <th className="p-2">Role / Position</th>
                <th className="p-2">Date/Year</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((row, index) => (
                <tr key={index} className="border-b border-slate-50">
                  <td className="p-2"><input value={row.eventName} onChange={(e) => handleActivityChange(index, 'eventName', e.target.value)} placeholder="e.g. Hackathon" className="w-full p-2 rounded bg-white border border-slate-200" /></td>
                  <td className="p-2"><input value={row.role} onChange={(e) => handleActivityChange(index, 'role', e.target.value)} placeholder="Participant" className="w-full p-2 rounded bg-white border border-slate-200" /></td>
                  <td className="p-2"><input type="text" value={row.date} onChange={(e) => handleActivityChange(index, 'date', e.target.value)} placeholder="Nov 2025" className="w-24 p-2 rounded bg-white border border-slate-200" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}