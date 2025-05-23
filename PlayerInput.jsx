import React from 'react';

const PlayerInput = ({ player, allPlayers, onNameChange }) => {
  const otherPlayer = allPlayers.find(p => p.id !== player.id);

  const isLeading = otherPlayer && player.score > otherPlayer.score;
  return (
    <div className="player">
      <input
        type="text"
        placeholder="Player Name"
        value={player.name}
        onChange={(e) => onNameChange(player.id, e.target.value)}
      />
      <span>Score: {player.score}</span>
      {isLeading && <span>Leading!</span>}
    </div>
  );
};

export default PlayerInput; 