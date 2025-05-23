import React from 'react';
import PlayerInput from './PlayerInput';

const PlayerDisplay = ({ players, onNameChange }) => {
    return (
        <div>
            <ul>
                {players.map(p =>
                    <li  key={p.id}>
                        <PlayerInput
                            player={p}
                            allPlayers={players}
                            onNameChange={onNameChange}
                        />
                    </li>
                )}
            </ul>
        </div>
    )   
};

export default PlayerDisplay;
