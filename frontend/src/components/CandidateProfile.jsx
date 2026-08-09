import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Printer, Save, User, Hash, GitBranch, CalendarDays, Cake, Droplet,
  GraduationCap, Trophy, Gauge, HeartPulse, Pill, Mail, Phone, MapPin,
  Users, Briefcase, Building2, AtSign, Smartphone, Languages, BadgeCheck,
} from 'lucide-react';
import { PageHeader, ListGroup, Field, AreaField } from './ui';

const I = 15; // glyph size inside the 28px tiles

export default function CandidateProfile() {
  // This holds all the form data
  const [formData, setFormData] = useState({
    name: "", htNo: "", branch: "CSE", year: "", dob: "",
    interMarks: "", rank: "", address: "", phone: "",
    parentName: "", designation: "", organization: "",
    parentEmail: "", parentMobile: "", studentEmail: "",
    bloodGroup: "", medical: "", medicines: "",
    languages: "", memberships: "", cgpa: "",
    placement: "No", higherStudies: "No"
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-load the logged-in student's record once on open
  useEffect(() => {
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    const studentEmail = localStorage.getItem('studentEmail');
    const isGoogleAuth = localStorage.getItem('isGoogleAuth');

    // Always resolve to a roll number (htNo) for the API call
    let htNo = loggedInHtNo;
    if (isGoogleAuth === 'true' && studentEmail) {
      htNo = studentEmail.split('@')[0].toUpperCase();
    }

    if (htNo) {
      setFormData(prev => ({ ...prev, htNo, ...(studentEmail && { studentEmail }) }));

      axios.get(`https://mlrit-counseling-portal.onrender.com/api/students/${htNo}`)
        .then(response => {
          if (response.data) {
            setFormData(prev => ({ ...prev, ...response.data }));
            toast.success("Your profile data is loaded!", { id: 'profile-load' });
          }
        })
        .catch(error => {
          // A 404 just means they're a brand new student
          if (error.response && error.response.status === 404) {
            toast.success("Welcome! Please fill out your profile for the first time.", { id: 'profile-load' });
          } else {
            console.error("Auto-fetch error:", error);
            toast.error("Failed to load your profile data.", { id: 'profile-load' });
          }
        });
    } else {
      toast.error("No student logged in. Please log in again.", { id: 'profile-load' });
    }
  }, []);

  const handleSave = async () => {
    if (!formData.htNo || !formData.name) {
      toast.error("Please enter at least your Name and Hall Ticket Number!");
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving your profile...');

    try {
      await axios.post('https://mlrit-counseling-portal.onrender.com/api/students/save', formData);
      toast.success("Profile Saved Successfully!", { id: toastId });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to connect to server. Check your backend!", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const bind = (name) => ({ name, value: formData[name] || '', onChange: handleChange });

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title="Profile"
        subtitle="Your personal student record"
        actions={
          <div className="flex gap-2 print:hidden">
            <button onClick={() => window.print()} className="icon-btn bg-white border border-slate-900/10" aria-label="Print profile">
              <Printer size={18} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer
                         flex items-center gap-2 disabled:opacity-50
                         active:scale-95 hover:bg-primary-hover
                         transition-[background-color,transform] duration-100"
            >
              <Save size={17} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        }
      />

      {/* Identity hero — the one saturated surface on this screen */}
      <div className="hero p-6 md:p-8 mb-2 flex items-center gap-5">
        <div className="absolute -top-24 -right-12 w-72 h-72 rounded-full bg-white/[0.07] blur-3xl pointer-events-none" />
        <div className="relative h-20 w-20 rounded-[22px] bg-white/15 border border-white/25 backdrop-blur
                        flex items-center justify-center text-3xl font-bold shrink-0 select-none">
          {(formData.name || '?').trim().charAt(0).toUpperCase()}
        </div>
        <div className="relative min-w-0">
          <p className="text-2xl md:text-3xl font-bold vib-primary truncate" style={{ letterSpacing: '-0.03em' }}>
            {formData.name || 'Unnamed student'}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="chip !bg-white/15 !text-white/90 font-mono">{formData.htNo || '—'}</span>
            {formData.branch && <span className="chip !bg-white/15 !text-white/90">{formData.branch}</span>}
            {formData.year && <span className="chip !bg-white/15 !text-white/90">Admitted {formData.year}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
        <div>
          <ListGroup title="Identification">
            <Field icon={<User size={I} />} tone="green" label="Full name" placeholder="Enter full name" {...bind('name')} />
            <Field icon={<Hash size={I} />} tone="slate" label="Roll number" readOnly {...bind('htNo')} />
            <Field icon={<GitBranch size={I} />} tone="violet" label="Branch" placeholder="CSE" {...bind('branch')} />
            <Field icon={<CalendarDays size={I} />} tone="blue" label="Year of admission" type="number" placeholder="2024" {...bind('year')} />
            <Field icon={<Cake size={I} />} tone="pink" label="Date of birth" type="date" {...bind('dob')} />
            <Field icon={<Droplet size={I} />} tone="red" label="Blood group" placeholder="O+" {...bind('bloodGroup')} />
          </ListGroup>

          <ListGroup title="Academic">
            <Field icon={<GraduationCap size={I} />} tone="teal" label="Intermediate" placeholder="0" hint="%" {...bind('interMarks')} />
            <Field icon={<Trophy size={I} />} tone="orange" label="EAMCET rank" placeholder="0" {...bind('rank')} />
            <Field icon={<Gauge size={I} />} tone="green" label="Current CGPA" placeholder="0.00" {...bind('cgpa')} />
          </ListGroup>

          <ListGroup title="Health">
            <Field icon={<HeartPulse size={I} />} tone="red" label="Medical issues" placeholder="None" {...bind('medical')} />
            <Field icon={<Pill size={I} />} tone="pink" label="Medication" placeholder="None" {...bind('medicines')} />
          </ListGroup>
        </div>

        <div>
          <ListGroup title="Contact">
            <Field icon={<Mail size={I} />} tone="blue" label="College email" type="email" placeholder="student@mlrit.ac.in" {...bind('studentEmail')} />
            <Field icon={<Phone size={I} />} tone="green" label="Phone" type="tel" placeholder="Mobile number" {...bind('phone')} />
            <AreaField icon={<MapPin size={I} />} tone="orange" label="Address" rows="3" placeholder="House no, street, city…" {...bind('address')} />
          </ListGroup>

          <ListGroup title="Parent / Guardian">
            <Field icon={<Users size={I} />} tone="violet" label="Name" placeholder="Parent's name" {...bind('parentName')} />
            <Field icon={<Briefcase size={I} />} tone="slate" label="Designation" placeholder="Job title" {...bind('designation')} />
            <Field icon={<Building2 size={I} />} tone="teal" label="Organization" placeholder="Company name" {...bind('organization')} />
            <Field icon={<AtSign size={I} />} tone="blue" label="Email" type="email" placeholder="parent@email.com" {...bind('parentEmail')} />
            <Field icon={<Smartphone size={I} />} tone="green" label="Mobile" type="tel" placeholder="Parent's mobile" {...bind('parentMobile')} />
          </ListGroup>

          <ListGroup title="Other">
            <AreaField icon={<Languages size={I} />} tone="orange" label="Languages known" rows="2" placeholder="Read: English, Telugu · Write: English…" {...bind('languages')} />
            <AreaField icon={<BadgeCheck size={I} />} tone="violet" label="Professional societies" rows="2" placeholder="CSI, IEEE…" {...bind('memberships')} />
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
