import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌟 NEW: The Auto-Load Magic! 
  // This runs automatically exactly ONE time when the page opens
  useEffect(() => {
    // 1. Look in the browser memory for the logged-in student
    const loggedInHtNo = localStorage.getItem('studentHtNo');
    const studentEmail = localStorage.getItem('studentEmail');
    const isGoogleAuth = localStorage.getItem('isGoogleAuth');
    
    // Use email as identifier for Google OAuth users, htNo for regular users
    const identifier = (isGoogleAuth === 'true' && studentEmail) ? studentEmail : loggedInHtNo;
    
    if (identifier) {
      // Pre-fill the Hall Ticket Number or email
      if (isGoogleAuth === 'true') {
        setFormData(prev => ({ ...prev, studentEmail: studentEmail, htNo: loggedInHtNo || '' }));
      } else {
        setFormData(prev => ({ ...prev, htNo: loggedInHtNo }));
      }

      // 2. Automatically fetch their data from the cloud!
      axios.get(`http://localhost:8000/api/students/${identifier}`)
        .then(response => {
          if (response.data) {
            setFormData(prev => ({ ...prev, ...response.data }));
            toast.success("Your profile data is loaded! 📥");
          }
        })
        .catch(error => {
          // If the database says 404, it just means they are a brand new student!
          if (error.response && error.response.status === 404) {
            toast.success("Welcome! Please fill out your profile for the first time. ✨");
          } else {
            console.error("Auto-fetch error:", error);
            toast.error("Failed to load your profile data.");
          }
        });
    } else {
      toast.error("⚠️ No student logged in. Please log in again.");
    }
  }, []);

  // 💾 The Save Function (Sending Data)
  const handleSave = async () => {
    if (!formData.htNo || !formData.name) {
      toast.error("Please enter at least your Name and Hall Ticket Number!");
      return;
    }

    const toastId = toast.loading('Saving your profile...');

    try {
      const response = await axios.post('http://localhost:8000/api/students/save', formData);
      toast.success("Profile Saved Successfully! ✅", { id: toastId });
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to connect to server. Check your backend!", { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800">My Profile</h2>
          <p className="text-slate-400 font-medium">Personal Student Record</p>
        </div>
        
        {/* Buttons hidden when printing */}
        <div className="flex gap-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2"
          >
            🖨️ Print PDF
          </button>
          
          <button 
            onClick={handleSave}
            className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2"
          >
            💾 Save Profile
          </button>
        </div>
      </div>

      <div className="glass-card grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Identification */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase border-b-2 border-primary/20 pb-2">Identification</h3>
          <div><label className="label-text">1. Full Name</label><input name="name" value={formData.name} onChange={handleChange} placeholder="Enter Full Name" className="input-field" /></div>
          
          {/* Made the HT No field read-only since it's tied to their login! */}
          <div><label className="label-text">2. HT No. (Roll Number)</label><input name="htNo" value={formData.htNo} readOnly className="input-field bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200" /></div>
          
          <div><label className="label-text">3. Branch</label><input name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE" className="input-field" /></div>
          <div><label className="label-text">4. Year Of Admission</label><input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="e.g. 2024" className="input-field" /></div>
          <div><label className="label-text">5. Date of Birth</label><input name="dob" type="date" value={formData.dob} onChange={handleChange} className="input-field" /></div>
          <div><label className="label-text">16. Blood Group</label><input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" className="input-field" /></div>
        </div>

        {/* Column 2: Academic & Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase border-b-2 border-primary/20 pb-2">Academic & Contact</h3>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label-text">6. Inter %</label><input name="interMarks" value={formData.interMarks} onChange={handleChange} placeholder="%" className="input-field" /></div>
            <div><label className="label-text">7. Rank</label><input name="rank" value={formData.rank} onChange={handleChange} placeholder="EAMCET Rank" className="input-field" /></div>
          </div>
          <div><label className="label-text">15. Student Email</label><input name="studentEmail" value={formData.studentEmail} onChange={handleChange} placeholder="student@mlrit.ac.in" className="input-field" /></div>
          <div><label className="label-text">9. Phone Number</label><input name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" className="input-field" /></div>
          <div><label className="label-text">8. Full Address</label><textarea name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, City..." rows="3" className="input-field"></textarea></div>
          <div><label className="label-text">17. Medical Issues</label><input name="medical" value={formData.medical} onChange={handleChange} placeholder="If any (or type None)" className="input-field" /></div>
        </div>

        {/* Column 3: Family & Career */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-primary uppercase border-b-2 border-primary/20 pb-2">Family & Career</h3>
          <div><label className="label-text">10. Parent/Guardian Name</label><input name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Parent's Name" className="input-field" /></div>
          <div><label className="label-text">11. Designation</label><input name="designation" value={formData.designation} onChange={handleChange} placeholder="Job Title / Profession" className="input-field" /></div>
          <div><label className="label-text">12. Organization</label><input name="organization" value={formData.organization} onChange={handleChange} placeholder="Company Name" className="input-field" /></div>
          <div><label className="label-text">13. Parent Email</label><input name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="parent@email.com" className="input-field" /></div>
          <div><label className="label-text">14. Parent Mobile</label><input name="parentMobile" value={formData.parentMobile} onChange={handleChange} placeholder="Parent's Mobile" className="input-field" /></div>
        </div>

        {/* Full Width Footer Section */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
          <div><label className="label-text">18. Languages known</label><textarea name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g. Read: English, Telugu | Write: English..." className="input-field" rows="2"></textarea></div>
          <div><label className="label-text">19. Professional Societies</label><textarea name="memberships" value={formData.memberships} onChange={handleChange} placeholder="CSI, IEEE, etc." className="input-field" rows="2"></textarea></div>
        </div>

      </div>
    </div>
  );
}