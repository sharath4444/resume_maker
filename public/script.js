const predefinedSkills = [
  "HTML", "CSS", "JavaScript", "Git", "React", "Node.js", "Python", "Java", "C++", "SQL", "TypeScript", "Express", "MongoDB", "Django", "Flask", "Angular", "Vue.js", "Bootstrap", "SASS", "Redux", "GraphQL"
];

let selectedSkills = [];

const skillInput = document.getElementById("skillInput");
const skillsSuggestions = document.getElementById("skillsSuggestions");
const selectedSkillsContainer = document.getElementById("selectedSkills");

function updateSkillsSuggestions() {
  const input = skillInput.value.trim().toLowerCase();
  skillsSuggestions.innerHTML = "";
  if (!input) {
    skillsSuggestions.style.display = "none";
    return;
  }
  const filtered = predefinedSkills.filter(skill =>
    skill.toLowerCase().includes(input) && !selectedSkills.includes(skill)
  );
  if (filtered.length === 0) {
    skillsSuggestions.style.display = "none";
    return;
  }
  skillsSuggestions.style.display = "block";
  filtered.forEach(skill => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = skill;
    div.onclick = () => {
      addSkill(skill);
      skillInput.value = "";
      updateSkillsSuggestions();
    };
    skillsSuggestions.appendChild(div);
  });
}

function addSkill(skill) {
  if (!selectedSkills.includes(skill)) {
    selectedSkills.push(skill);
    renderSelectedSkills();
  }
}

function removeSkill(skill) {
  selectedSkills = selectedSkills.filter(s => s !== skill);
  renderSelectedSkills();
}

function renderSelectedSkills() {
  selectedSkillsContainer.innerHTML = "";
  selectedSkills.forEach(skill => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = skill;
    const removeBtn = document.createElement("span");
    removeBtn.className = "remove-skill";
    removeBtn.textContent = " ×";
    removeBtn.onclick = () => removeSkill(skill);
    tag.appendChild(removeBtn);
    selectedSkillsContainer.appendChild(tag);
  });
}

skillInput.addEventListener("input", updateSkillsSuggestions);
skillInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && skillInput.value.trim()) {
    const value = skillInput.value.trim();
    if (!selectedSkills.includes(value)) {
      addSkill(value);
      // If it's a new skill, add to predefinedSkills for future suggestions
      if (!predefinedSkills.includes(value)) {
        predefinedSkills.push(value);
      }
      skillInput.value = "";
      updateSkillsSuggestions();
      e.preventDefault();
    }
  }
});

document.addEventListener("click", function(e) {
  if (!skillsSuggestions.contains(e.target) && e.target !== skillInput) {
    skillsSuggestions.style.display = "none";
  }
});

function showFormMessage(message, isError = true) {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.textContent = message;
    msgDiv.style.color = isError ? '#d32f2f' : '#388e3c';
}
function showLoading(show, message = "Generating resume...") {
    const loadingDiv = document.getElementById("loadingIcon");
    if (show) {
        loadingDiv.style.display = "flex";
        showFormMessage(message, false);
    } else {
        loadingDiv.style.display = "none";
        showFormMessage("");
    }
}

// --- Enhanced Projects Section Logic ---
let projects = [];

