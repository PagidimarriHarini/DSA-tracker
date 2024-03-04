
import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TopicCard from "./components/TopicCard/TopicCard";
import About from "./components/About/About";
// import Footer from "./components/Footer/Footer";
import Topic from "./components/Topic/Topic";
import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Question from "./components/Question/Question";
import InfoPage from "./components/Info/InfoPage";
import Companies from "./components/Interview/Companies";
import PublicPage from "./PublicPage";
import { useAuth } from './components/AuthContext';
import Interview from "./components/Info/Interview";
import { getMyId } from "./services/userService"

/*
// add default props
// remove unused stuff
*/

// Creating a theme context
export const ThemeContext = createContext(null);

function App() {
  const { isLoggedIn } = useAuth();
  const [questionData, setQuestionData] = useState([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!("isDark" in window.localStorage)) {
      window.localStorage.setItem("isDark", dark);
    } else {
      let temp = window.localStorage["isDark"];
      setDark(temp === "true");
    }
  }, [dark]);

  useEffect(() => {
    if ("authToken" in window.localStorage) {
      if (questionData.length === 0) {
        fetchData()
      }
      if (!window.localStorage.getItem("userid")) {
        getMyId()
      }
    }
  }, [isLoggedIn, questionData]);

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3001/t/getData',
        {
          method: "GET",
          headers: {
            "authToken": localStorage.getItem("authToken")
          }
        }
      );
      const body = await response.json()
      setQuestionData(body.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  async function updateData(topicData, topicPosition, rowId) {
    try {
      await fetch('http://localhost:3001/t/updateData', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authToken": localStorage.getItem("authToken")
        },
        body: JSON.stringify({ topicData, topicPosition, rowId })
      });

      setQuestionData((prevData) =>
        prevData.map((topic, index) =>
          index === topicPosition ? { ...topic, ...topicData } : topic
        )
      );
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  }

  async function resetData(cb) {
    try {
      await fetch('http://localhost:3001/t/resetData', {
        method: "DELETE",
        headers: {
          "authToken": localStorage.getItem("authToken")
        }
      });
      setQuestionData([]);
      cb()
    } catch (error) {
      console.error("Error resetting data:", error.message);
    }
  }

  async function exportData(cb) {
    try {
      const response = await fetch('http://localhost:3001/t/exportData', {
        method: "POST",
        headers: {
          "authToken": localStorage.getItem("authToken")
        }
      });
      const body = await response.json()
      const dataJson = 'data:text/json;charset=utf-8,' + JSON.stringify(body.data);
      const _a = document.createElement("a")
      _a.href = encodeURI(dataJson)
      _a.download = `export-${Date.now()}.json`
      _a.click()
      _a.remove()
      cb()
    } catch (error) {
      console.error("Error exporting data:", error.message);
    }
  }

  async function importData(data, callback) {
    try {
      const res = await fetch('http://localhost:3001/t/importData', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authToken": localStorage.getItem("authToken")
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json()
      setQuestionData(resData);
      callback()
    } catch (error) {
      console.error("Error importing data:", error.message);
    }
  }

  return (
    <>
      <Header setQuestionData={setQuestionData} />
      <div className={dark ? "App dark" : "App"}>

        <ThemeContext.Provider value={dark}>
          <Routes>
            <Route
              exact
              path="/"
              element={<TopicCard questionData={questionData} />}
            />
            <Route path="/interviews" element={<Companies questionData={questionData} />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              exact
              path="/problems"
              element={<TopicCard questionData={questionData} />}
            />
            <Route
              path="/about"
              element={
                <About
                  resetData={resetData}
                  exportData={exportData}
                  importData={importData}
                />
              }
            />

            {questionData &&
              questionData.map((topic, index) => (
                <Route
                  key={index}
                  path={`/${encodeURI(topic.topicName.toLowerCase())}`}
                  element={<Topic data={topic} updateData={updateData} />}
                />
              ))
            }

            <Route path="/information/:company" element={<InfoPage />} />
            <Route path="/interview/:id" element={<Interview questionData={questionData} />} />
            <Route path="/question/:iTopic/:iQuestion/:qu" element={<Question qd={questionData} updateData={updateData} />} />

            <Route path="*" element={<PublicPage />} />
          </Routes>
        </ThemeContext.Provider>

      </div>
      {/* <Footer dark={dark} setDark={setDark} /> */}
    </>
  );
}

export default App;
