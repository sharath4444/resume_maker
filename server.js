const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/resumeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema and model for resumes
const resumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    education: String,
    projects: String,
    achievements: String,
    certifications: String,
    skills: [String],
});

const Resume = mongoose.model("Resume", resumeSchema);

// Create resumes directory if it doesn't exist
const resumesDir = path.join(__dirname, 'public', 'resumes');
if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
}

// POST route to generate PDF
app.post("/generatePDF", async (req, res) => {
    const resumeData = req.body;
    const resume = new Resume(resumeData);
    try {
        await resume.save(); // Store resume in the database
        const filePath = await generatePDF(resumeData);
        res.download(filePath);  // Send the generated PDF back to the client
    } catch (error) {
        console.error("Error saving resume:", error);
        res.status(500).send("An error occurred while saving the resume.");
    }
});
// Function to generate PDF
async function generatePDF(data) {
  const doc = new PDFDocument();
  const filePath = path.join(resumesDir, `${data.name.replace(/\s+/g, '_')}_resume.pdf`);
  
  doc.pipe(fs.createWriteStream(filePath));
  
  // Add content to the PDF
  doc.fontSize(20).text(data.name, { align: 'center' });
  doc.fontSize(10).text(`${data.phone} | ${data.email} | ${data.linkedin || ''} | ${data.github || ''}`, { align: 'center' });
  doc.moveDown();
  
    const addSection = (title, content) => {
      if (content) {
          doc.font('Helvetica-Bold').fontSize(14).text(title);
          doc.moveTo(doc.x, doc.y + 5).lineTo(doc.page.width - doc.x - 20, doc.y + 5).stroke(); // Horizontal line
          doc.moveDown(); 
          doc.font('Helvetica').fontSize(12).text(content);
          doc.moveDown();
      }
  };

  addSection("Education", data.education);
  addSection("Projects", data.projects.replace(/\n/g, ', ')); // Format projects
  addSection("Achievements", data.achievements);
  addSection("Certifications", data.certifications);
  addSection("Skills", data.skills.join(", "));
  
  doc.end();
  return filePath; // Return the path of the generated PDF
}
// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
