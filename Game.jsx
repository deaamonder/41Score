import React, { useState , useEffect } from 'react';
import TeamDisplay from './TeamDisplay';
import RoundInput from './RoundInput';
import RoundHistory from './RoundHistory';
import PlayerDisplay from './PlayerDisplay';
import '../styles/Game.css';

const VALID_GUESSES = [2, 3, 4, 5, 7];

const Game = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '', score: 0, team: 1, over30: false, over40: false, over50: false },
    { id: 2, name: '', score: 0, team: 2, over30: false, over40: false, over50: false },
    { id: 3, name: '', score: 0, team: 1, over30: false, over40: false, over50: false },
    { id: 4, name: '', score: 0, team: 2, over30: false, over40: false, over50: false },
  ]);

  const [roundHistory, setRoundHistory] = useState([]);

  const [currentRound, setCurrentRound] = useState({
    dealer: 0,
    currentGuesses: Array(4).fill(null),
    actualScores: Array(4).fill(null),
  });

  const [winTeam, setWinTeam] = useState(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [playerWarningMessage, setPlayerWarningMessage] = useState(Array(4).fill('')); //here I use an array because i want a warning message for every player , avoiding over writting the message. 
  
  
  useEffect(() => {
    const winner = checkWinCondition();
    if(winner === 1) {
      //alert('Team 1 wins!');
      setWinTeam(1);
    }
    if(winner === 2) {
      //alert('Team 2 wins!');
      setWinTeam(2);
    }
  }, [players]);

  const isValidRound = (currentRound) => {
    return currentRound.currentGuesses.reduce((sum, guess) => sum + guess, 0) >= 11;
  };

  const calculateTeamScore = (teamNumber) => {
    return players
      .filter((player) => player.team === teamNumber)
      .reduce((sum, player) => sum + player.score, 0);
  };

  const handleNameChange = (playerId, newName) => {
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, name: newName } : p
    ));
  };

  const handleGuessSubmit = (playerIndex, guess) => {
    if (!VALID_GUESSES.includes(guess)) return;
    
    const playerScore = players[playerIndex].score;

    setCurrentRound((prev) => ({
      ...prev,
      currentGuesses: prev.currentGuesses.map((g, i) => 
        i === playerIndex ? guess : g
      ),
    }));

    const updatedGuesses = currentRound.currentGuesses.map((g, i) => 
      i === playerIndex ? guess : g
    );

    let tempWarningMessage = '';

    if (playerScore >= 50 && playerScore !== 51 && guess < 5) {
      tempWarningMessage = players[playerIndex].name + ' must guess 5 or more points because your score is over 50.';
    } else if (playerScore >= 40 && playerScore !== 41 && guess < 4) {
      tempWarningMessage = players[playerIndex].name + ' must guess 4 or more points because your score is over 40.';
    } else if (playerScore >= 30 && guess < 3) {
      tempWarningMessage = players[playerIndex].name + ' must guess 3 or more points because your score is over 30.';
    }
    
    setPlayerWarningMessage(prev => {
      const updated = [...prev];
      updated[playerIndex] = tempWarningMessage;
      return updated;
    });

    if (!isValidRound({ ...currentRound, currentGuesses: updatedGuesses })) {
      setWarningMessage('Round is not valid. Please make sure the sum of the guesses is at least 11.');
    } else {
      setWarningMessage('');
    } 
  };

  const handleActualScoreSubmit = (playerIndex, actualScore) => {
    setCurrentRound((prev) => ({
      ...prev,
      actualScores: prev.actualScores.map((s, i) => 
        i === playerIndex ? actualScore : s
      ),
    }));
  };

  const finalizeRound = () => {
    if(warningMessage === ''){
    
      const guesses = currentRound.currentGuesses;
      const actuals = currentRound.actualScores;
      const scoreChanges = [];

      const newScores = players.map((player, index) => {
        const guess = guesses[index];
        const actual = actuals[index];
        
        let scoreChange = 0;
        if(actual === 1){
          if(guess === 7){
            scoreChange = 14; 
          } else {
            scoreChange = guess;
          }
        } else {
          scoreChange = -guess;
        }
        scoreChanges.push(scoreChange);

        const newScore = player.score + scoreChange;

        return {
          ...player,
          score:  newScore,
          over30: newScore >= 30,
          over40: newScore >= 40 && newScore !== 41,
          over50: newScore >= 50 && newScore !== 51, 
        };
      });

      // Add round to history
      setRoundHistory(prev => [...prev, {
        guesses: [...guesses],
        actuals: [...actuals],
        scoreChanges: scoreChanges,
        dealer: currentRound.dealer
      }]);

      setPlayers(newScores);
      setCurrentRound({
        dealer: (currentRound.dealer + 1) % 4,
        currentGuesses: Array(4).fill(null),
        actualScores: Array(4).fill(null),
      });

    }
  };

  const checkWinCondition = () => {
    const team1HasNegative = players.some(p => p.team === 1 && p.score < 0);
    const team2HasNegative = players.some(p => p.team === 2 && p.score < 0);

    const team1Has41 = players.some(p => p.team === 1 && p.score >= 41);
    const team2Has41 = players.some(p => p.team === 2 && p.score >= 41);

    const team1Has51 = players.some(p => p.team === 1 && p.score >= 51);
    const team2Has51 = players.some(p => p.team === 2 && p.score >= 51);

    const team1Has61 = players.some(p => p.team === 1 && p.score >= 61);
    const team2Has61 = players.some(p => p.team === 2 && p.score >= 61);

    /*if players from both teams have reached 41 at the same time the game continue to 51
    and if they reach 51 at the same time the game continue to 61 and so on... */

    const draw41 = team1Has41 && team2Has41;
    const draw51 = team1Has51 && team2Has51;
      
    
    if(!draw41){
      if (team1Has41 && !team1HasNegative) {
        return 1;
      }
      if (team2Has41 && !team2HasNegative) {
        return 2;
      }
    }
    else{
      if(team1Has51 && !team1HasNegative){
        return 1;
      }
      if(team2Has51 && !team2HasNegative){
        return 2;
      }  
    }
    if(!draw51){
      if(team1Has51 && !team1HasNegative){
        return 1;
      }
      if(team2Has51 && !team2HasNegative){
        return 2;
      }
    }
    else{
      if(team1Has61 && !team1HasNegative){
        return 1;
      }
      if(team2Has61 && !team2HasNegative){
        return 2;
      }
    }
    return null;
  };

  return (
    <div className="game-container">
      <h1>41 Score Tracker</h1>
      
      <div className="teams-container">
        {/*}
        <TeamDisplay
          teamNumber={1}
          players={players}
          teamScore={calculateTeamScore(1)}
          onNameChange={handleNameChange}
        />
        <TeamDisplay
          teamNumber={2}
          players={players}
          teamScore={calculateTeamScore(2)}
          onNameChange={handleNameChange}
        />
        */}
        <PlayerDisplay
          players={players}
          onNameChange={handleNameChange}
        />
      </div>

      <RoundInput
        players={players}
        currentRound={currentRound}
        onGuessSubmit={handleGuessSubmit}
        onActualScoreSubmit={handleActualScoreSubmit}
        onFinalizeRound={finalizeRound}
      />

      {winTeam && (
        <div className="win-message">
          <div>
            {players.find(p => p.team === winTeam).name} from Team {winTeam} wins!
          </div>
          <button onClick={() => { 
            setWinTeam(null)
            setPlayers(players.map(p => ({ ...p, score: 0 })));
            setRoundHistory([]);
          }}>Reset</button>    
        </div>
      )}

      {warningMessage && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
        {warningMessage}
        </div>
      )}

      {playerWarningMessage.map((warning, idx) => (
        warning && (
          <div key={idx} style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
            {warning}
          </div>
        )
      ))}

      <RoundHistory 
        history={roundHistory}
        players={players}
      />

    </div>
  );
};

export default Game; 