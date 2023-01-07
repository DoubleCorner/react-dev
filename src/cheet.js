import React from "react";
import "./cheet.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.line?.includes(props.index)
          ? "lightblue"
          : "white",
      }}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  return (
    <div>
      {Array(3)
        .fill(0)
        .map((itemX, i) => (
          <div className="board-row" key={i}>
            {Array(3)
              .fill(0)
              .map((itemY, j) => (
                <Square
                  value={props.squares[3 * i + j]}
                  index={3 * i + j}
                  key={3 * i + j}
                  line={props.line}
                  onClick={() => props.onClick(3 * i + j)}
                />
              ))}
          </div>
        ))}
    </div>
  );
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          index: null,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares,
          index: i,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(index) {
    this.setState({
      stepNumber: index,
      xIsNext: (index & 2) === 0,
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((item, index) => {
      const desc = index
        ? `Go to move # ${index} 最后落棋点（行号，列号）：（${Math.ceil(
            item.index / 3
          )}, ${(item.index % 3) + 1}）`
        : "Go to game start";
      return (
        <li
          key={index}
          style={{
            fontWeight: index === this.state.stepNumber ? "bold" : "normal",
            marginBottom: "5px",
          }}
        >
          <button
            style={{ fontWeight: "inherit" }}
            onClick={() => this.jumpTo(index)}
          >
            {desc}
          </button>
        </li>
      );
    });

    const status = winner
      ? "Winner: " + winner.winner
      : winner === false
      ? "No Winner"
      : "Next player: " + (this.state.xIsNext ? "X" : "O");
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            line={winner?.line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }
  return squares.includes(null) ? null : false;
}
