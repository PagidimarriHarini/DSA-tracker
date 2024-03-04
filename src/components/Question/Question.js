import React, { useEffect, useState } from 'react'
import "./Question.css"
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import { useAuth } from '../AuthContext';
import { getDataApi, getSubmissionsApi } from "../../services/questionService"

function MyModal({ active, setActive }) {
    const [show, setShow] = useState(false);
    const [code, setCode] = useState([]);

    const handleClose = () => {
        setShow(false)
        setActive(null)
    };
    const handleShow = () => setShow(true);

    useEffect(() => {
        setCode(active.code.split('\n'))
        handleShow(true)
    }, [active])

    return (
        <Modal show={show} onHide={handleClose} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>language: {active.lang}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {code.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


function Question({ qd, updateData }) {
    const { isLoggedIn } = useAuth();
    let navigate = useNavigate();
    const { iTopic, iQuestion, qu } = useParams()
    const [activeTab, setActiveTab] = useState(0)
    const [companies, setCompanies] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [activeSubmission, setActiveSubmissions] = useState(null)

    const getData = async () => {
        try {
            const data = await getDataApi(qu)
            document.getElementsByClassName("problem")[0].innerHTML = data.problem
            document.getElementsByClassName("topic")[0].innerHTML = data.title
            document.getElementsByClassName("difficulty")[0].innerHTML = data.difficulty

            setCompanies(data.companies)
        } catch (error) {
            document.getElementsByClassName("container0")[0].innerHTML = "<h3>404</h3>"
            console.log(error);
        }
    }

    const getSubmissions = async () => {
        try {
            const data = await getSubmissionsApi(qu)
            setSubmissions(data)
        } catch (error) {
            document.getElementsByClassName("container1")[0].innerHTML = "<h3>no submissions yet</h3>"
            console.log(error);
        }
    }

    const viewCode = x => {
        setActiveSubmissions(x)
    }

    useEffect(() => {
        if (activeTab === 1) {
            getSubmissions()
        }
        // eslint-disable-next-line
    }, [activeTab])


    useEffect(() => {
        isLoggedIn ? getData() : navigate("/login")
        // eslint-disable-next-line
    }, [isLoggedIn])

    return (
        <Container fluid>
            <Row>
                <Col sm={6} className='bg-light scrollable' style={{ padding: 0 }}>
                    <ul className="nav nav-tabs bg-transparent px-2">
                        <li className="nav-item">
                            <div className={activeTab === 0 ? `nav-link active` : `nav-link`} role='button' onClick={() => setActiveTab(0)}>
                                <i className="fa fa-fw fa-code me-1"></i>
                                Problem
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className={activeTab === 1 ? `nav-link active` : `nav-link`} role='button' onClick={() => setActiveTab(1)}>
                                <i className="fa fa-clock-o me-1"></i>
                                Submissions
                            </div>
                        </li>
                    </ul>
                    <div className={activeTab === 0 ? `container0` : `container0 d-none`}>
                        <div className='px-1 py-2'>
                            <h4 className=' d-inline fw-bold p-1 topic'>...</h4>
                            <i className={`fa fa-fw ${qd &&
                                qd.length !== 0 && qd[iTopic].questions[iQuestion].Bookmark ?
                                "fa-bookmark" : "fa-bookmark-o"
                                }`}></i>
                        </div>
                        <div>
                            <span className='m-1 p-1 fw-bold difficulty'></span>
                            <span className='m-1 p-1 fw-bold submissions'></span>
                        </div>
                        <div className='p-1'>
                            <hr />
                        </div>
                        <div className='p-2 problem'>
                        </div>
                        <div className='p-2'>
                            {companies.length !== 0 &&
                                <>
                                    <h5 className='success'>
                                        Company Tags:
                                    </h5>
                                    {companies.map((c, i) => (
                                        <Badge key={i} className='me-2' variant="primary">{c}</Badge>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                    <div className={activeTab === 1 ? `container1` : `container1 d-none`}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">User</th>
                                    <th scope="col">Result</th>
                                    <th scope="col">Language</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((x, i) =>
                                    <tr key={i}>
                                        <td>{x.username || x.userid}</td>
                                        <td className={x.success ? "success" : "failed"}>{x.success ? "success" : "failed"}</td>
                                        <td>{x.lang}</td>
                                        <td><button onClick={() => viewCode(x)} className="btn-sm">view code</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col sm={6} className='scrollable' style={{ padding: 0 }}>
                    <CodeEditor qu={qu} qd={qd} iTopic={iTopic} iQu={iQuestion} updateData={updateData} />
                    {activeSubmission && <MyModal active={activeSubmission} setActive={setActiveSubmissions} />}
                </Col>
            </Row>
        </Container >
    )
}

export default Question