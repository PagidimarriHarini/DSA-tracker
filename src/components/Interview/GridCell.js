// GridCell.js

import React from 'react';
import { Link } from 'react-router-dom';
import './GridCell.css'; // Import the CSS file for GridCell

const GridCell = ({ heading }) => {
  return (
    <div className="grid-cell">
      <h1>{heading}</h1>
      <Link to={`/information/${heading.toLowerCase()}`}>
        <button>Read</button>
      </Link>
    </div>
  );
};

export default GridCell;
