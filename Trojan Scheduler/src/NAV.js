import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "./styles.css";
import logo from "./logo.jpeg";
import ClassInput from "./ClassInput";
import Coursebin from "./Coursebin";

export default function NAV() {
  return (
    <div className="NAV">
      <p>Trojan Scheduler</p>
      <Link to="/">ClassInput</Link>
      <Link to="/Coursebin">Coursebin</Link>

      <img src={logo} alt="USC Logo" />
    </div>
  );
}
