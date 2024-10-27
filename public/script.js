function generateResume() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const linkedin = document.getElementById("linkedin").value;
    const github = document.getElementById("github").value;
    const education = document.getElementById("education").value;
    const projects = document.getElementById("projects").value;
    const achievements = document.getElementById("achievements").value;
    const certifications = document.getElementById("certifications").value;

    const skills = [];
    const skillCheckboxes = ["html", "css", "js", "git", "react", "nodejs"];
    skillCheckboxes.forEach(skill => {
        if (document.getElementById(skill).checked) {
            skills.push(document.getElementById(skill).value);
        }
    });

    document.getElementById("resumeDisplay").innerHTML = `
      <h2>${name}</h2>
      <p style="font-size: 0.9em;">${phone} | ${email} | ${linkedin ? `<a href="${linkedin}" target="_blank">${linkedin}</a>` : ""} | ${github ? `<a href="${github}" target="_blank">${github}</a>` : ""}</p>
      <hr>
      <h3>Education</h3>
      <p>${education}</p>
      <hr>
      ${projects ? `<h3>Projects</h3><p>${projects.replace(/\n/g, "<br>")}</p>` : ""}
      ${achievements ? `<hr><h3>Achievements</h3><p>${achievements}</p>` : ""}
      ${certifications ? `<hr><h3>Certifications</h3><p>${certifications}</p>` : ""}
      <hr>
      <h3>Skills</h3>
      <ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
      <button onclick="printResume()">Print</button>
    `;
    document.getElementById("resumeDisplay").style.display = "block";
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
        projects: document.getElementById("projects").value,
        achievements: document.getElementById("achievements").value,
        certifications: document.getElementById("certifications").value,
        skills: []
    };

    const skillCheckboxes = ["html", "css", "js", "git", "react", "nodejs"];
    skillCheckboxes.forEach(skill => {
        if (document.getElementById(skill).checked) {
            resumeData.skills.push(document.getElementById(skill).value);
        }
    });

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
