import React from 'react';

import './Node.css';

const Node = (props)=>{
    const {row, col, isStart , isFinish, isWall, onMouseDown, onMouseUp, onMouseEnter} = props;
    const extraClassName = isStart ? "start" : isFinish ? "finish" : isWall ? "wall" : '';
    // const value = isStart ? "S" : isFinish ? "D" : ''
    return(
        <div 
            id={`node-${row}-${col}`} 
            className={`block ${extraClassName}`}
            onMouseUp={()=>onMouseUp()}
            onMouseDown={()=>onMouseDown(row,col)}
            onMouseEnter={()=>onMouseEnter(row,col)}
        ></div>
    )
}

export default Node;