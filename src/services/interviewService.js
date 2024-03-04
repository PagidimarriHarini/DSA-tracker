
export const addInterviewApi = async (data) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/i/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify(data)
        })
        const resData = await res.text()
        return resData
    } catch (error) {
        throw error
    }
}

export const getListApi = async (company) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/i/getList/${company}`, {
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

export const getOneApi = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/i/getOne/${id}`, {
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

export const updateOneApi = async (id, data) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/i/updateOne/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify(data)
        })
        const resData = await res.text()
        return resData
    } catch (error) {
        throw error
    }
}

export const deleteOneApi = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/i/deleteOne/${id}`, {
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
