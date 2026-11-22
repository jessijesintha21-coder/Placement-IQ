import React, { useState } from 'react';

const SKILLS_COLLECTION = [
  "React.js", "Node.js", "Python", "TypeScript", "SQL",
  "MongoDB", "AWS", "Docker", "Data Structures", "UI/UX",
  "Java", "Machine Learning", "GraphQL", "Git", "Cybersecurity"
];

const CERTIFICATES_COLLECTION = [
  "AWS Certified Developer", "Google Cloud Associate", "Meta Front-End",
  "Full Stack Bootcamp", "Hackerrank Gold", "Leetcode Badge",
  "Oracle Java", "MongoDB Certified", "Docker Associate",
  "Scrum Master", "AI Specialization", "IBM Data Science"
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [marks, setMarks] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [evaluation, setEvaluation] = useState(null);

  const handleToggle = (item, list, setter) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const computeResults = async () => {
    const m = parseFloat(marks) || 0;
    const c = parseFloat(cgpa) || 1;

    const payload = {
      marks: m,
      cgpa: c,
      skills: selectedSkills,
      certificates: selectedCerts
    };

    try {
      const response = await fetch(`${API_URL}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluation(data);
        setCurrentStep(4);
        return;
      }
    } catch (err) {
      console.error('Backend connection failed, using local fallback:', err);
    }
    
    const computed = Math.min(100, Math.round((m * 0.35) + (c * 6.5) + (selectedSkills.length * 2.5) + (selectedCerts.length * 2)));
    
    let roleMeta = { title: "Associate Software Engineer", min: "3.5", max: "6.0" };
    if (computed > 85) {
      roleMeta = { title: "Full Stack / Cloud Engineer", min: "9.0", max: "16.0" };
    } else if (computed > 70) {
      roleMeta = { title: "Frontend / Backend Developer", min: "6.0", max: "9.5" };
    } else if (computed > 55) {
      roleMeta = { title: "Junior Web Developer", min: "3.5", max: "5.5" };
    }

    setEvaluation({ score: computed, ...roleMeta });
    setCurrentStep(4);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span>⚡</span> Placement IQ
        </div>
        <ul className="nav-list">
          <li><a href="#" className="nav-item active">Dashboard</a></li>
          <li><a href="#" className="nav-item">Skill Matrix</a></li>
          <li><a href="#" className="nav-item">Drive Eligibility</a></li>
          <li><a href="#" className="nav-item">My Profile</a></li>
        </ul>
        <div className="footer">© 2026 Placement IQ</div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Assessment Dashboard</h2>
          <div className="user-profile">
            <div className="avatar">JK</div>
            <span>Jessica</span>
          </div>
        </header>

        <section className="content-area">
          <div className="glass-card">
            <div className="steps-bar">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`step-node ${currentStep >= s ? 'active' : ''}`}>{s}</div>
              ))}
            </div>

            {currentStep === 1 && (
              <div>
                <h3>Step 1: Academic Records</h3>
                <p>Enter your baseline academic performance.</p>
                <div className="form-grid" style={{ marginTop: '2rem' }}>
                  <div className="form-group">
                    <label>Overall Marks / Percentage (%)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 88" 
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree CGPA</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 8.2"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>
                </div>
                <div className="action-bar">
                  <div></div>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(2)} disabled={!marks || !cgpa}>
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3>Step 2: Technical Competencies</h3>
                <p>Select all technologies you are comfortable working with.</p>
                <div className="options-container">
                  {SKILLS_COLLECTION.map(skill => (
                    <div 
                      key={skill}
                      className={`selection-card ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                      onClick={() => handleToggle(skill, selectedSkills, setSelectedSkills)}
                    >
                      <span>{skill}</span>
                      <div className="checkbox-icon"></div>
                    </div>
                  ))}
                </div>
                <div className="action-bar">
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(3)} disabled={selectedSkills.length === 0}>
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3>Step 3: Industry Certifications</h3>
                <p>Select your completed professional certifications.</p>
                <div className="options-container">
                  {CERTIFICATES_COLLECTION.map(cert => (
                    <div 
                      key={cert}
                      className={`selection-card ${selectedCerts.includes(cert) ? 'selected' : ''}`}
                      onClick={() => handleToggle(cert, selectedCerts, setSelectedCerts)}
                    >
                      <span>{cert}</span>
                      <div className="checkbox-icon"></div>
                    </div>
                  ))}
                </div>
                <div className="action-bar">
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>← Back</button>
                  <button className="btn btn-primary" onClick={computeResults} disabled={selectedCerts.length === 0}>
                    Calculate Placement Profile
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && evaluation && (
              <div>
                <h3>Assessment Results</h3>
                <div className="results-layout" style={{ marginTop: '2rem' }}>
                  <div className="score-visualization">
                    <div className="score-ring">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Score</span>
                      <span className="score-number">{evaluation.score}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>READY</span>
                    </div>
                  </div>
                  <div>
                    <h4>Recommended Job Profiles</h4>
                    <div style={{ margin: '1rem 0 2rem 0' }}>
                      <span className="job-pill">{evaluation.title}</span>
                    </div>
                    <h4>Estimated Compensation Range</h4>
                    <div>
                      <div className="salary-highlight">
                        {evaluation.min} LPA - {evaluation.max} LPA
                      </div>
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                      <button className="btn btn-primary" onClick={() => setCurrentStep(1)}>Reset Assessment</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}