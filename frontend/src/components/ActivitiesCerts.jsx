import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, Award, Target, Plus, Trash2, Building2, CalendarDays, UserCircle } from 'lucide-react';
import { PageHeader, Segmented, ListGroup, Field, EmptyState } from './ui';
import { uiSpring } from '../motion';

const API = "https://mlrit-counseling-portal.onrender.com";

const BLANK = {
  certifications: { courseName: "", issuer: "", date: "" },
  activities: { eventName: "", role: "", date: "" },
};

export default function ActivitiesCerts() {
  const [htNo, setHtNo] = useState("");
  const [tab, setTab] = useState('certifications');
  const [saving, setSaving] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [activities, setActivities] = useState([]);

  // Loads the logged-in student's own records, same as every other tab
  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    if (!loggedInHtNo) {
      toast.error("No student logged in. Please log in again.");
      return;
    }
    setHtNo(loggedInHtNo);

    axios.get(`${API}/api/students/${loggedInHtNo}`)
      .then(({ data }) => {
        if (data.certifications?.length) setCertifications(data.certifications);
        if (data.activities?.length) setActivities(data.activities);
      })
      .catch((error) => {
        if (error.response?.status !== 404) {
          console.error("Load error:", error);
          toast.error("Failed to load your records.");
        }
      });
  }, []);

  const handleSaveData = async () => {
    if (!htNo) return toast.error("No student logged in.");

    setSaving(true);
    const toastId = toast.loading("Saving records...");
    try {
      await axios.post(`${API}/api/students/save`, { htNo, certifications, activities });
      toast.success("Records saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save. Check if your backend is running.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const isCerts = tab === 'certifications';
  const rows = isCerts ? certifications : activities;
  const setRows = isCerts ? setCertifications : setActivities;

  const addRow = () => setRows([...rows, { ...BLANK[tab] }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    setRows(rows.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const fields = isCerts
    ? [
        { key: 'courseName', label: 'Course', placeholder: 'React Basics', icon: <Award size={15} />, tone: 'orange' },
        { key: 'issuer', label: 'Issued by', placeholder: 'Coursera', icon: <Building2 size={15} />, tone: 'blue' },
        { key: 'date', label: 'Date', placeholder: 'Oct 2025', icon: <CalendarDays size={15} />, tone: 'violet' },
      ]
    : [
        { key: 'eventName', label: 'Event', placeholder: 'Hackathon', icon: <Target size={15} />, tone: 'green' },
        { key: 'role', label: 'Role', placeholder: 'Participant', icon: <UserCircle size={15} />, tone: 'teal' },
        { key: 'date', label: 'Date', placeholder: 'Nov 2025', icon: <CalendarDays size={15} />, tone: 'violet' },
      ];

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title="Achievements"
        subtitle={`${certifications.length} certifications · ${activities.length} activities`}
        actions={
          <button
            onClick={handleSaveData}
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer
                       flex items-center gap-2 disabled:opacity-50 active:scale-95 hover:bg-primary-hover
                       transition-[background-color,transform] duration-100"
          >
            <Save size={17} /> {saving ? 'Saving…' : 'Save'}
          </button>
        }
      />

      <div className="max-w-md mb-6">
        <Segmented
          value={tab}
          onChange={setTab}
          layoutId="achievements-tab"
          options={[
            { value: 'certifications', label: 'Certifications' },
            { value: 'activities', label: 'Activities' },
          ]}
        />
      </div>

      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={uiSpring}
              className="relative"
            >
              <ListGroup>
                {fields.map((f) => (
                  <Field
                    key={f.key}
                    icon={f.icon}
                    tone={f.tone}
                    label={f.label}
                    placeholder={f.placeholder}
                    value={row[f.key] || ''}
                    onChange={(e) => update(i, f.key, e.target.value)}
                  />
                ))}
              </ListGroup>
              <button
                onClick={() => removeRow(i)}
                className="icon-btn absolute -top-1 -right-1 bg-white border border-slate-900/10 hover:!text-red-500"
                aria-label="Remove entry"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}

          <button
            onClick={addRow}
            className="btn-ghost !justify-start text-primary"
          >
            <Plus size={18} /> Add {isCerts ? 'certification' : 'activity'}
          </button>
        </div>
      ) : (
        <EmptyState
          icon={isCerts ? <Award size={22} /> : <Target size={22} />}
          title={`No ${isCerts ? 'certifications' : 'activities'} yet`}
          hint={isCerts
            ? "Courses and technical certifications you've completed will be listed here."
            : "Hackathons, sports, clubs and events you've taken part in will be listed here."}
          action={
            <button onClick={addRow} className="btn-primary !w-auto px-6">
              <Plus size={18} /> Add {isCerts ? 'certification' : 'activity'}
            </button>
          }
        />
      )}
    </div>
  );
}
