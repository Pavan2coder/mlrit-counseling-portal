import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Save, CalendarDays, UserCheck, FileText } from 'lucide-react';
import { PageHeader, Sheet, ListGroup, Field, AreaField, EmptyState } from './ui';
import { uiSpring } from '../motion';

const API = "https://mlrit-counseling-portal.onrender.com";
const today = () => new Date().toISOString().split('T')[0];

export default function CounselingLogs() {
  const [htNo, setHtNo] = useState("");
  const [logs, setLogs] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLog, setNewLog] = useState({ date: today(), counselor: '', remarks: '' });

  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    if (loggedInHtNo) {
      setHtNo(loggedInHtNo);
      fetchLogs(loggedInHtNo);
    }
  }, []);

  const fetchLogs = async (rollNo) => {
    try {
      const response = await axios.get(`${API}/api/students/${rollNo}`);
      if (response.data.interactionLogs) setLogs(response.data.interactionLogs);
    } catch (err) {
      console.error("Error loading logs", err);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving counseling record...");

    try {
      const res = await axios.get(`${API}/api/students/${htNo}`);
      const student = res.data;

      const logEntry = { date: newLog.date, counselor: newLog.counselor, remarks: newLog.remarks };
      const updatedLogs = student.interactionLogs ? [...student.interactionLogs, logEntry] : [logEntry];

      await axios.put(`${API}/api/students/${htNo}`, { ...student, interactionLogs: updatedLogs });

      setLogs(updatedLogs);
      setNewLog({ date: today(), counselor: '', remarks: '' });
      setSheetOpen(false);
      toast.success("Counseling record added successfully!", { id: toastId });
    } catch (err) {
      console.error("Save log error:", err);
      toast.error("Failed to save record.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const bind = (k) => ({ value: newLog[k], onChange: (e) => setNewLog({ ...newLog, [k]: e.target.value }) });
  const ordered = logs.slice().reverse();

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title="Counseling"
        subtitle={`${logs.length} recorded ${logs.length === 1 ? 'session' : 'sessions'}`}
        actions={
          <button
            onClick={() => setSheetOpen(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer
                       flex items-center gap-2 active:scale-95 hover:bg-primary-hover
                       transition-[background-color,transform] duration-100"
          >
            <Plus size={17} /> Add
          </button>
        }
      />

      {ordered.length > 0 ? (
        <div className="relative pl-8">
          {/* The spine: one continuous line so the sessions read as a sequence */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-900/10" />

          {ordered.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...uiSpring, delay: Math.min(index * 0.04, 0.3) }}
              className="relative mb-4"
            >
              <span className="absolute -left-[2.15rem] top-5 h-[17px] w-[17px] rounded-full t-green
                               ring-4 ring-canvas" />
              <div className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="tile-icon t-violet"><UserCheck size={15} /></span>
                    <p className="font-semibold text-slate-900 truncate">{log.counselor || 'Counselor'}</p>
                  </div>
                  <time className="text-xs font-medium text-slate-400 tabular-nums">{log.date}</time>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.remarks}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MessageSquare size={22} />}
          title="No counseling sessions yet"
          hint="Record a session after meeting your faculty counselor, and it'll appear here as a timeline."
          action={
            <button onClick={() => setSheetOpen(true)} className="btn-primary !w-auto px-6">
              <Plus size={18} /> Record first session
            </button>
          }
        />
      )}

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Record a session"
        footer={
          <button
            type="submit"
            form="log-form"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving…' : 'Save session'}
          </button>
        }
      >
        <form id="log-form" onSubmit={handleAddLog}>
          <ListGroup>
            <Field icon={<CalendarDays size={15} />} tone="blue" label="Date" type="date" required {...bind('date')} />
            <Field icon={<UserCheck size={15} />} tone="violet" label="Counselor" placeholder="Dr. K. Srinivas" required {...bind('counselor')} />
            <AreaField icon={<FileText size={15} />} tone="orange" label="Remarks" rows="4" placeholder="What was discussed?" required {...bind('remarks')} />
          </ListGroup>
        </form>
      </Sheet>
    </div>
  );
}
