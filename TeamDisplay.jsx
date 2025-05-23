
import React from 'react';
import PlayerInput from './PlayerInput';

const TeamDisplay = ({ teamNumber, players, teamScore, onNameChange }) => {
  const teamPlayers = players.filter(p => p.team === teamNumber);
  
  return (
    <div className="team">
      <h2>Team {teamNumber}: {teamScore} points</h2>
      {teamPlayers.map((player) => (
        <PlayerInput
          key={player.id}
          player={player}
          onNameChange={onNameChange}
        />
      ))}
    </div>
  );
};

export default TeamDisplay; 
/*
import React from 'react';
import PlayerInput from './PlayerInput';

const PlayersDisplay = ({ teamNumber, players, onNameChange }) => {
  const teamPlayers = players.filter(p => p.team === teamNumber);
  
  return (
    <div className="team">
      {teamPlayers.map((player) => (
        <PlayerInput
          key={player.id}
          player={player}
          onNameChange={onNameChange}
        />
      ))}
    </div>
  );
};

export default TeamDisplay; */