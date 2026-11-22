const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/evaluate', (req, res) => {
  const { marks, cgpa, skills, certificates } = req.body;

  const marksNum = parseFloat(marks) || 0;
  const cgpaNum = parseFloat(cgpa) || 1;
  const skillsCount = Array.isArray(skills) ? skills.length : 0;
  const certsCount = Array.isArray(certificates) ? certificates.length : 0;

  const rawScore = (marksNum * 0.35) + (cgpaNum * 6.5) + (skillsCount * 2.5) + (certsCount * 2);
  const finalScore = Math.min(100, Math.round(rawScore));

  let roleMeta = { title: "Associate Software Engineer", min: "3.5", max: "6.0" };
  if (finalScore > 85) {
    roleMeta = { title: "Full Stack / Cloud Engineer", min: "9.0", max: "16.0" };
  } else if (finalScore > 70) {
    roleMeta = { title: "Frontend / Backend Developer", min: "6.0", max: "9.5" };
  } else if (finalScore > 55) {
    roleMeta = { title: "Junior Web Developer", min: "3.5", max: "5.5" };
  }

  res.json({
    score: finalScore,
    role: roleMeta.title,
    minLpa: roleMeta.min,
    maxLpa: roleMeta.max
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});