import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp, BookOpen, Star } from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { PageHeader, StatTile, ProgressRing, EmptyState } from './ui';

const INK = '#1a4d2e';
const ACCENT = '#d67b27';
const GRID = 'rgba(16,32,22,0.07)';
const AXIS = { fontSize: 11, fill: '#94a3b8', fontWeight: 500 };

// One tooltip style for both charts — a small material chip, not a browser box
const tooltipStyle = {
  contentStyle: {
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(16,32,22,0.08)',
    borderRadius: 12,
    boxShadow: '0 8px 24px -12px rgba(16,32,22,0.3)',
    fontSize: 12,
    padding: '8px 12px',
  },
  labelStyle: { fontWeight: 600, color: '#0f172a', marginBottom: 2 },
  cursor: { fill: 'rgba(16,32,22,0.04)' },
};

export default function Analytics() {
  const [chartData, setChartData] = useState([]);
  const [avgAttendance, setAvgAttendance] = useState(0);

  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    if (loggedInHtNo) {
      axios.get(`https://mlrit-counseling-portal.onrender.com/api/students/${loggedInHtNo}`)
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
            toast.success("Performance charts updated!", { id: 'analytics-load' });
          }
        })
        .catch(err => console.error("Error loading analytics", err));
    }
  }, []);

  const marksAvg = chartData.length
    ? Math.round(chartData.reduce((s, d) => s + d.totalMarks, 0) / chartData.length)
    : 0;
  const best = chartData.reduce((a, b) => (b.totalMarks > (a?.totalMarks ?? -1) ? b : a), null);

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader title="Analytics" subtitle="Real-time performance tracking" />

      {chartData.length > 0 ? (
        <div className="space-y-5">
          {/* Overview: the ring carries the headline number, tiles carry the rest */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card p-6 flex flex-col items-center justify-center">
              <ProgressRing value={avgAttendance} label="attendance" />
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-center">
              <StatTile label="Subjects" value={chartData.length} tone="blue" icon={<BookOpen size={15} />} />
              <StatTile label="Avg marks" value={marksAvg} unit="/100" tone="orange" icon={<TrendingUp size={15} />} />
              <div className="card p-5 col-span-2 flex items-center gap-4">
                <span className="tile-lg t-violet"><Star size={22} /></span>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase" style={{ letterSpacing: '0.07em' }}>
                    Strongest subject
                  </span>
                  <p className="mt-1 text-xl font-bold text-slate-900 truncate" style={{ letterSpacing: '-0.025em' }}>
                    {best?.subject || '—'}
                  </p>
                  <p className="text-sm text-slate-500">{best?.totalMarks ?? 0} / 100</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="tile-icon t-green"><BarChart3 size={15} /></span>
              <div>
                <h4 className="font-semibold text-slate-900 leading-tight">Attendance by subject</h4>
                <p className="text-sm text-slate-400">Percentage of classes attended</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3f9a63" />
                      <stop offset="100%" stopColor={INK} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="subject" tick={AXIS} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="attendance" fill="url(#bar-grad)" radius={[8, 8, 4, 4]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="tile-icon t-orange"><TrendingUp size={15} /></span>
              <div>
                <h4 className="font-semibold text-slate-900 leading-tight">Marks trend</h4>
                <p className="text-sm text-slate-400">Total marks out of 100</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="subject" tick={AXIS} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={AXIS} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area
                    type="monotone" dataKey="totalMarks" stroke={ACCENT} strokeWidth={2.5}
                    fill="url(#area-grad)"
                    dot={{ r: 4, fill: '#fff', stroke: ACCENT, strokeWidth: 2.5 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<BarChart3 size={22} />}
          title="Nothing to chart yet"
          hint="Enter your attendance and marks in the Records tab — your charts will build themselves from that data."
        />
      )}
    </div>
  );
}
