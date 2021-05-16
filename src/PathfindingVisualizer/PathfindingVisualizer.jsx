import React , { useState, useEffect } from 'react';
import Node from './Node/Node';
import Dijkstra from '../algorithms/dijkstra';


import './PathfindingVisualizer.css';

//Initializing the row and column values of start node and destination node.

const START_ROW = 8;
const START_COL = 10;
const DEST_ROW = 8;
const DEST_COL = 40;

const PathfindingVisualizer = ()=>{
    //Declaring grid as a state variable using React Hooks
    const [grid, setGrid] = useState([]);
    //Whether mouse is pressed or not is stored in another state variable, which is declared below. Initialized as false.
    const [isMousePressed , setIsMousePressed] = useState(false);
    
    //This useEffect() will run only when the component mounts on the DOM. Just once.
    //The purpose of this function is to set the state of the grid state variable so that it holds all the nodes of the grid that will be drawn on the screen.


    useEffect(() => {
        const temp_grid = [];
        for(let row=0;row<16;row++){
            const curr_row = []
            for(let col=0;col<50;col++){
                const currentNode = {
                    col,
                    row,
                    isWall: false, //Initially no nodes are walls.
                    isStart: row===START_ROW && col===START_COL,
                    isFinish: row===DEST_ROW && col===DEST_COL,
                    distance: Infinity, //Initially, the distance of all nodes is infinity (except the start node, but the start node distance is assigned a value of 0 in the dijkstra algorithm code.)
                    isVisited: false,  //Initially no node is visited, hence false for all.
                    previousNode: null  //Used for backtracking to get the shortest path
                }
                curr_row.push(currentNode);
            }
            temp_grid.push(curr_row);
        }
        setGrid(temp_grid);
        // return () => {
        //     cleanup
        // }
    },[]);

    //Functions to handle wall functionality

    //When the mouse is pressed down, then if the node is not a wall it will change to a wall, and if the node is a wall it will change to a normal node.

    const handleMouseDown = (row, col)=>{
        //Getting a new grid with the walls included, storing it in newGrid variable and updating the grid state variable.
        const newGrid = getWallUpdatedGrid(grid, row, col);
        setGrid(newGrid);

        //Since mouse down only considers situation where mouse key is pressed down, the isMousePressed state should be changed to true.
        setIsMousePressed(true);
    }

    //When mouse is hovering, if mouse button is pressed, we create walls on all the nodes over which mouse is hovering.

    const handleMouseEnter = (row,col)=>{
        //If mouse button is not pressed, hovering does nothing.
        if(!isMousePressed) return;

        //If mouse button pressed, creating walls.
        const newGrid = getWallUpdatedGrid(grid,row,col);
        setGrid(newGrid);
    }

    //When mouse button is released, we only have to change the mouse pressed state to false, if it was true.

    const handleMouseUp = ()=>{
        // console.log("If we are mousing up, console log!")
        setIsMousePressed(false);
    }

    //getWallUpdatedGrid() - returns a new grid with walls created on the nodes required.

    const getWallUpdatedGrid = (grid, row, col)=>{
        const newGrid = grid.slice();   //Storing the current state of grid
        const newNode = {
            ...newGrid[row][col],
            isWall: !newGrid[row][col].isWall,
        }   //newNode has all the same properties from the corresponding node of the old grid, except the wall state is toggled.
        newGrid[row][col] = newNode;    //setting the new node in the updated grid.
        return newGrid;
    }

    //Function which will call the Dijkstra algorithm code, and the function which will render the dijkstra animation on the screen.
    const visualizeDijkstra = ()=>{
        const startNode = grid[START_ROW][START_COL];
        const destNode = grid[DEST_ROW][DEST_COL];
        
        //Calling Dijkstra algorithm, and storing all the nodes which were visited before reaching the destination node.
        const visitedNodesInOrder = Dijkstra(grid, startNode, destNode);

        // getNodesInShortestPathOrder() involves backtracking from the destination node, to determine which is the shortest path which will lead to reaching the start node from the destination node.
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(destNode);

        //Dijkstra animation.
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const getNodesInShortestPathOrder = (node)=>{
        const nodesInShortestPathOrder = []
        while(node !== null){
            nodesInShortestPathOrder.unshift(node);
            node = node.previousNode;
        }
        return nodesInShortestPathOrder;
    }
    const animateDijkstra = (visitedNodesInOrder,nodesInShortestPathOrder)=>{
        for(let i=0;i<visitedNodesInOrder.length;i++) {
            setTimeout(()=>{
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'block visited';
            },10*i)
        }
        setTimeout(()=>{
            for(let i=0;i<nodesInShortestPathOrder.length;i++){
            setTimeout(()=>{
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'block shortest-path';
            },50*i)
        }
        },10*visitedNodesInOrder.length)
    }

    return(
        <div>
            <nav>
                <ul>
                    <li>
                        <div className="legend-start"></div>
                        Start Node.
                    </li>
                    <li>
                        <div className="legend-finish"></div>
                        Destination Node.
                    </li>
                    <li>
                        <div className="legend-wall"></div>
                        Opaque Wall Node.
                    </li>
                    <li>
                        <div className="legend-visited"></div>
                        Visited Nodes.
                    </li>
                    <li>
                        <div className="legend-shortest-path"></div>
                        Shortest Path.
                    </li>
                </ul>
            </nav>
            <div className = "grid">
                {grid.map((row, rowIndex)=>{
                    return <div key={rowIndex}>
                        {row.map((node, nodeIndex)=> {
                            const {row, col, isStart , isFinish, isWall, previousNode} = node
                            return(
                                <Node
                                    key={nodeIndex}
                                    row={row}
                                    col={col}
                                    isStart = {isStart} 
                                    isFinish = {isFinish}
                                    isWall = {isWall}
                                    onMouseDown={(row,col)=>handleMouseDown(row,col)}
                                    onMouseUp={()=>handleMouseUp()}
                                    onMouseEnter={(row,col)=>handleMouseEnter(row,col)}
                                    previousNode={previousNode}
                                ></Node>
                            )
                        })}
                    </div>
                })}
            </div>
            <button onClick = {()=>visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
       </div> 
    )
}

export default PathfindingVisualizer;