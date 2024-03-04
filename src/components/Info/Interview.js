import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getOneApi, updateOneApi, deleteOneApi } from "../../services/interviewService"
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import InterviewForm from '../Interview/InterviewForm';
import Comments from './Comments';

function Interview({ questionData }) {
    const gridHeadings = ['Accenture', 'Athena Health', 'Amazon', 'Bank Of America', 'IBM', 'KPIT', 'Oracle', 'Persistent Systems', 'State Street', 'Sify', 'VISA', 'Wabtec'];
    const [data, setData] = useState({})
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { isLoggedIn } = useAuth();
    let navigate = useNavigate();
    const { id } = useParams()
    const getData = async () => {
        try {
            const resData = await getOneApi(id)
            setData(resData)
        } catch (error) {
            console.log(error);
        }
    }
    const editMe = async () => {
        setShowModal(true)
    }
    const deleteMe = async () => {
        try {
            const confirm = window.confirm("Delete this interview?")
            if (confirm) {
                await deleteOneApi(id)
                navigate("/interviews");
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleClose() {
        setShowModal(false)
    }

    async function handleSubmit(data) {
        try {
            setShowModal(false)
            await updateOneApi(id, data)
            getData()
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
        getData()
    }, [])

    useEffect(() => {
        !isLoggedIn && navigate("/login")
        // eslint-disable-next-line
    }, [isLoggedIn])

    return (
        <div className='container mt-3'>
            {data.self && <h5 className='d-flex justify-content-end pe-3'>
                <i className="fa fa-pencil text-success ms-2" role='button' onClick={editMe}></i>
                <i className="fa fa-trash text-danger ms-2" role='button' onClick={deleteMe}></i>
            </h5>}
            {data.interview ?
                <div className='bg-light p-4 rounded'>
                    <h1>{data.interview.title}</h1>
                    <h3>{data.interview.username} | {data.interview.company} | {data.interview.year} | {data.interview.position} | {data.interview.location} | {data.interview.category} | {data.interview.verdict}</h3>
                    <span className='mt-2'>{data.interview.text}</span>
                    <InterviewForm show={showModal} handleClose={handleClose} handleSubmit={handleSubmit} submitText="Update" questions={questions} companies={gridHeadings} values={data.interview} />
                </div> :
                <div className="d-flex justify-content-center">
                    <Spinner animation="grow" variant="success" />
                </div>
            }
            <div className="mt-2">
                <Comments self={data.self} post={data.interview} />
            </div>
        </div>
    )
}

export default Interview