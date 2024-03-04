import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewForm from './InterviewForm';
import GridCell from './GridCell';
import './Companies.css';
import { useAuth } from '../AuthContext';
import { addInterviewApi } from "../../services/interviewService"

const Companies = ({ questionData }) => {
  const { isLoggedIn } = useAuth();
  let navigate = useNavigate();
  const gridHeadings = ['Accenture', 'Athena Health', 'Amazon', 'Bank Of America', 'IBM', 'KPIT', 'Oracle', 'Persistent Systems', 'State Street', 'Sify', 'VISA', 'Wabtec'];
  const [heads, setHeads] = useState(gridHeadings)
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function searchStringInArray(searchString, stringArray) {
    const matchingValues = [];
    for (let i = 0; i < stringArray.length; i++) {
      if (stringArray[i].toLowerCase().includes(searchString.toLowerCase())) {
        matchingValues.push(stringArray[i]);
      }
    }
    return matchingValues;
  }

  function handleShow() {
    setShowModal(true)
  }

  function handleClose() {
    setShowModal(false)
  }

  async function handleSubmit(data) {
    try {
      setShowModal(false)
      await addInterviewApi(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let _list = []
    questionData.forEach(el => {
      _list.push(...el.questions)
    })
    setQuestions(_list)
  }, [])

  useEffect(() => {
    document.getElementsByClassName("searchbar")[0].addEventListener("input", (e) => {
      setHeads(searchStringInArray(e.target.value, gridHeadings));
    })
  }, [])

  useEffect(() => {
    !isLoggedIn && navigate("/login")
    // eslint-disable-next-line
  }, [isLoggedIn])

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary px-4">
        <div className="container-fluid">
          <span className="navbar-brand">Interview Experiences</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>
            <div className="d-flex">
              <input className="form-control me-2 searchbar" type="search" placeholder="Search" />
              <button className="btn btn-success" onClick={handleShow}>Add+</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="grid-container">
        {heads.map((heading, index) => (
          <GridCell key={index} heading={heading} />
        ))}
      </div>
      <InterviewForm show={showModal} handleClose={handleClose} handleSubmit={handleSubmit} submitText="Add" questions={questions} companies={gridHeadings} />
    </div>
  );
};

export default Companies;