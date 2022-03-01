//Dijkstra's Algorithm - Single source shortest path algorithm.
//Return all nodes in the order they were visited
//We can return the shortest path by backtracking from the finish node.

//NOTE: The most efficient way of storing the unvisited nodes is in a min heap. However, here we have used an array.

const dijkstra = (grid, startNode, destNode)=>{
    //Edge Cases
    if(!startNode || !destNode || startNode == destNode) return false;
    //Making the distance of the starting node = 0
    startNode.distance = 0;

    const visitedNodesInOrder = []; //Used a bit later.

    //getAllNodes() will return all the nodes of the grid
    const unvisitedNodes = getAllNodes(grid);

    while(!!unvisitedNodes.length){
        
        //Sorting the unvisited nodes array so that the unvisited node with the shortest distance is the first element of the array.
        sortNodesByDistance(unvisitedNodes);
        // console.log(unvisitedNodes[0]);
        //shift() pops out the first element of the array, shifts rest of array elements one step to the left, and returns the popped element. In this case, we get the unvisited node with shortest distance in the closest node variable, which is what we need.
        const closestNode = unvisitedNodes.shift();
        //If the closest node is a wall, we do not do anything for that node.
        if(closestNode.isWall) continue;
        //Impossible case - When the distance of the closest node is infinity. We return the current state.
        if(closestNode.distance === Infinity) return visitedNodesInOrder;
        
        //Marking the closest node as visited, after checking the cases where it should not be marked as visited, and then appending it to an array of visited nodes
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        //if closest node is the destination node, we should stop executing dijkstra's and return the visited nodes array

        if(closestNode === destNode) return visitedNodesInOrder;

        //if closest node is not the destination node, then we update the distance of the neighbouring nodes
        updateUnvisitedNeighbours(closestNode, grid);
    }
}

const getAllNodes = (grid) => {
    const nodes = [];
    for(let row of grid){
        for(let node of row){
            nodes.push(node);
        }
    }
    return nodes;
}

const sortNodesByDistance = (unvisitedNodes)=>{
    //We define a compareFunction in the sort function which defines the sort order.
    //We want to sort on the basis of the distance property of the objects present in the array
    //We want to sort in ascending order.
    unvisitedNodes.sort((nodeA, nodeB)=> nodeA.distance - nodeB.distance);
}

const updateUnvisitedNeighbours = (node, grid)=>{
    //We get the neighbours of the closest node.
    const neighbours = getUnvisitedNeighbours(node, grid);

    //We update the distances of each neighbour. Since our algorithm is unweighted, the distance of all the neighbouring is 1 plus the distance of the cuurent closest node. Hence we add one to the distance of all the neighbouring nodes.

    //Also, we are not considering diagonal movement, hence the only neighbouring nodes are the ones on the immediate top, left, bottom and right of the current node.

    //Add weighted dijkstra functionality later.

    for(let neighbouringNode of neighbours){
        neighbouringNode.distance = node.distance+1;
        neighbouringNode.previousNode = node;
    }
}

const getUnvisitedNeighbours = (node, grid)=>{
    //We will return the nodes that are at the immediate top, left, bottom and right of the node passed as parameter.
    const neighbours = [];
    const {col,row} = node;

    //The top neighbour
    if(row>0) neighbours.push(grid[row-1][col]);
    //The left neighbour
    if(col>0) neighbours.push(grid[row][col-1]);
    //The bottom neighbour
    if(row<grid.length-1) neighbours.push(grid[row+1][col]);
    //The right neighbour
    if(col<grid[0].length-1) neighbours.push(grid[row][col+1]);

    return neighbours.filter(neighbour => !neighbour.isVisited);
}

export default dijkstra;