import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button, Form } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-beautify';
import { getCodeApi, saveCodeApi, runCodeApi, submitCodeApi } from "../../services/questionService"

function CodeEditor({ qu, qd, updateData, iTopic, iQu }) {
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('monokai');
    const [code, setCode] = useState("");
    const [running, setRunning] = useState(false);
    const [resultClass, setResultClass] = useState("failed");

    useEffect(() => {
        require('ace-builds/src-noconflict/mode-python');
        require('ace-builds/src-noconflict/mode-c_cpp');
        require('ace-builds/src-noconflict/mode-java');
        require('ace-builds/src-noconflict/theme-github');
        require('ace-builds/src-noconflict/theme-twilight');
    }, []);

    useEffect(() => {
        if (!localStorage.getItem(qu + language)) {
            getCode(language, 1)
        } else {
            setCode(localStorage.getItem(qu + language))
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        localStorage.setItem(qu + language, code)
        saveCodeApi(qu, language, code)
        // eslint-disable-next-line
    }, [code]);

    const getCode = async (lang, key) => {
        try {
            const resData = await getCodeApi(qu, lang, key)
            setCode(resData.code)
        } catch (error) {
            console.log(error);
        }
    }

    const runCode = async (lang, code) => {
        try {
            setRunning(true)
            document.getElementsByClassName("result")[0].scrollIntoView({ behavior: 'smooth' })
            const resData = await runCodeApi(qu, lang, code)
            resData.got.output === resData.expected ? setResultClass("success") : setResultClass("failed")

            document.getElementsByClassName("result")[0].innerHTML = `for input: ${resData.input}<br>expected output: ${resData.expected}<br>your output: ${resData.got.output || resData.got.error}`
        } catch (error) {
            alert("could not run the code");
            console.log(error);
        } finally {
            setRunning(false)
            document.getElementsByClassName("result")[0].scrollIntoView({ behavior: 'smooth' })
        }
    }

    const submitCode = async (lang, code) => {
        try {
            setRunning(true)
            document.getElementsByClassName("result")[0].scrollIntoView({ behavior: 'smooth' })
            const resData = await submitCodeApi(qu, lang, code)
            if (resData.total === resData.passed) {
                qd[iTopic].questions[iQu].Done = true
                updateData(qd[iTopic], iTopic, iQu)
                setResultClass("success")
            } else {
                setResultClass("failed")
            }
            document.getElementsByClassName("result")[0].innerHTML = `Passed: ${resData.passed}/${resData.total}`
        } catch (error) {
            alert("could not run the code");
            console.log(error);
        } finally {
            setRunning(false)
            document.getElementsByClassName("result")[0].scrollIntoView({ behavior: 'smooth' })
        }
    }


    const onLangChange = (e) => {
        setLanguage(e.target.value)
        if (!localStorage.getItem(qu + e.target.value)) {
            getCode(e.target.value, 1)
        } else {
            setCode(localStorage.getItem(qu + e.target.value))
        }
    }

    const onCodeChange = val => setCode(val)

    return (
        <Accordion defaultActiveKey="0">
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="language">
                            <Form.Label>Language:</Form.Label>
                            <Form.Select value={language} onChange={onLangChange}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="theme">
                            <Form.Label>Theme:</Form.Label>
                            <Form.Select value={theme} onChange={e => setTheme(e.target.value)}>
                                <option value="monokai">Monokai</option>
                                <option value="github">GitHub</option>
                                <option value="twilight">Twilight</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <AceEditor
                        setOptions={{ useWorker: false }}
                        mode={language}
                        theme={theme}
                        value={code}
                        onChange={onCodeChange}

                        name="code-editor"
                        width="100%"
                        height="380px"
                        fontSize={14}
                    />
                    <Button variant="primary" className='mt-3 me-2' onClick={() => runCode(language, code)}>Run Code</Button>
                    <Button variant="primary" className='mt-3 me-2' onClick={() => submitCode(language, code)}>Submit Code</Button>
                    <Button variant="secondary" className='mt-3 me-2' onClick={() => getCode(language, 0)}>Reset Code</Button>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Spinner animation="border" variant="success" size="sm" className='m-2' style={running ? {} : { display: "none" }} />
                    <div className={`${resultClass} fw-bold result`}> </div>
                </Card.Body>
            </Card>
        </Accordion>
    );
}

export default CodeEditor;