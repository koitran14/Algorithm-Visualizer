"use client"

import { Node } from './node';
import { dijkstra, getNodesInShortestPathOrder} from './dijkstra';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Flag, Play, Weight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
  
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isShortestPath: false,
      previousNode: null,
      isVisiting: false,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStartNode= (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: !node.isStart,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithFinishNode= (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isFinish: !node.isFinish,
    };
  
    newGrid[row][col] = newNode;
    return newGrid;
};

export const DijkstraVisualizer = () => {
    const [grid, setGrid] = useState(getInitialGrid);
    const [isSettingWall, setIsSettingWall] = useState(false);
    const [startNode, setStartNode] = useState(null);
    const [finishNode, setFinishNode] = useState(null);
    const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
    const [isExecuted, setIsExecuted] = useState(false);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [shortestLength, setShortLength] = useState(0);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const visualizeDijkstra = () => {
        if (startNode && finishNode ) {
            setIsExecuted(true);
            setIsRunningDijkstra(true);
            const visitedNode = dijkstra(grid, grid[startNode.row][startNode.col], grid[finishNode.row][finishNode.col]); 
            const shortestPath = getNodesInShortestPathOrder(grid[finishNode.row][finishNode.col])
            setShortLength(shortestPath? shortestPath.length : 0);
            animateDijkstra(visitedNode, shortestPath);
        } else {
            toast.error("Start or Finish node missing.",{
                description: "Please set start and end node before running."
            })
        }
    }

    const animateDijkstra = async (visitedNodesInOrder, nodesInShortestPathOrder) => {
      toast.loading("Processing...",{
        description: "Dijkstra is running",
        duration: visitedNodesInOrder.length * 10,
      })

      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        await delay(10); // Adjust the delay time as needed
        const updatedGrid = grid.slice();
        const node = visitedNodesInOrder[i];
        updatedGrid[node.row][node.col].isVisiting = true;
        updatedGrid[node.row][node.col].isVisited = true;
        setGrid(updatedGrid);
      }
      animateShortestPath(nodesInShortestPathOrder);
    };
    
      
    const animateShortestPath = (shortestPath) => {
        if (!shortestPath) {
          setIsRunningDijkstra(false);
          toast.error("Not found :(", { description: "There's no way to target"});
          return;
        };
        for (let i = 0; i < shortestPath.length; i++) {
          setTimeout(() => {
            let updatedGrid = grid.slice();
            const node = shortestPath[i];
            updatedGrid[node.row][node.col].isShortestPath = true;
            updatedGrid[node.row][node.col].isVisiting = false;
            setGrid(updatedGrid)
          }, 100 * i);
        }
        toast.success("Got it !", { description: "There's a way to target."});
        setIsRunningDijkstra(false);
    }

    function handleMouseDown(row, col) {
      if (isRunningDijkstra) return;
      if (!isSettingWall) {
          if (!grid[row][col].isWall) {
              if (!startNode) {
                  setStartNode(grid[row][col]);
                  const newGrid = getNewGridWithStartNode(grid, row, col);
                  setGrid(newGrid);
              } else if (!finishNode && (startNode.row !== row || startNode.col !== col)) {
                  setFinishNode(grid[row][col]);
                  const newGrid = getNewGridWithFinishNode(grid, row, col);
                  setGrid(newGrid);
              } else return;
          }
      } else if (isSettingWall){
        if (grid[row][col] !== startNode && grid[row][col] !== finishNode) {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
          }
      }
      setMouseIsPressed(true);
    }
  
    function handleMouseEnter(row, col) {
      if (!mouseIsPressed || isRunningDijkstra) return;
      if (!isSettingWall & !startNode && !finishNode) {
          if (!grid[row][col].isWall) {
              if (!startNode) {
                  setStartNode(grid[row][col]);
                  const newGrid = getNewGridWithStartNode(grid, row, col);
                  setGrid(newGrid);
              } else if (!finishNode && (startNode.row !== row || startNode.col !== col)) {
                  setFinishNode(grid[row][col]);
                  const newGrid = getNewGridWithFinishNode(grid, row, col);
                  setGrid(newGrid);
              }
          }
      } else if (isSettingWall){
        if (!grid[row][col].isStart && !grid[row][col].isFinish) {
          const newGrid = getNewGridWithWallToggled(grid, row, col);
          setGrid(newGrid);
        }
      }
    }
    
    function handleMouseUp() {
        setMouseIsPressed(false);
    }

    const handleReset = () => {
      const initialGrid = getInitialGrid();
      setGrid(initialGrid);
      setStartNode(null);
      setFinishNode(null);
      setIsExecuted(false);
      setIsSettingWall(false);
      setShortLength(0);
    };

    return (
      <div className='flex flex-col gap-y-5 items-center'>
        <div className='flex flex-row gap-x-24 items-center pt-2'>
          <h1 className='text-xl text-zinc-800 font-medium'>Dijkstra Algorithm</h1>
          <h1 className='text-md text-zinc-700'>Length: {shortestLength}</h1>
          <div className='flex flex-row items-center gap-x-4'>
            <Button disabled={isExecuted} onClick={visualizeDijkstra} className="w-fit h-fit bg-orange-500 hover:bg-orange-700 rounded-full gap-x-1">
              <Play className='h-5 w-5'/> Run
            </Button>
            <Button disabled={isExecuted} onClick={() => setIsSettingWall(!isSettingWall)} className={cn("w-fit border-2 flex flex-row gap-x-2 border-teal-800 bg-white text-zinc-800 hover:bg-teal-800 hover:text-white", isSettingWall && "bg-teal-800 text-white")}>
              {!isSettingWall ? 
                <div className='flex flex-row gap-x-1 items-center'>
                  <Weight className='h-5 w-5'/>Wall Setting
                </div>
              :
              <div className='flex flex-row gap-x-1 items-center'>
                <Flag className='h-5 w-5'/> Start / End Setting
              </div>}
            </Button>
            <Button disabled={isRunningDijkstra} onClick={handleReset} className="w-fit bg-indigo-800 ">
              Reset
            </Button>
          </div>
        </div>
        <div className="grid">
            {grid.map((rows, rowIdx) => (
                <div key={rowIdx} className='flex flex-row'>
                {rows.map((node, nodeIdx) => {
                    return (
                    <Node
                        key={nodeIdx}
                        col={node.col}
                        row={node.row}
                        isFinish={node.isFinish}
                        isStart={node.isStart}
                        isWall={node.isWall}
                        isVisited={node.isVisited && !node.isStart && !node.isFinish}
                        isVisiting={node.isVisiting && !node.isStart && !node.isFinish}
                        isShortestPath={node.isShortestPath}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={() => handleMouseDown(node.row, node.col)}
                        onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                        onMouseUp={handleMouseUp}
                    />
                    );
                })}
                </div>
            ))}
            </div>
      </div>
    )
}