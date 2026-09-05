import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, User, Code, Target, Clock, ShieldCheck } from 'lucide-react';
import { apiService } from '../../services/api';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: About You
  const [fullName, setFullName] = useState('Alex Rivera');
  const [university, setUniversity] = useState('Stanford University / MIT');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('Final Year');

  // Step 2: Skills
  const [skills, setSkills] = useState<string[]>(['Python', 'React', 'FastAPI', 'Machine Learning', 'RAG']);
  const [customSkill, setCustomSkill] = useState('');

  // Step 3: Project Interests
  const [interests, setInterests] = useState<string[]>(['AI / ML', 'Healthcare', 'Computer Vision', 'Generative AI']);
  const [interestText, setInterestText] = useState('I want to build an AI clinical decision support system for medical diagnostics.');

  // Step 4: Conditions
  const [timeline, setTimeline] = useState('3–4 months');
  const [teamSize, setTeamSize] = useState('3 members');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [deployment, setDeployment] = useState('Web deployment');
  const [budget, setBudget] = useState('Free / Low Cost');

  const availableSkills = [
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'FastAPI', 'Django', 'SQL', 'PostgreSQL', 'MongoDB', 'TensorFlow',
    'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'LLMs', 'RAG', 'Git/GitHub', 'Docker', 'Cloud Services'
  ];

  const availableInterests = [
    'AI / ML', 'Generative AI', 'LLM', 'RAG', 'Computer Vision',
    'Healthcare', 'FinTech', 'Cybersecurity', 'Education', 'Agriculture',
    'Robotics', 'IoT', 'Web Applications', 'Mobile Applications', 'Data Science', 'Automation'
  ];

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const parsedTeamSize = parseInt(teamSize) || 3;
      const parsedTimeline = parseInt(timeline) || 4;
      await apiService.updateProfile({
        degree,
        branch,
        academic_year: year,
        programming_languages: skills.filter(s => ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript'].includes(s)),
        frameworks: skills.filter(s => ['React', 'Node.js', 'FastAPI', 'Django', 'TensorFlow', 'PyTorch'].includes(s)),
        ai_ml_skills: skills.filter(s => ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LLMs', 'RAG'].includes(s)),
        interests,
        team_size: parsedTeamSize,
        available_time_months: parsedTimeline,
        experience_level: difficulty,
        preferred_project_type: deployment,
      });
      localStorage.setItem('onboarding_completed', 'true');
      onComplete();
    } catch (err) {
      console.error("Failed to update profile during onboarding:", err);
      localStorage.setItem('onboarding_completed', 'true');
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>STEP {step} OF 5</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">
              {step === 1 && 'About You'}
              {step === 2 && 'Your Skills'}
              {step === 3 && 'Project Interests'}
              {step === 4 && 'Project Conditions'}
              {step === 5 && 'Profile Summary'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>Tell Us About Yourself</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Help us tailor project recommendations and mentoring to your academic background.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">University / College</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="B.S. Computer Science">B.S. Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Specialization</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Final Year">Final Year (Senior)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Code className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>What Technologies Do You Know?</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Select all tools and languages you are comfortable working with.</p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {availableSkills.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border-brand-500/40 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-950/60 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {skill} {selected && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. OpenCV, Next.js)..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Project Interests */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>What Do You Want to Build?</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Choose domains or project areas that excite you.</p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
              {availableInterests.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-950/60 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {interest} {selected && '✓'}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tell us in your own words (Optional)</label>
              <textarea
                rows={3}
                value={interestText}
                onChange={(e) => setInterestText(e.target.value)}
                placeholder="E.g. I want to build a machine learning diagnostic tool for healthcare..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Conditions */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>Your Project Constraints</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Specify timeline, team size, and difficulty preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Available Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="1–2 months">1–2 months</option>
                  <option value="3–4 months">3–4 months</option>
                  <option value="5–6 months">5–6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Team Size</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Solo">Solo (1 member)</option>
                  <option value="2 members">2 members</option>
                  <option value="3 members">3 members</option>
                  <option value="4 members">4 members</option>
                  <option value="5+ members">5+ members</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Research-level">Research-level</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Free / Low Cost">Free / Low Cost</option>
                  <option value="$50 - $200">$50 - $200</option>
                  <option value="Flexible">Flexible Budget</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span>Your Academic Project Profile</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Review your setup before entering your project command center.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{fullName}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{degree} in {branch} • {year}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {university}
                </span>
              </div>

              <div>
                <span className="text-slate-600 dark:text-slate-400 font-medium block mb-1.5">Confirmed Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="px-2.5 py-0.5 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-600 dark:text-slate-400 font-medium block mb-1.5">Project Domains:</span>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-800 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Timeline</span>
                  <strong>{timeline}</strong>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Team</span>
                  <strong>{teamSize}</strong>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Difficulty</span>
                  <strong>{difficulty}</strong>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Budget</span>
                  <strong>{budget}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'START BUILDING MY PROJECT'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
