import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function Analytics() {
  const [chartData, setChartData] = useState([]);
  const [avgAttendance, setAvgAttendance] = useState(0);

  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    if (loggedInHtNo) {
      axios.get(`http://localhost:8000/api/students/${loggedInHtNo}`)
        .then(response => {
          const student = response.data;
          if (student.academicRecord && student.academicRecord.length > 0) {
            const formattedData = student.academicRecord.map(record => ({
              subject: record.subjectName || "N/A",
              attendance: parseInt(record.attendance) || 0,
              totalMarks: parseInt(record.totalMarks) || 0
            }));
            
            const totalAtt = formattedData.reduce((sum, item) => sum + item.attendance, 0);
            setAvgAttendance(Math.round(totalAtt / formattedData.length));
            setChartData(formattedData);
            toast.success("Performance charts updated! 📈");
          }
        })
        .catch(err => console.error("Error loading analytics", err));
    }
  }, []);

  const pieData = [{ name: 'Attended', value: avgAttendance }, { name: 'Missed', value: 100 - avgAttendance }];
  const PIE_COLORS = ['#8b5cf6', '#f1f5f9'];

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800">My Analytics</h2>
        <p className="text-slate-400 font-medium">Real-time performance tracking</p>
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-slate-600 mb-6">Subject Attendance</h4>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="subject"/><YAxis domain={[0, 100]}/><Tooltip/><Bar dataKey="attendance" fill="#8b5cf6" radius={[4, 4, 0, 0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-slate-600 mb-6">Marks Trend</h4>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><XAxis dataKey="subject"/><YAxis domain={[0, 100]}/><Tooltip/><Line type="monotone" dataKey="totalMarks" stroke="#10b981" strokeWidth={3}/></LineChart></ResponsiveContainer></div>
            </div>
          </div>

          <div className="glass-card p-6 max-w-xs mx-auto text-center relative">
            <h4 className="font-bold text-slate-600 mb-2">Overall Attendance</h4>
            <div className="h-48 relative flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div className="absolute text-2xl font-black text-purple-600">{avgAttendance}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-20 text-center text-slate-400">Enter your marks in the Performance tab to see your charts!</div>
      )}
    </div>
  );
}