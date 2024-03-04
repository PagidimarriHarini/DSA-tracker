
export const AddNewApi = async (postid, text) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/c/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify({postid, text})
        })
        const resData = await res.text()
        return resData
    } catch (error) {
        throw error
    }
}

export const replyApi = async (post, replyTo, text) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/c/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify({ post, replyTo, text })
        })
        const resData = await res.text()
        return resData
    } catch (error) {
        throw error
    }
}

export const getCommentsApi = async (postid) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/c/view/${postid}`, {
            headers: {
                "authToken": localStorage.getItem("authToken")
            },
        })
        const resData = await res.json()
        return resData
    } catch (error) {
        throw error
    }
}

export const deleteOneApi = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/c/delete/${id}`, {
            method: "DELETE",
            headers: {
                "authToken": localStorage.getItem("authToken")
            },
        })
        const resData = await res.text()
        return resData
    } catch (error) {
        throw error
    }
}
