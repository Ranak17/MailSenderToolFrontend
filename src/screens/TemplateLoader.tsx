import React, { useState, useRef } from "react";
import "../styles/TemplateLoader.css"; // Import the custom CSS file
import axios from "axios";
import ReactDOMServer from "react-dom/server"; // For converting JSX to HTML
import Template1 from "../templates/Template1";

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

        // Get the HTML content from the editable preview area
        const editedHTML = previewRef.current
            ? previewRef.current.querySelector(".email-template").innerHTML
            : "";

        try {
            console.log("Email Content:", {
                ...formData,
                body: editedHTML,
            });

            const response = await axios.post("http://localhost:8080/api/mail/send-single", {
                ...formData,
                body: editedHTML, // Use the edited content as the email body
            });

            if (response.status === 200) {
                alert("Email sent successfully!");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        }
    };

    const applyFormat = (format, value) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        if (format === "bold" || format === "italic" || format === "underline") {
            // Basic text formatting
            document.execCommand(format);
        } else if (format === "fontSize") {
            const parentElement = range.startContainer.parentElement;
            const currentSize = window
                .getComputedStyle(parentElement, null)
                .getPropertyValue("font-size")
                .replace("px", "");
            let newSize = parseInt(currentSize, 10);

            if (value === "increase") {
                newSize = Math.min(newSize + 2, 36); // Maximum font size
            } else if (value === "decrease") {
                newSize = Math.max(newSize - 2, 8); // Minimum font size
            }

            document.execCommand("fontSize", false, "7");
            const fontElements = document.querySelectorAll("font[size='7']");
            fontElements.forEach((el) => {
                el.removeAttribute("size");
                el.style.fontSize = `${newSize}px`;
            });
        } else if (format === "fontName") {
            // Apply font family
            document.execCommand("fontName", false, value);
        } else if (format === "insertOrderedList" || format === "insertUnorderedList") {
            // Add ordered/unordered list
            document.execCommand(format);
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
                            {Object.keys(templateComponents).map((key) => (
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
                    {/* Toolbar for formatting */}



                </div>

                {/* Display selected template content */}
                <div className="template-loader__preview" ref={previewRef} >
                    <div className="template-loader__card" >
                        <div className="template-loader__card-header">
                            {selectedTemplate ? `Email Preview: ${selectedTemplate}` : "Template Preview"}
                        </div>
                        <div className="template-loader__card-body">
                            <div className="template-loader__toolbar">
                                <button className="toolbar-button" onClick={() => applyFormat("bold")}>
                                    <strong>B</strong>
                                </button>
                                <button className="toolbar-button" onClick={() => applyFormat("italic")}>
                                    <em>I</em>
                                </button>
                                <button className="toolbar-button" onClick={() => applyFormat("underline")}>
                                    <u>U</u>
                                </button>
                                <button className="toolbar-button" onClick={() => applyFormat("fontSize", "increase")}>
                                    A+
                                </button>
                                <button className="toolbar-button" onClick={() => applyFormat("fontSize", "decrease")}>
                                    A-
                                </button>
                                <select
                                    className="toolbar-dropdown"
                                    onChange={(e) => applyFormat("fontName", e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Font Family
                                    </option>
                                    <option value="Arial">Arial</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Verdana">Verdana</option>
                                </select>
                                <button className="toolbar-button" onClick={() => applyFormat("insertOrderedList")}>
                                    <i className="fas fa-list-ol"></i>
                                </button>
                                <button className="toolbar-button" onClick={() => applyFormat("insertUnorderedList")}>
                                    <i className="fas fa-list-ul"></i>
                                </button>

                            </div>
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


