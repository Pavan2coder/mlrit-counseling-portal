import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, BookOpen, CalendarCheck, TrendingUp } from 'lucide-react';
import { PageHeader, StatTile } from './ui';

// Below 75% attendance is a real consequence for the student, so it gets colour.
const attendanceTone = (v) => {
  const n = Number(v);
  if (!v || Number.isNaN(n)) return '';
  return n < 75 ? 'text-red-600' : 'text-slate-800';
};

const API_URL = "https://mlrit-counseling-portal.onrender.com";

const MONTHS = ['month1', 'month2', 'month3', 'month4'];
const BLANK_SUBJECT = () => ({
  subjectCodeAndName: "",
  attendance: {
    month1: { name: "Sep", percentage: "" },
    month2: { name: "Oct", percentage: "" },
    month3: { name: "Nov", percentage: "" },
    month4: { name: "Dec", percentage: "" },
  },
  cie1: "", cie2: "", viva: "", cieAvg: "", univMarks: "", totalMarks: "", grade: "",
});

const avg = (nums) => {
  const valid = nums.map(Number).filter((n) => !Number.isNaN(n) && n > 0);
  return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
};

export default function PerformanceEntry() {
  const [loading, setLoading] = useState(false);
  const [academicRecords, setAcademicRecords] = useState([
    {
      semesterName: "I-Year I-Semester",
      cumulativeMonthlyAttendance: "",
      cumulativeSemesterAttendance: "",
      totalPercentageMarks: "",
      subjects: [BLANK_SUBJECT()],
    },
  ]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const htNo = localStorage.getItem('studentHtNo');
      if (!htNo) return;

      const response = await axios.get(`${API_URL}/api/students/${htNo}`);
      if (response.data?.academicRecords?.length > 0) {
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
      await axios.put(`${API_URL}/api/students/${htNo}`, { academicRecords });
      toast.success("Records saved successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save records. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

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
    newRecords[semIndex].subjects.push(BLANK_SUBJECT());
    setAcademicRecords(newRecords);
  };

  const removeSubjectRow = (semIndex, subIndex) => {
    const newRecords = [...academicRecords];
    newRecords[semIndex].subjects.splice(subIndex, 1);
    setAcademicRecords(newRecords);
  };

  // Live summary across everything entered, so the numbers mean something
  const allSubjects = academicRecords.flatMap((s) => s.subjects);
  const attendanceAvg = avg(
    allSubjects.flatMap((s) => MONTHS.map((m) => s.attendance[m]?.percentage))
  );
  const marksAvg = avg(allSubjects.map((s) => s.totalMarks));

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        title="Records"
        subtitle="Attendance and CIE / University marks"
        actions={
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer
                       flex items-center gap-2 disabled:opacity-50 active:scale-95 hover:bg-primary-hover
                       transition-[background-color,transform] duration-100"
          >
            <Save size={17} /> {loading ? 'Saving…' : 'Save'}
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatTile label="Subjects" value={allSubjects.length} tone="blue" icon={<BookOpen size={15} />} />
        <StatTile
          label="Avg attendance" value={attendanceAvg} unit="%"
          tone={attendanceAvg && attendanceAvg < 75 ? 'red' : 'green'}
          icon={<CalendarCheck size={15} />}
          foot={attendanceAvg && attendanceAvg < 75 ? 'Below the 75% requirement' : undefined}
        />
        <StatTile label="Avg total marks" value={marksAvg} unit="/100" tone="orange" icon={<TrendingUp size={15} />} />
      </div>

      {academicRecords.map((semester, semIndex) => (
        <div key={semIndex} className="card overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-900/[0.06] flex items-center justify-between gap-3">
            <input
              type="text"
              value={semester.semesterName}
              onChange={(e) => {
                const newRecords = [...academicRecords];
                newRecords[semIndex].semesterName = e.target.value;
                setAcademicRecords(newRecords);
              }}
              className="text-lg font-bold text-slate-900 bg-transparent outline-none rounded-lg px-2 -mx-2 py-1
                         focus:bg-slate-900/[0.04] transition-colors min-w-0 flex-1"
              style={{ letterSpacing: '-0.02em' }}
            />
            <span className="chip shrink-0">{semester.subjects.length} subjects</span>
          </div>

          <div className="overflow-x-auto">
            <table className="grid-table whitespace-nowrap">
              <thead>
                <tr>
                  <th rowSpan="2" className="text-left sticky left-0 z-20 bg-[#f7f7f5] min-w-[13rem]">
                    Subject
                  </th>
                  <th colSpan="4">Attendance %</th>
                  <th colSpan="4">CIE marks</th>
                  <th rowSpan="2">Univ<span className="block font-normal normal-case text-slate-400">60</span></th>
                  <th rowSpan="2">Total<span className="block font-normal normal-case text-slate-400">100</span></th>
                  <th rowSpan="2">Grade</th>
                  <th rowSpan="2" className="w-10"></th>
                </tr>
                <tr>
                  {['Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <th key={m} className="font-normal normal-case text-slate-400">{m}</th>
                  ))}
                  <th className="font-normal normal-case text-slate-400">CIE-I<span className="block">35</span></th>
                  <th className="font-normal normal-case text-slate-400">CIE-II<span className="block">35</span></th>
                  <th className="font-normal normal-case text-slate-400">Viva<span className="block">5</span></th>
                  <th className="font-normal normal-case text-slate-400">Avg<span className="block">40</span></th>
                </tr>
              </thead>

              <tbody>
                {semester.subjects.map((subject, subIndex) => (
                  <tr key={subIndex} className="group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-[#fafafa] transition-colors">
                      <input
                        type="text"
                        placeholder="A6BS02 (PPS)"
                        value={subject.subjectCodeAndName}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'subjectCodeAndName', e.target.value)}
                        className="cell-input !text-left font-semibold"
                      />
                    </td>

                    {MONTHS.map((month) => (
                      <td key={month}>
                        <input
                          type="text" placeholder="—"
                          value={subject.attendance[month].percentage}
                          onChange={(e) => handleAttendanceChange(semIndex, subIndex, month, e.target.value)}
                          className={`cell-input w-14 tabular-nums ${attendanceTone(subject.attendance[month].percentage)}`}
                        />
                      </td>
                    ))}

                    {['cie1', 'cie2', 'viva'].map((f) => (
                      <td key={f}>
                        <input
                          type="text" placeholder="—"
                          value={subject[f]}
                          onChange={(e) => handleSubjectChange(semIndex, subIndex, f, e.target.value)}
                          className="cell-input w-14 tabular-nums"
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="text" placeholder="—"
                        value={subject.cieAvg}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'cieAvg', e.target.value)}
                        className="cell-input w-14 tabular-nums font-semibold text-primary"
                      />
                    </td>

                    <td>
                      <input
                        type="text" placeholder="—"
                        value={subject.univMarks}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'univMarks', e.target.value)}
                        className="cell-input w-14 tabular-nums"
                      />
                    </td>
                    <td>
                      <input
                        type="text" placeholder="—"
                        value={subject.totalMarks}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'totalMarks', e.target.value)}
                        className="cell-input w-16 tabular-nums font-bold text-slate-900"
                      />
                    </td>
                    <td>
                      <input
                        type="text" placeholder="—"
                        value={subject.grade}
                        onChange={(e) => handleSubjectChange(semIndex, subIndex, 'grade', e.target.value)}
                        className="cell-input w-14 font-bold uppercase text-accent"
                      />
                    </td>

                    <td className="text-center">
                      {/* Stays reachable on touch; just recedes visually until hover */}
                      <button
                        onClick={() => removeSubjectRow(semIndex, subIndex)}
                        className="icon-btn opacity-40 group-hover:opacity-100 hover:!text-red-500"
                        aria-label="Remove subject"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-900/[0.06]">
            <button
              onClick={() => addSubjectRow(semIndex)}
              className="text-sm font-semibold text-primary flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer
                         hover:bg-primary/[0.07] active:scale-[0.97] transition-[background-color,transform] duration-100"
            >
              <Plus size={16} /> Add subject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
