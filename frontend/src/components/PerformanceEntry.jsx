import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PerformanceEntry() {
  // 🌟 State to hold the student's ID from memory
  const [htNo, setHtNo] = useState("");

  // State for the Table Rows
  const [subjects, setSubjects] = useState([
    { subjectName: "", month: "", attendance: "", cie1: "", cie2: "", viva: "", cieAvg: "", univMarks: "", totalMarks: "" }
  ]);

  // 🌟 NEW: Auto-Load functionality
  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    
    if (loggedInHtNo) {
      setHtNo(loggedInHtNo);

      // Automatically fetch marks for this specific student
      axios.get(`http://localhost:8000/api/students/${loggedInHtNo}`)
        .then(response => {
          if (response.data.academicRecord && response.data.academicRecord.length > 0) {
            setSubjects(response.data.academicRecord);
            toast.success("Academic records loaded! 📚");
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            toast.success("No records found. You can start entering your marks! ✨");
          } else {
            console.error("Auto-fetch error:", error);
            toast.error("Failed to load academic records.");
          }
        });
    }
  }, []);

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: "", month: "", attendance: "", cie1: "", cie2: "", viva: "", cieAvg: "", univMarks: "", totalMarks: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleSaveData = async () => {
    if (!htNo) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const toastId = toast.loading('Saving your performance data...');

    try {
      await axios.post('http://localhost:8000/api/students/save', {
        htNo: htNo,
        academicRecord: subjects
      });
      toast.success("Academic Record Saved! 🎓✅", { id: toastId });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save data. Check your connection.", { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800">Performance Entry</h2>
          <p className="text-slate-400 font-medium">Your Academic Record (Pages 10 & 11)</p>
        </div>
        <div className="flex gap-4 print:hidden">
          <button onClick={handleAddSubject} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:-translate-y-1 transition-all cursor-pointer">
            + Add Subject
          </button>
          <button onClick={handleSaveData} className="bg-green-500 text-white px-8 py-3 rounded-xl font-black shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
            💾 Save My Marks
          </button>
        </div>
      </div>

      {/* The Table Section */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-black text-slate-400 uppercase border-b-2 border-slate-100">
              <th className="p-4">Subject Code & Name</th>
              <th className="p-4">Month</th>
              <th className="p-4">Attnd %</th>
              <th className="p-4">CIE-I (35)</th>
              <th className="p-4">CIE-II (35)</th>
              <th className="p-4">Viva (5)</th>
              <th className="p-4">CIE Avg (40)</th>
              <th className="p-4">Univ (60)</th>
              <th className="p-4 text-green-600 font-bold">Total (100)</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((row, index) => (
              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-2"><input value={row.subjectName} onChange={(e) => handleChange(index, 'subjectName', e.target.value)} className="w-full p-2 rounded bg-white border border-slate-200" placeholder="e.g. Python" /></td>
                <td className="p-2"><input value={row.month} onChange={(e) => handleChange(index, 'month', e.target.value)} className="w-full p-2 rounded bg-white border border-slate-200" placeholder="Jan" /></td>
                <td className="p-2"><input type="number" value={row.attendance} onChange={(e) => handleChange(index, 'attendance', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.cie1} onChange={(e) => handleChange(index, 'cie1', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.cie2} onChange={(e) => handleChange(index, 'cie2', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.viva} onChange={(e) => handleChange(index, 'viva', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.cieAvg} onChange={(e) => handleChange(index, 'cieAvg', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.univMarks} onChange={(e) => handleChange(index, 'univMarks', e.target.value)} className="w-16 p-2 rounded bg-white border border-slate-200" /></td>
                <td className="p-2"><input type="number" value={row.totalMarks} onChange={(e) => handleChange(index, 'totalMarks', e.target.value)} className="w-16 p-2 rounded bg-green-50 border border-green-200 font-bold text-green-700" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}