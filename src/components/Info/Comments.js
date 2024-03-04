import React, { useEffect, useState } from 'react'
import { AddNewApi, deleteOneApi, getCommentsApi, replyApi } from "../../services/commentService"

const el = id => document.getElementById(id)

function Comments({ self, post }) {
    const [data, setData] = useState([])
    const [input, setInput] = useState("")
    const loadData = async () => {
        try {
            const res = await getCommentsApi(post._id)
            setData(res)
        } catch (error) {
            console.log(error);
        }
    }
    const AddComment = async () => {
        try {
            await AddNewApi(post._id, input)
            loadData()
        } catch (error) {
            console.log(error);
        }
    }
    const AddCommentByEnter = async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            AddComment()
        }
    }
    const replyTo = async (to, text) => {
        await replyApi(post, to, text)
        loadData()
    }
    const deleteMe = async (id) => {
        const conf = window.confirm("Delete comment?")
        if (conf) {
            await deleteOneApi(id)
            loadData()
        }
    }
    useEffect(() => {
        post && loadData()
    }, [post])

    return (
        <div className='bg-light rounded p-2'>
            <strong> Comments: </strong>

            <div className="d-flex justify-content-center align-items-center m-2">
                <div style={{ width: "50vw" }}>
                    <textarea className="form-control form-control-sm" id="comInput" placeholder='Add a comment..'
                        value={input} onChange={e => setInput(e.target.value)} onKeyDown={AddCommentByEnter} />
                </div>
                <i className="fa fa-paper-plane ms-3" role='button' onClick={AddComment}></i>

            </div>

            <div className="m-2">
                {data.map((c, i) => (
                    !c.replyTo && <div key={i}>
                        <div className='border p-2 mb-2'>
                            <h6 className='fw-light'>{new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: "numeric" })}
                                {c.userid === localStorage.getItem("userid") &&
                                    <i className="fa fa-trash text-danger ms-3" role='button' onClick={() => deleteMe(c._id)}></i>
                                }
                            </h6>
                            <h6><strong className='me-3'>{c.username}:</strong>{c.text}</h6>
                            {self &&
                                <>
                                    <div className="d-flex justify-content-center align-items-center m-2">
                                        <div style={{ width: "50vw" }}>
                                            <textarea className="form-control form-control-sm" rows={1} id="replyInput" placeholder='Reply..'
                                                onKeyDown={(e) => {
                                                    if (e.code === "Enter" && !e.shiftKey) {
                                                        replyTo(c._id, e.target.value)
                                                    }
                                                }} />
                                        </div>
                                        <i className="fa fa-reply text-success ms-3" role='button'
                                            onClick={() => {
                                                replyTo(c._id, el("replyInput").value)
                                            }}></i>
                                    </div>
                                </>
                            }
                        </div>
                        {data.map((r, j) => (
                            r.replyTo && r.replyTo === c._id &&
                            <div key={j} className='border p-2 ms-5 mb-2'>
                                <h6 className='fw-light'>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: "numeric" })}
                                    {r.userid === localStorage.getItem("userid") &&
                                        <i className="fa fa-trash text-danger ms-3" role='button' onClick={() => deleteMe(r._id)}></i>
                                    }
                                </h6>
                                <h6><strong className='me-3'>{r.username}:</strong>{r.text}</h6>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments