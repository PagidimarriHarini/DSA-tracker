import { React, useState, useEffect, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from "react-bootstrap/FormControl";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import Fade from "react-reveal/Fade";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./Topic.css";
import { ThemeContext } from "../../App";
import { useAuth } from '../AuthContext';
import Button from "react-bootstrap/Button";

function RandomButton({ data }) {
	let min = 0;
	let max = data?.questions?.length - 1;
	const [rnd, setRnd] = useState(Math.floor(Math.random() * (max - min)) + min);
	function pickRandomHandler() {
		setRnd(Math.floor(Math.random() * (max - min)) + min);
	}
	return (
		<>
			{
				data?.questions[rnd]?.URL?.startsWith("http") ?
					<Button
						className="pick-random-btn"
						onClick={pickRandomHandler}
						variant="outline-primary"
						href={data?.questions[rnd]?.URL}
						target="_blank"
					>
						Pick Random{" "}
						<span role="img" aria-label="woman-juggling-emoji" className="emojiFix">
							🤹🏻‍♀️
						</span>
					</Button> :
					<Link to={data?.questions[rnd]?.URL}
						className="btn btn-outline-primary pick-random-btn"
						onClick={pickRandomHandler}
					>
						Pick Random{" "}
						<span role="img" aria-label="woman-juggling-emoji" className="emojiFix">
							🤹🏻‍♀️
						</span>
					</Link>
			}
		</>
	);
}

function Topic({ data, updateData }) {

	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();

	const [select, setSelected] = useState([]);
	const [questionsTableData, setQuestionsTableData] = useState([]);
	const [topicName, setTopicName] = useState("");
	const [showNoteSection, setShowNoteSection] = useState(false);

	const dark = useContext(ThemeContext);

	useEffect(() => {
		!isLoggedIn && navigate("/login")
		// eslint-disable-next-line
	}, [isLoggedIn])


	useEffect(() => {
		if (data) {
			let doneQuestion = [];
			let tableData = data.questions?.map((question, index) => {
				if (question.Done) {
					doneQuestion.push(index);
				}
				/*
				|	Hidden properties `_is_selected` and `_search_text` are used to sort the table
				|	and search the table respectively. react-bootstrap-table does not allow sorting
				|	by selectRow by default, and requires plain text to perform searches.
				*/
				return {
					id: index,
					question: (
						<>
							{question.URL.startsWith("http") ?
								<a
									href={question.URL}
									target="_blank"
									rel="noopener noreferrer"
									style={{ fontWeight: "600", fontSize: "20px" }}
									className="question-link"
								>
									{question.Problem}
								</a> :
								<Link
									to={question.URL}
									style={{ fontWeight: "600", fontSize: "20px" }}
									className="question-link"
								>
									{question.Problem}
								</Link>
							}
							<OverlayTrigger
								placement="left"
								overlay={question.Notes && question.Notes.length !== 0 ? renderTooltipView : renderTooltipAdd}
							>
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										className={question.Notes && question.Notes.length !== 0 ? "bi bi-sticky-fill" : "bi bi-sticky"}
										viewBox="0 0 16 16"
										style={{ float: "right", color: "green", cursor: "pointer" }}
										onClick={() => shownotes(index)}
									>
										{question.Notes && question.Notes.length !== 0 ? (
											<path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177V9.5z" />
										) : (
											<path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z" />
										)}
									</svg>
								</div>
							</OverlayTrigger>
						</>
					),

					_is_selected: question.Done,
					_search_text: question.Problem,
				};
			});
			setQuestionsTableData(tableData);
			setTopicName(data.topicName);
			setSelected(doneQuestion);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	//tooltip functions
	const renderTooltipView = (props) => (
		<Tooltip {...props} className="in" id="button-tooltip">
			View Notes
		</Tooltip>
	);

	const renderTooltipAdd = (props) => (
		<Tooltip {...props} className="in" id="button-tooltip">
			Add Notes
		</Tooltip>
	);

	// seacrh bar config
	const SearchBar = (props) => {
		const handleChange = (e) => {
			props.onSearch(e.target.value);
		};
		return (
			<div className="topic-input-container">
				<div className="container">
					<div>
						<InputGroup className="mb-4">
							<div className="input-group-append">
								<RandomButton data={data} />
							</div>
							<FormControl
								className="text-center search-input-container"
								placeholder="Search Question.. 🔍"
								aria-label="Search Question"
								aria-describedby="basic-addon2"
								onChange={handleChange}
								style={{ fontSize: "18px", fontWeight: "600" }}
							/>
							<div className="input-group-prepend">
								<Badge
									variant="success"
									style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px", background: "rgb(200, 230, 201)" }}
								>
									<p className="completed-questions" style={{ color: "black", padding: "8px" }}>
										<span style={{ fontWeight: "bold" }}>
											{select.length}/{data?.questions?.length}
										</span>{" "}
										Done{" "}
										<span className="emojiFix" role="img" aria-label="checker">
											&#9989;
										</span>
									</p>
								</Badge>
							</div>
						</InputGroup>

					</div>
				</div>
			</div>
		);
	};

	// table config
	const columns = [
		{
			dataField: "id",
			text: "Q-Id",
			headerStyle: { width: "80px", fontSize: "20px", textAlign: "center" },
			style: { fontSize: "20px", textAlign: "center" },
			// events: {
			// 	onClick: (e, column, columnIndex, row, rowIndex) => {
			// 		handleSelect(row, !row._is_selected);
			// 	},
			// },
		},
		{
			dataField: "question",
			text: "Questions",
			headerStyle: { fontSize: "20px", textAlign: "center" },
		},
		{
			dataField: "_is_selected",
			text: "Is Selected",
			headerStyle: { fontSize: "20px" },
			hidden: true,
			sort: true,
		},
		{
			dataField: "_search_text",
			text: "Search Text",
			headerStyle: { fontSize: "20px" },
			hidden: true,
		},
	];
	const rowStyle = { fontSize: "20px" };
	const selectRow = {
		mode: "checkbox",
		style: { background: dark ? "#393E46" : "#c8e6c9", fontSize: "24px" },
		selected: select,
		onSelect: handleSelect,
		hideSelectAll: true,
	};
	const sortMode = {
		dataField: "_is_selected",
		order: "asc",
	};

	async function handleSelect(row, isSelect) {
		setSelected((prevSelect) => {
			const updatedSelect = isSelect
				? [...prevSelect, row.id]
				: prevSelect.filter((selectedId) => selectedId !== row.id);

			const updatedQuestions = data.questions.map((question, index) => ({
				...question,
				Done: updatedSelect.includes(index),
			}));

			// Calculate the number of done questions directly from updatedSelect
			const doneQuestionsCount = updatedSelect.length;

			// Check if there are any done questions to determine the 'started' status
			const startedStatus = doneQuestionsCount > 0;

			// Assuming row.id is the correct identifier for your question
			updateData({
				started: startedStatus,
				doneQuestions: doneQuestionsCount,
				questions: updatedQuestions,
			}, data.position, row.id);

			displayToast(isSelect, doneQuestionsCount);

			return updatedSelect;
		});
	}



	// trigger an information message for user on select change
	function displayToast(isSelect, doneQuestionsCount) {
		const { type, icon, dir } = {
			type: isSelect ? "Done" : "Incomplete",
			icon: isSelect ? "🎉" : "🙇🏻‍♂️",
			dir: isSelect ? "👇🏻" : "👆🏻",
		};

		const title = `${doneQuestionsCount}/${data.questions.length} Done`;
		const subTitle = `Question pushed ${dir} the table.`;

		const Card = (
			<>
				<p>
					{title} <span className="emojiFix">{icon}</span>
				</p>
				<p className="toast-subtitle">{subTitle}</p>
			</>
		);

		toast(Card, {
			className: `toast-${type}`,
			autoClose: 2000,
			closeButton: true,
		});
	}



	//Notes component
	const NoteSection = (props) => {
		let id = localStorage.getItem("cid");

		const [quickNotes, setQuickNotes] = useState(data?.questions[id]?.Notes);
		const addnewnotes = (event) => {
			setQuickNotes(event.target.value);
		};

		const onadd = () => {
			let key = topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();

			if (id) {
				let que = data.questions;
				que[id].Notes = quickNotes.trim().length === 0 ? "" : quickNotes.trim();
				updateData(
					key,
					{
						started: data.started,
						doneQuestions: data.doneQuestions,
						questions: que,
					},
					data.position,
					id
				);
				localStorage.removeItem("cid");
				saveAndExitNotes();
			}
		};


		return (
			<>
				<div className="note-area" style={{ display: showNoteSection ? "block" : "none" }}>
					<div className="note-container">
						<div className="question-title" style={{ color: "black" }}>{data?.questions[id]?.Problem}</div>
						<textarea maxLength="432" className="note-section" style={{ display: showNoteSection ? "block" : "none" }} placeholder="your notes here" value={quickNotes} onChange={addnewnotes}></textarea>
						<div className="button-container">
							<button className="note-exit" style={{ display: showNoteSection ? "block" : "none" }} onClick={saveAndExitNotes}>
								Close
							</button>
							<button className="note-save" style={{ display: showNoteSection ? "block" : "none" }} onClick={onadd}>
								Save
							</button>
						</div>
					</div>
				</div>
			</>
		);
	};
	//function for closing notes
	function saveAndExitNotes() {
		localStorage.removeItem("cid");
		setShowNoteSection(false);
	}
	//funtion for taking notes
	function shownotes(ind) {
		localStorage.setItem("cid", ind);
		setShowNoteSection(true);
	}
	return (
		<>
			<br />

			<h1 className="text-center mb-4">
				{topicName} Problems
			</h1>

			<h3 className="text-center mb-4">
				<Link to="/">Topics</Link>/{topicName}
			</h3>


			<ToolkitProvider
				className="float-right"
				keyField="id"
				data={questionsTableData}
				columns={columns}
				rowStyle={rowStyle}
				search
			>
				{(props) => (
					<div>
						<div className="header-rand">{SearchBar({ ...props.searchProps })}</div>

						<div className="container container-custom" style={{ overflowAnchor: "none" }}>
							<Fade duration={1000}>
								<BootstrapTable {...props.baseProps} selectRow={selectRow} sort={sortMode} classes={dark ? "dark-table" : ""} />
							</Fade>
						</div>
					</div>


				)}
			</ToolkitProvider>

			<ToastContainer />
			<NoteSection />

		</>
	);
}


export default Topic;
