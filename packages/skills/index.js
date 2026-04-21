const minimal = require('./skills/minimal.json');
const corporate = require('./skills/corporate.json');
const startup = require('./skills/startup.json');
const darkMode = require('./skills/dark-mode.json');
const glassmorphism = require('./skills/glassmorphism.json');
const retro = require('./skills/retro.json');
const brutalist = require('./skills/brutalist.json');
const softUi = require('./skills/soft-ui.json');
const neon = require('./skills/neon.json');
const ocean = require('./skills/ocean.json');

const skills = [
  minimal,
  corporate,
  startup,
  darkMode,
  glassmorphism,
  retro,
  brutalist,
  softUi,
  neon,
  ocean,
];

const skillsMap = Object.fromEntries(skills.map((s) => [s.name, s]));

function getSkill(name) {
  return skillsMap[name] || null;
}

function listSkills() {
  return skills.map(({ name, version, description, tags, preview }) => ({
    name,
    version,
    description,
    tags,
    preview,
  }));
}

module.exports = {
  skills,
  skillsMap,
  getSkill,
  listSkills,
  minimal,
  corporate,
  startup,
  darkMode,
  glassmorphism,
  retro,
  brutalist,
  softUi,
  neon,
  ocean,
};
