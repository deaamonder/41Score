import React from 'react';
import '../styles/RoundHistory.css';

const RoundHistory = ({ history, players }) => {
  return (
    <div className="round-history">
      <h2>Round History</h2>
      <div className="history-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Round</th>
              {players.map((player, index) => (
                <th key={index}>{player.name || `Player ${player.id}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((round, roundIndex) => (
              <tr key={roundIndex}>
                <td>{roundIndex + 1}</td>
                {players.map((_, playerIndex) => (
                  <td 
                    key={playerIndex}
                    className="score-cell"
                    data-positive={round.scoreChanges[playerIndex] >= 0}
                  >
                    <div className="score-details">
                      <div className="guess">Guess: {round.guesses[playerIndex]}</div>
                      <div className="actual">Actual: {round.actuals[playerIndex]}</div>
                      <div className="points">
                        Points: {round.scoreChanges[playerIndex] > 0 ? '+' : ''}{round.scoreChanges[playerIndex]}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoundHistory; 