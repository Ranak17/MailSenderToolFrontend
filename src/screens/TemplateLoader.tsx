import React, { useState, useRef } from "react";
import templatePaths from "../template.json"; // Adjust the path as needed
import "../styles/TemplateLoader.css"; // Import the custom CSS file
import axios from "axios";
import ReactDOMServer from "react-dom/server"; // For converting JSX to HTML
// Import your React components for templates
import Template1 from "../templates/Template1";
// Import other templates as needed

const TemplateLoader = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("");

    // Map template keys to React components
    const templateComponents: { [key: string]: React.ReactNode } = {
        template1: <Template1 />,
        // Add more mappings for other templates
    };

    const handleTemplateSelect = (templateKey: string) => {
        setSelectedTemplate(templateKey);
    };

    const [formData, setFormData] = useState({
        recipient: "",
        subject: "",
        body: "",
    });

    const previewRef = useRef<HTMLDivElement>(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Serialize the selected template content as HTML
        const templateHTML = selectedTemplate
            ? ReactDOMServer.renderToString(templateComponents[selectedTemplate])
            : "";

        try {
            console.log("templateHTML : ", {
                ...formData,
                body: templateHTML,
            });
            const response = await axios.post("http://localhost:8080/api/mail/send-single", {
                ...formData,
                body: templateHTML,
            });
            if (response.status === 200) {
                alert("Email sent successfully!");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        }
    };

    return (
        <div className="template-loader">
            <h1 className="template-loader__header">Email Template Loader</h1>

            <div className="template-loader__content">
                <div className="template-loader__form">
                    {/* Dropdown for selecting a template */}
                    <div className="template-loader__dropdown">
                        <label htmlFor="templateSelect" className="template-loader__label">
                            Select a Template
                        </label>
                        <select
                            id="templateSelect"
                            className="template-loader__select"
                            value={selectedTemplate}
                            onChange={(e) => handleTemplateSelect(e.target.value)}
                        >
                            <option value="" disabled>
                                -- Choose a Template --
                            </option>
                            {Object.keys(templatePaths).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Additional form fields */}
                    <div className="template-loader__fields">
                        <label htmlFor="recipient" className="template-loader__label">
                            Recipient:
                        </label>
                        <input
                            id="recipient"
                            type="email"
                            className="template-loader__input"
                            placeholder="Enter recipient's email"
                            value={formData.recipient}
                            onChange={handleChange}
                        />

                        <label htmlFor="subject" className="template-loader__label">
                            Subject:
                        </label>
                        <input
                            id="subject"
                            type="text"
                            className="template-loader__input"
                            placeholder="Enter subject"
                            value={formData.subject}
                            onChange={handleChange}
                        />

                        <button className="template-loader__button" onClick={handleSubmit}>
                            Send Email
                        </button>
                    </div>
                </div>

                {/* Display selected template content */}
                <div className="template-loader__preview" ref={previewRef}>
                    <div className="template-loader__card">
                        <div className="template-loader__card-header">
                            {selectedTemplate ? `Template: ${selectedTemplate}` : "Template Preview"}
                        </div>
                        <div className="template-loader__card-body">
                            {selectedTemplate ? (
                                templateComponents[selectedTemplate] || (
                                    <p className="template-loader__placeholder">
                                        Template not found.
                                    </p>
                                )
                            ) : (
                                <p className="template-loader__placeholder">
                                    Select a template to view its content.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateLoader;
