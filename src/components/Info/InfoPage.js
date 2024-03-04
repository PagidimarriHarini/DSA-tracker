import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListApi } from "../../services/interviewService"
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

function InfoPage() {
    const [list, setList] = useState([])
    const { isLoggedIn } = useAuth();
    let navigate = useNavigate();
    const { company } = useParams()
    const getData = async () => {
        try {
            const data = await getListApi(company)
            setList(data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getData()
    }, [company])

    useEffect(() => {
        !isLoggedIn && navigate("/login")
        // eslint-disable-next-line
    }, [isLoggedIn])

    return (
        <div className='container mt-5'>
            {list.length === 0 &&
                <h2 className="text-center">Nothing found</h2>
            }
            <ul className="list-group">
                {list.map((item, index) => (<li className="list-group-item" key={index}>
                    <h5><Link to={"/interview/" + item._id}><strong className='me-2'>{item.title}</strong></Link> | {item.company}</h5>
                    <h6>{item.year} | {item.position} | {item.category} | {item.verdict} | {item.location}</h6>
                </li>))}
            </ul>
        </div>
    )
}

export default InfoPage