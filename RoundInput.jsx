import React from 'react';

const VALID_GUESSES = [2, 3, 4, 5, 7];

const RoundInput = ({ 
  players, 
  currentRound, 
  onGuessSubmit, 
  onActualScoreSubmit, 
  onFinalizeRound 
}) => {
  const isRoundComplete = !currentRound.currentGuesses.some(g => g === null);
  const Over30Player = players.find(p => p.score >= 30);  
  const Over40Player = players.find(p => p.score >= 40 && p.score !== 41);
  const Over50Player = players.find(p => p.score >= 50 && p.score !== 51);
  
  return (
    <div className="round-container">
      <h3>Current Round</h3>
      <p>Dealer: Player {currentRound.dealer + 1}</p>
      
      <div className="guesses">
        {players.map((player, index) => (
          <div key={player.id} className="player-guess">
            <span>{player.name || `Player ${player.id}`}</span>
            <select
              value={currentRound.currentGuesses[index] || ''}
              onChange={(e) => onGuessSubmit(index, Number(e.target.value))}
            >
              <option value="">Select Guess</option>
              {VALID_GUESSES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {/*<select
              value={currentRound.actualScores[index] ?? '' }
              onChange={(e) => onActualScoreSubmit(index, Number(e.target.value))}
            >
              <option value="">match the guess?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>*/}
            <label>Match the guess?</label>
            <input type='checkbox' checked={currentRound.actualScores[index] === 1} onChange={(e) => onActualScoreSubmit(index, Number(e.target.checked ? 1 : 0))} />
            
          </div>
        ))}
      </div>

      <button 
        onClick={onFinalizeRound}
        disabled={!isRoundComplete}
      >
        Finalize Round
      </button>
    </div>
  );
};

export default RoundInput; 