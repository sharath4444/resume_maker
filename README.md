# Resume Maker

Resume Maker is a Node.js and Express-based application that allows users to create professional resumes in PDF format. Users can input their personal information, education, project experience, skills, and other sections to generate a structured resume. The generated resume is stored in a MongoDB database and downloadable as a PDF file.

## Features

- **Dynamic PDF Generation**: Create a customized resume in PDF format using user-provided data.
- **MongoDB Integration**: Store resume information in a MongoDB database for future reference or updates.
- **REST API**: Easily extendible API endpoints to handle user data and PDF generation.
- **Horizontal Section Separators**: Each section in the PDF includes a horizontal line separator and headings are bolded for clarity.

## Technologies Used

- **Node.js**: Backend framework.
- **Express**: For building RESTful APIs.
- **MongoDB**: Database for storing resume data.
- **PDFKit**: For generating PDFs in the backend.
- **body-parser**: Middleware to parse JSON requests.

## Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sharath4444/resume_maker.git
   cd resume_maker
   ```

2. **Install Dependencies**

   ```bash
   npm install express pdfkit mongoose body-parser
   ```

3. **Configure MongoDB**

   Ensure MongoDB is running locally, or update the MongoDB connection URI in `app.js` if using a remote database.

4. **Start the Server**

   ```bash
   node server.js
   ```

   Server will run at `http://localhost:3000`.

## Usage

1. **Add Resume Data**

   - Use a tool like Postman or a frontend interface to send a POST request to `/generatePDF` with JSON data in the following format:

     ```json
     {
       "name": "John Doe",
       "email": "johndoe@example.com",
       "phone": "1234567890",
       "linkedin": "https://linkedin.com/in/johndoe",
       "github": "https://github.com/johndoe",
       "education": "Bachelor of Science in Computer Science",
       "projects": "Project1: Description\nProject2: Description",
       "achievements": "Award1, Award2",
       "certifications": "Certification1, Certification2",
       "skills": ["JavaScript", "Node.js", "MongoDB"]
     }
     ```

2. **Download the Generated PDF**

   - The server will respond with the generated PDF, which will be downloaded directly to your system.

3. **Access Saved Resumes**

   - All resumes are stored in MongoDB for future reference and can be accessed by implementing additional API endpoints.

## Project Structure

```
resume_maker/
├── server.js                 # Main server file
├── public/
│   └── resumes/           # Directory to store generated PDFs
├── README.md              # Project documentation
├── package.json           # Dependencies and scripts
└── node_modules/          # Node.js dependencies
```

## Example API Endpoints

- `POST /generatePDF`: Generate a new PDF resume from JSON data.
- **Future Scope**: Add endpoints for viewing, updating, and deleting saved resumes from the database.


## Contributions

Contributions, issues, and feature requests are welcome! Feel free to fork this repository and submit pull requests.
