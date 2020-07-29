import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";
import Arrow from "./images/arrow.png";
import Img1 from "./images/1.png";
import Img2 from "./images/2.png";
import Img3 from "./images/3.png";
import Img4 from "./images/4.png";
import Img5 from "./images/5.png";
import Img6 from "./images/6.png";
import Img7 from "./images/7.png";
import DiscreteSlider from "./slider";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const [value, setValue] = useState(300);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(value);
  speedRef.current = value;

  function handleChange(e) {
    setValue(parseInt(e.target.ariaValueNow, 10));
  }

  console.log(value);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, speedRef.current);
    console.log(speedRef.current);
  }, []);

  const nextStep = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setRunning(false);
  }, []);

  return (
    <div className="body">
      <div className="game">
        <h1>Conway's Game of Life</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 15px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: grid[i][k] ? "lavender" : undefined,
                  border: "solid 1px grey",
                }}
              />
            ))
          )}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}
        >
          <DiscreteSlider handleChange={handleChange} />
        </div>

        <div className="buttons">
          <button
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? <StopIcon/> : <PlayArrowIcon/>}
          </button>
          <button
            onClick={() => {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.7 ? 1 : 0
                  )
                );
              }

              setGrid(rows);
            }}
          >
            Random
          </button>

          <button
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                nextStep();
              }
            }}
          >
            Step
          </button>

          <button
            onClick={() => {
              setGrid(generateEmptyGrid());
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="instructions" style={{ width: "500px" }}>
        <h1 style={{ textAlign: "center" }}>Rules</h1>
        <p>
          Rule 1: If a cell has less than two surrounding cells, it will die
          (From under-population.)
        </p>
        <div className="rule1">
          <img src={Img1} alt="single square"></img>
          <img style={{ width: "100px" }} src={Arrow} alt="arrow"></img>
          <img src={Img2} alt="empty"></img>
        </div>
        <p>
          Rule 2: If a cell has more than three surrounding cells, it will die
          (From over-population.)
        </p>
        <div className="rule1">
          <img src={Img3} alt="overpopulation square"></img>
          <img style={{ width: "100px" }} src={Arrow} alt="arrow"></img>
          <img src={Img4} alt="dead cell"></img>
        </div>
        <p>
          Rule 3: If a dead cell has three surrounding cells, it will be reborn!
        </p>
        <div className="rule1">
          <img src={Img5} alt="overpopulation square"></img>
          <img style={{ width: "100px" }} src={Arrow} alt="arrow"></img>
          <img src={Img6} alt="dead cell"></img>
        </div>
        <p>
          Rule 4: If a cell has two or three surrounding cells, it will stay
          alive!
        </p>
        <div className="rule1">
          <img src={Img7} alt="overpopulation square"></img>
          <img style={{ width: "100px" }} src={Arrow} alt="arrow"></img>
          <img src={Img7} alt="dead cell"></img>
        </div>
      </div>
    </div>
  );
};

export default App;
