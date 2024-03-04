// services/userService.js

export const postSignupData = async (formData) => {
  try {
    const { name, email, password } = formData;

    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/u/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkLoginData = async (email, password) => {
  try {
    const checkResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/u/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const checkData = await checkResponse.json();
    return checkData;
  } catch (error) {
    throw error
  }
};

export const getMyId = async () => {
  try {
    const checkResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/u/getId`, {
      headers: {
        "authToken": localStorage.getItem("authToken")
      }
    });

    const checkData = await checkResponse.json();
    localStorage.setItem("userid", checkData._id)
    return checkData;
  } catch (error) {
    throw error
  }
};
