import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, BookOpen } from 'lucide-react';

const API_URL = "https://mlrit-counseling-portal.onrender.com"; // Your live backend

export default function PerformanceEntry() {
  const [loading, setLoading] = useState(false);
  
  // 🌟 The complex state matching your new backend schema
  const [academicRecords, setAcademicRecords] = useState([
    {
      semesterName: "I-Year I-Semester",
      cumulativeMonthlyAttendance: "",
      cumulativeSemesterAttendance: "",
      totalPercentageMarks: "",
      subjects: [
        { 
          subjectCodeAndName: "", 
          attendance: { 
            month1: { name: "Sep", percentage: "" }, 
            month2: { name: "Oct", percentage: "" }, 
            month3: { name: "Nov", percentage: "" }, 
            month4: { name: "Dec", percentage: "" } 
          },
          cie1: "", cie2: "", viva: "", cieAvg: "", univMarks: "", totalMarks: "", grade: "" 
        }
      ]
    }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const htNo = localStorage.getItem('studentHtNo');
      if (!htNo) return;

      const response = await axios.get(`${API_URL}/api/students/${htNo}`);
      
      // If the student already has records saved, load them into the grid
      if (response.data && response.data.academicRecords && response.data.academicRecords.length > 0) {
        setAcademicRecords(response.data.academicRecords);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("New student, starting with empty grid.");
      } else {
        toast.error("Failed to load existing records.");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving performance records...");
    
    try {
      const htNo = localStorage.getItem('studentHtNo');
      const payload = { academicRecords };

      await axios.put(`${API_URL}/api/students/${htNo}`, payload);
      toast.success("Records saved successfully! 💾", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save records. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // --- Grid State Handlers ---
  const handleSubjectChange = (semIndex, subIndex, field, value) => {
    const newRecords = [...academicRecords];
    newRecords[semIndex].subjects[subIndex][field] = value;
    setAcademicRecords(newRecords);
  };

  const handleAttendanceChange = (semIndex, subIndex, monthKey, value) => {
    const newRecords = [...academicRecords];
    newRecords[semIndex].subjects[subIndex].attendance[monthKey].percentage = value;
    setAcademicRecords(newRecords);
  };

  const addSubjectRow = (semIndex) => {
    const newRecords = [...academicRecords];
    newRecords[semIndex].subjects.push({
      subjectCodeAndName: "", 
      attendance: { 
        month1: { name: "Sep", percentage: "" }, 
        month2: { name: "Oct", percentage: "" }, 
        month3: { name: "Nov", percentage: "" }, 
        month4: { name: "Dec", percentage: "" } 
      },
      cie1: "", cie2: "", viva: "", cieAvg: "", univMarks: "", totalMarks: "", grade: ""
    });
    setAcademicRecords(newRecords);
  };

  const removeSubjectRow = (semIndex, subIndex) => {
    const newRecords = [...academicRecords];
    newRecords[semIndex].subjects.splice(subIndex, 1);
    setAcademicRecords(newRecords);
  };

  return (
    <div className="animate-fade-in pb-20">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <BookOpen className="text-[#1a4d2e]" size={32} />
            Performance Record
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage attendance and CIE/University marks.</p>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-[#1a4d2e] hover:bg-green-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20 active:scale-95 disabled:opacity-50"
        >
          <Save size={20} /> {loading ? "Saving..." : "Save All Records"}
        </button>
      </div>

      {academicRecords.map((semester, semIndex) => (
        <div key={semIndex} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-10">
          
          {/* Semester Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
            <input 
              type="text" 
              value={semester.semesterName}
              onChange={(e) => {
                const newRecords = [...academicRecords];
                newRecords[semIndex].semesterName = e.target.value;
                setAcademicRecords(newRecords);
              }}
              className="text-xl font-black text-slate-800 bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-[#1a4d2e] outline-none transition-colors w-64"
            />
          </div>

          {/* Excel-like Grid Wrapper (Scrolls horizontally on small screens) */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-black tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200">Subject Code & Name</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center bg-blue-50/50" colSpan="4">(%) Attendance</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center bg-orange-50/50" colSpan="4">CIE Exam Marks</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center bg-green-50/50">Univ</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center">Total</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center">Grade</th>
                  <th className="px-2 py-3 border-b border-slate-200"></th>
                </tr>
                <tr className="text-[10px] text-slate-400 border-b border-slate-200">
                  <th className="px-4 py-2 border-r border-slate-100"></th>
                  {/* Attendance Sub-headers */}
                  <th className="px-2 py-2 text-center bg-blue-50/30">Sep</th>
                  <th className="px-2 py-2 text-center bg-blue-50/30">Oct</th>
                  <th className="px-2 py-2 text-center bg-blue-50/30">Nov</th>
                  <th className="px-2 py-2 text-center border-r border-slate-100 bg-blue-50/30">Dec</th>
                  {/* CIE Sub-headers */}
                  <th className="px-2 py-2 text-center bg-orange-50/30">CIE-I (35)</th>
                  <th className="px-2 py-2 text-center bg-orange-50/30">CIE-II (35)</th>
                  <th className="px-2 py-2 text-center bg-orange-50/30">VIVA (5)</th>
                  <th className="px-2 py-2 text-center border-r border-slate-100 bg-orange-50/30">AVG (40)</th>
                  
                  <th className="px-2 py-2 text-center border-r border-slate-100 bg-green-50/30">(60M)</th>
                  <th className="px-2 py-2 text-center border-r border-slate-100">(100M)</th>
                  <th className="px-2 py-2 text-center border-r border-slate-100"></th>
                  <th></th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {semester.subjects.map((subject, subIndex) => (
                  <tr key={subIndex} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Subject Name Input */}
                    <td className="px-2 py-1 border-r border-slate-100">
                      <input 
                        type="text" placeholder="e.g. A6BS02 (PPS)"
                        value={subject.subjectCodeAndName}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'subjectCodeAndName', e.target.value)}
                        className="w-full p-2 bg-transparent outline-none focus:bg-white focus:ring-2 ring-[#1a4d2e]/20 rounded"
                      />
                    </td>

                    {/* Attendance Inputs */}
                    {['month1', 'month2', 'month3', 'month4'].map((month) => (
                      <td key={month} className="px-1 py-1 bg-blue-50/10">
                        <input 
                          type="text" placeholder="%"
                          value={subject.attendance[month].percentage}
                          onChange={(e) => handleAttendanceChange(semIndex, subIndex, month, e.target.value)}
                          className="w-12 p-2 text-center bg-transparent outline-none focus:bg-white focus:ring-2 ring-blue-400/20 rounded font-medium text-slate-700"
                        />
                      </td>
                    ))}

                    {/* CIE Inputs */}
                    <td className="px-1 py-1 border-l border-slate-100 bg-orange-50/10"><input type="text" value={subject.cie1} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'cie1', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none focus:bg-white focus:ring-2 ring-orange-400/20 rounded font-medium" /></td>
                    <td className="px-1 py-1 bg-orange-50/10"><input type="text" value={subject.cie2} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'cie2', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none focus:bg-white focus:ring-2 ring-orange-400/20 rounded font-medium" /></td>
                    <td className="px-1 py-1 bg-orange-50/10"><input type="text" value={subject.viva} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'viva', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none focus:bg-white focus:ring-2 ring-orange-400/20 rounded font-medium" /></td>
                    <td className="px-1 py-1 bg-orange-50/10 border-r border-slate-100"><input type="text" value={subject.cieAvg} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'cieAvg', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none font-bold text-[#1a4d2e] focus:bg-white rounded" /></td>

                    {/* Final Marks Inputs */}
                    <td className="px-1 py-1 bg-green-50/10 border-r border-slate-100"><input type="text" value={subject.univMarks} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'univMarks', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none focus:bg-white rounded font-medium" /></td>
                    <td className="px-1 py-1 border-r border-slate-100"><input type="text" value={subject.totalMarks} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'totalMarks', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none font-bold text-slate-800 focus:bg-white rounded" /></td>
                    <td className="px-1 py-1 border-r border-slate-100"><input type="text" value={subject.grade} onChange={(e) => handleSubjectChange(semIndex, subIndex, 'grade', e.target.value)} className="w-12 p-2 text-center bg-transparent outline-none font-black text-blue-600 uppercase focus:bg-white rounded" /></td>
                    
                    {/* Delete Row Button */}
                    <td className="px-2 py-1 text-center">
                      <button onClick={() => removeSubjectRow(semIndex, subIndex)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button 
              onClick={() => addSubjectRow(semIndex)}
              className="text-sm font-bold text-[#1a4d2e] flex items-center gap-2 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} /> Add Subject Row
            </button>
          </div>

        </div>
      ))}
      
    </div>
  );
}