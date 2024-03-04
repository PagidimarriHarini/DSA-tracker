import React, { useEffect, useState } from 'react'
import { Button, Modal, Badge } from 'react-bootstrap';


function InterviewForm({ show, handleClose, handleSubmit, submitText, companies, questions, values }) {
    const [title, setTitle] = useState(values?.title || "")
    const [position, setPosition] = useState(values?.position || "")
    const [location, setLocation] = useState(values?.location || "")
    const [company, setCompany] = useState(values?.company || "Company")
    const [year, setYear] = useState(values?.year || "Year")
    const [category, setCategory] = useState(values?.category || "Full Time")
    const [verdict, setVerdict] = useState(values?.verdict || "selected")
    const [text, setText] = useState(values?.text || "")
    const [errorMessage, setErrorMessage] = useState("")

    // useEffect(() => {
    //     console.log(questions);
    // }, [questions])

    const submitForm = () => {
        if (title !== "" && position !== ""&& location !== ""&&
            text !== "" && company !== "Company" && year !== "Year") {
            handleSubmit({ title, position, location, company, year, category, verdict, text })
        } else {
            setErrorMessage("Please fill out all fields correctly")
        }
    }

    return (
        <Modal show={show} onHide={handleClose} scrollable={true} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>{submitText} Experience</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title"
                            value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="position" className="form-label">Position</label>
                        <input type="text" className="form-control" id="position"
                            value={position} onChange={(e) => setPosition(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input type="text" className="form-control" id="location"
                            value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select company"
                            value={company} onChange={(e) => setCompany(e.target.value)}>
                            <option>Company</option>
                            {companies.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select Year"
                            value={year} onChange={(e) => setYear(e.target.value)}>
                            <option>Year</option>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select category"
                            value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="fulltime">Full Time</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select verdict"
                            value={verdict} onChange={(e) => setVerdict(e.target.value)}>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <textarea className="form-control" rows={4} id="text" required
                            value={text} onChange={(e) => setText(e.target.value)} placeholder='Text goes here...' />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                {errorMessage && <p className="error-message" style={{ color: "#FF9494" }}>{errorMessage}</p>}
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={submitForm}>
                    {submitText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default InterviewForm