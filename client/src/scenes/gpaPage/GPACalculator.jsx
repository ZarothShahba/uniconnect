import React, { useState } from "react";
import "./GPACalculator.css";
import calculatorImage from "./calculatorImage.jpg";
import logoImage from "./orilogo.png"; // Replace with your logo image path
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";

const GPACalculator = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const [moduleCount, setModuleCount] = useState(1);
  const [fields, setFields] = useState([]);
  const [result, setResult] = useState(null);
  const [generated, setGenerated] = useState(false);

  const generateFields = () => {
    const newFields = Array.from({ length: moduleCount }, (_, index) => ({
      id: index + 1,
      credit: "",
      grade: "A",
    }));

    setFields(newFields);
    setResult(null);
    setGenerated(true);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    fields.forEach(({ credit, grade }) => {
      const credits = parseInt(credit);
      if (!isNaN(credits) && credits >= 1 && credits <= 10 && grade !== "") {
        totalCredits += credits;
        totalPoints += calculateGradePoints(grade) * credits;
      }
    });

    const gpa = totalPoints / totalCredits;
    setResult(`Your GPA is: ${gpa.toFixed(2)}`);
  };

  const calculateGradePoints = (grade) => {
    switch (grade) {
      case "A+":
        return 4.0;
      case "A":
        return 4.0;
      case "A-":
        return 3.7;
      case "B+":
        return 3.3;
      case "B":
        return 3.0;
      case "B-":
        return 2.7;
      case "C+":
        return 2.3;
      case "C":
        return 2.0;
      case "C-":
        return 1.7;
      case "D+":
        return 1.3;
      case "D":
        return 1.0;
      case "E":
        return 0.0;
      case "F":
        return 0.0;
      default:
        return 0.0;
    }
  };

  const clearScores = () => {
    // Clear scores for newly generated rows
    const newFields = fields.map((field) => ({
      ...field,
      credit: "",
      grade: "A", // Set the default grade or leave it as it is based on your preference
    }));

    setFields(newFields);
    setResult(null);
  };

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <div className="container">
          {!generated && (
            <div className="image-container">
              <img
                src={calculatorImage}
                alt="Calculator"
                className="calculator-image"
              />
            </div>
          )}
          <div className="calculator-container center">
            <div className="logo-above-calculator">
              <img src={logoImage} alt="Logo" className="logo-image" />
            </div>

            <div className="heading">GPA Calculator</div>

            <label htmlFor="moduleCount">Number of Modules:</label>
            <input
              type="number"
              id="moduleCount"
              min="1"
              max="10"
              value={moduleCount}
              onChange={(e) =>
                setModuleCount(Math.max(1, parseInt(e.target.value)))
              }
            />

            <button onClick={generateFields}>Generate Fields</button>

            <br></br>

            <div id="fields">
              {fields.map(({ id, credit, grade }) => (
                <div key={id} className="field-row">
                  <label>{`Module ${id}:`}</label>
                  <input
                    className="credits"
                    type="number"
                    placeholder="Credit (1-10)"
                    value={credit}
                    onChange={(e) => {
                      const newFields = fields.map((field) =>
                        field.id === id
                          ? { ...field, credit: e.target.value }
                          : field
                      );
                      setFields(newFields);
                      setResult(null);
                    }}
                    min="1"
                    max="10"
                  />
                  <select
                    value={grade}
                    onChange={(e) => {
                      const newFields = fields.map((field) =>
                        field.id === id
                          ? { ...field, grade: e.target.value }
                          : field
                      );
                      setFields(newFields);
                      setResult(null);
                    }}
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D">D+</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>
              ))}
            </div>

            {generated && (
              <div id="buttonContainer">
                <button onClick={calculateGPA}>Calculate GPA</button>
                <button
                  onClick={clearScores}
                  className="clear-button"
                  style={{ marginLeft: "10px" }}
                >
                  Clear
                </button>
              </div>
            )}
            <br></br>

            <div id="result">
              <b>{result}</b>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default GPACalculator;
