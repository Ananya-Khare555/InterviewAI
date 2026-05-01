import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)

    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {

        const resumeFile = resumeInputRef.current.files[0]

        // ✅ VALIDATION (IMPORTANT FIX)
        if (!jobDescription) {
            alert("Job Description is required")
            return
        }

        if (!resumeFile && !selfDescription) {
            alert("Please upload resume OR write self description")
            return
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        // ✅ FIX: backend returns id not _id
        if (!data || !data.id) {
            alert("Failed to generate report")
            return
        }

        navigate(`/interview/${data.id}`)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>

                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder="Paste job description..."
                            maxLength={5000}
                        />

                        <div className='char-counter'>
                            {jobDescription.length} / 5000 chars
                        </div>
                    </div>

                    {/* Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel */}
                    <div className='panel panel--right'>

                        <div className='panel__header'>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            <label className='dropzone'>
    {selectedFile ? (
        <p>📄 {selectedFile.name}</p>
    ) : (
        <p>Click to upload</p>
    )}
                                <p>Click to upload</p>

                                <input
    ref={resumeInputRef}
    type='file'
    accept='.pdf,.docx'
    style={{ display: "none" }}
    onChange={(e) => {
        const file = e.target.files[0]
        setSelectedFile(file)
    }}
/>
                            </label>
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        {/* Self Description */}
                        <div className='self-description'>
                            <label className='section-label'>
                                Self Description
                            </label>

                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className='panel__textarea panel__textarea--short'
                                placeholder="Describe yourself..."
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className='interview-card__footer'>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                    >
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* 🔥 FIXED REPORT LIST */}
            {reports && reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>

                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li
                                key={report.id} // ✅ FIX
                                className='report-item'
                                onClick={() => navigate(`/interview/${report.id}`)} // ✅ FIX
                            >
                                <h3>{report.title || 'Untitled Position'}</h3>

                                <p>
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>

                                <p>
                                    Score: {report.score || 0}% {/* ✅ FIX */}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

        </div>
    )
}

export default Home