function renderProjects() {
  const section = document.getElementById('projectsSection');
  section.innerHTML = '';
  projects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <button type="button" class="remove-project-btn" title="Remove Project" onclick="removeProject(${idx})">&times;</button>
      <input type="text" class="project-name" placeholder="Project Name" value="${proj.name || ''}" oninput="updateProjectField(${idx}, 'name', this.value)">
      <input type="text" class="project-tech" placeholder="Technologies Used" value="${proj.tech || ''}" oninput="updateProjectField(${idx}, 'tech', this.value)">
      <textarea class="project-desc" placeholder="Description" rows="2" oninput="updateProjectField(${idx}, 'desc', this.value)">${proj.desc || ''}</textarea>
    `;
    section.appendChild(card);
  });
}
function addProject() {
  projects.push({ name: '', tech: '', desc: '' });
  renderProjects();
}
function removeProject(idx) {
  projects.splice(idx, 1);
  renderProjects();
}
function updateProjectField(idx, field, value) {
  projects[idx][field] = value;
}
document.getElementById('addProjectBtn').onclick = addProject;
window.removeProject = removeProject;
window.updateProjectField = updateProjectField;
// Add one project by default if none
window.addEventListener('DOMContentLoaded', function() {
  if (projects.length === 0) addProject();
});
// --- END Enhanced Projects Section Logic ---

// Update generateResume and saveResume to use projects array
function generateResume() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const github = document.getElementById("github").value.trim();
    const education = document.getElementById("education").value.trim();
    const achievements = document.getElementById("achievements").value.trim();
    const certifications = document.getElementById("certifications").value.trim();

    // Validation: required fields
    if (!name || !email || !phone || !education || selectedSkills.length === 0) {
        showLoading(false);
        showFormMessage("Please fill in all required fields and select at least one skill before generating the resume.", true);
        return;
    }
    showLoading(true);
    setTimeout(() => { // Simulate loading
      let projectsHTML = '';
      if (projects.length > 0 && projects.some(p => p.name || p.tech || p.desc)) {
        projectsHTML = `<h3>Projects</h3>` + projects.map(p =>
          (p.name || p.tech || p.desc) ? `<div style='margin-bottom:8px;'><strong>${p.name || ''}</strong>${p.tech ? ' | <em>' + p.tech + '</em>' : ''}<br>${p.desc ? p.desc.replace(/\n/g, '<br>') : ''}</div>` : ''
        ).join('');
      }
      document.getElementById("resumeDisplay").innerHTML = `
        <h2>${name}</h2>
        <p style="font-size: 0.9em;">${phone} | ${email} | ${linkedin ? `<a href="${linkedin}" target="_blank">${linkedin}</a>` : ""} | ${github ? `<a href="${github}" target="_blank">${github}</a>` : ""}</p>
        <hr>
        <h3>Education</h3>
        <p>${education}</p>
        <hr>
        ${projectsHTML}
        ${achievements ? `<hr><h3>Achievements</h3><p>${achievements}</p>` : ""}
        ${certifications ? `<hr><h3>Certifications</h3><p>${certifications}</p>` : ""}
        <hr>
        <h3>Skills</h3>
        <ul>${selectedSkills.map(skill => `<li>${skill}</li>`).join('')}</ul>
        <button onclick="printResume()">Print</button>
      `;
      document.getElementById("resumeDisplay").style.display = "block";
      showLoading(false);
      showFormMessage("Resume generated successfully!", false);
    }, 800);
}

function printResume() {
    const resumeContent = document.getElementById("resumeDisplay").innerHTML;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                    }
                    h2 {
                        color: #ff6f61;
                    }
                    hr {
                        border: 1px solid #ddd;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    ul li {
                        background: #ff6f61;
                        color: white;
                        padding: 5px;
                        border-radius: 5px;
                        margin: 5px 0;
                    }
                    p {
                        font-size: 0.9em;
                    }
                    @media print {
                        button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                ${resumeContent}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Function to save PDF
function saveResume() {
    const resumeData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
        education: document.getElementById("education").value,
        projects: projects,
        achievements: document.getElementById("achievements").value,
        certifications: document.getElementById("certifications").value,
        skills: selectedSkills
    };

    // Send PDF to backend for generation
    fetch("/generatePDF", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resumeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("Resume saved successfully!");
    })
    .catch(error => {
        console.error("Error saving resume:", error);
        alert("An error occurred while saving the resume: " + error.message);
    });
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        btn.textContent = '🌙';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        btn.textContent = '☀️';
    }
}
// Set default theme on load
window.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('light-mode');
    const btn = document.getElementById('themeToggle');
    btn.textContent = '🌙';
});
