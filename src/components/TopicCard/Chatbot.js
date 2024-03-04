import React, { useEffect } from 'react'
import "./chatbot.css";

function Chatbot() {

    useEffect(() => {
        firstBotMessage();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const coll = document.querySelectorAll(".collapsible");

        coll.forEach((item) => {
            item.addEventListener("click", function () {
                this.classList.toggle("active");

                const content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }, []);


    const getTime = () => {
        let today = new Date();
        let hours = today.getHours();
        let minutes = today.getMinutes();

        if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        let time = hours + ":" + minutes;
        return time;
    };

    const getBotestResponse = (userText) => {
        // Convert user input to lowercase for case-insensitive matching
        const lowerUserText = userText.toLowerCase();

        // Define your custom questions and corresponding answers
        const customResponses = {
            "hello": "Hi there! How can I assist you?",
            "your name": "I'm a chatbot. You can call me ChatBot!",
            "explain array": "An array is a data structure that stores a collection of elements, each identified by an index or a key. It provides a contiguous memory location for efficient access and manipulation of ordered data in a linear fashion.",
            "explain linkedlist": "A linked list is a linear data structure where elements, called nodes, are connected sequentially. Each node contains data and a reference or link to the next node in the sequence.",
            "explain stack": "A stack is a linear data structure that follows the Last In, First Out (LIFO) principle, where elements are added and removed from the same end. It supports two main operations: pushing (adding) elements onto the top and popping (removing) elements from the top.",
            "explain queue": "A queue is a linear data structure that follows the First In, First Out (FIFO) principle, where elements are added at the rear and removed from the front. It supports two main operations: enqueue (adding) elements to the rear and dequeue (removing) elements from the front."
            // Add more custom questions and answers as needed
        };

        // Check if there's a custom response for the user's input
        if (customResponses.hasOwnProperty(lowerUserText)) {
            return customResponses[lowerUserText];
        }

        // If no custom response, provide a default response
        return "I'm sorry, I didn't understand that. Can you please ask another question?";
    };

    const firstBotMessage = () => {
        let firstMessage = "Hi, How can I help you?";
        const botStarterMessage = document.getElementById("botStarterMessage");
        botStarterMessage.innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';

        let time = getTime();
        const chatTimestamp = document.getElementById("chat-timestamp");
        chatTimestamp.innerHTML = time;

        const userInput = document.getElementById("userInput");
        userInput.scrollIntoView(false);
    };

    const getHardResponse = (userText) => {
        let botResponse = getBotestResponse(userText);
        let botHtml = '<p class="botText"><span>' + botResponse + '</span></p>';
        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML += botHtml;

        const chatBarBottom = document.getElementById("chat-bar-bottom");
        chatBarBottom.scrollIntoView(true);
    };

    const getResponse = () => {
        let userText = document.getElementById("textInput").value;

        if (userText === "") {
            userText = "I love Code Palace!";
        }

        let userHtml = '<p class="userText"><span>' + userText + '</span></p>';
        document.getElementById("textInput").value = "";

        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML += userHtml;

        const chatBarBottom = document.getElementById("chat-bar-bottom");
        chatBarBottom.scrollIntoView(true);

        setTimeout(() => {
            getHardResponse(userText);
        }, 1000);
    };

    const sendByEnter = e => {
        e.key === "Enter" && getResponse()
    }

    const sendButton = () => {
        getResponse();
    };

    return (
        <div className="chat-bar-collapsible">
            <button id="chat-button" type="button" className="collapsible">
                Chat with us!
                <i id="chat-icon" style={{ color: "#fff" }} className="fa fa-fw fa-comments-o"></i>
            </button>

            <div className="content">
                <div className="full-chat-block">
                    {/* Message Container */}
                    <div className="outer-container">
                        <div className="chat-container">
                            {/* Messages */}
                            <div id="chatbox">
                                <h5 id="chat-timestamp">00:00</h5>
                                <p id="botStarterMessage" className="botText">
                                    <span>Loading...</span>
                                </p>
                            </div>

                            {/* User input box */}
                            <div className="chat-bar-input-block">
                                <div id="userInput">
                                    <input
                                        id="textInput"
                                        className="input-box"
                                        type="text"
                                        name="msg"
                                        placeholder="Tap 'Enter' to send a message"
                                        onKeyDown={sendByEnter}
                                    />
                                    <p></p>
                                </div>

                                <div className="chat-bar-icons">
                                    <i
                                        id="chat-icon"
                                        style={{ color: "#333" }}
                                        className="fa fa-fw fa-send"
                                        onClick={sendButton}
                                    ></i>
                                </div>
                            </div>

                            <div id="chat-bar-bottom">
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatbot