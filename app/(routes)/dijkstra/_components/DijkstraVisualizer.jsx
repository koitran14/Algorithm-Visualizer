"use client"

import { Node } from './node';
import {dijkstra, getNodesInShortestPathOrder} from './dijkstra';
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
    const [startNode, setStartNode] = useState({row: null, col: null});
    const [finishNode, setFinishNode] = useState({row: null, col: null});
    const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    const visualizeDijkstra = () => {
        if (startNode.row && startNode.col && finishNode.col && finishNode.row ) {
            setIsRunningDijkstra(true);
            let clone = grid.slice();
            let visitedNode = dijkstra(clone, clone[startNode.row][startNode.col], clone[finishNode.row][finishNode.col])
            let shortestPath = getNodesInShortestPathOrder(clone[finishNode.row][finishNode.col])
            animateDijkstra(visitedNode, shortestPath);
        } else {
            toast.error("Start or Finish node missing.",{
                description: "Please set start and end node before running."
            })
        }
    }

    const animateDijkstra = (visitedNode, shortestPath) => {
        for (let i = 0; i < visitedNode.length; i++) {
            setTimeout(() => {
                let updatedGrid = grid.slice();
                let node = visitedNode[i];
                updatedGrid[node.row][node.col].isVisited = true;
                setGrid(updatedGrid);
            }, 100*i);
        };
        
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, visitedNode.length);  
      }
      
    const animateShortestPath = (shortestPath) => {
        if (!shortestPath) return;
        for (let i = 0; i < shortestPath.length; i++) {
          setTimeout(() => {
            let updatedGrid = grid.slice();
            const node = shortestPath[i];
            updatedGrid[node.row][node.col].isShortestPath = true;
            setGrid(updatedGrid)
          }, 150 * i);
        }
    }

    function handleMouseDown(row, col) {
        if (isRunningDijkstra) return;
        if (!isSettingWall) {
            if (!grid[row][col].isWall) {
                if (!startNode.row) {
                    setStartNode({ row, col });
                    const newGrid = getNewGridWithStartNode(grid, row, col);
                    setGrid(newGrid);
                } else if (!finishNode.row) {
                    setFinishNode({ row, col });
                    const newGrid = getNewGridWithFinishNode(grid, row, col);
                    setGrid(newGrid);
                }
            }
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
        setMouseIsPressed(true);
    }
    
    function handleMouseEnter(row, col) {
        if (!mouseIsPressed || isRunningDijkstra) return;
        if (!isSettingWall) {
            if (!grid[row][col].isWall) {
                if (!startNode.row) {
                    setStartNode({ row, col });
                    const newGrid = getNewGridWithStartNode(grid, row, col);
                    setGrid(newGrid);
                } else if (!finishNode.row && startNode.row !== row && startNode.col !== col) {
                    setFinishNode({ row, col });
                    const newGrid = getNewGridWithFinishNode(grid, row, col);
                    setGrid(newGrid);
                }
            }
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    }
    
    function handleMouseUp() {
        setMouseIsPressed(false);
    }

    const handleReset = () => {
      const initialGrid = getInitialGrid();
      setGrid(initialGrid);
      setStartNode({ row: null, col: null });
      setFinishNode({ row: null, col: null });
    };

    return (
      <div className='flex flex-col gap-y-3 items-center'>
        <div className='flex flex-row gap-x-24 items-center'>
          <h1 className='text-xl font-medium text-zinc-500'>Dijkstra Algorithm</h1>
          <div className='flex flex-row items-center gap-x-4'>
            <Button onClick={visualizeDijkstra} className="w-fit h-fit bg-orange-500 hover:bg-orange-700 rounded-full gap-x-1">
              <Play className='h-5 w-5'/> Run
            </Button>
            <Button onClick={() => setIsSettingWall(!isSettingWall)} className={cn("w-fit border-2 flex flex-row gap-x-2 border-teal-800 bg-white text-zinc-800 hover:bg-teal-800 hover:text-white", isSettingWall && "bg-teal-800 text-white")}>
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
            {grid.map((row, rowIdx) => (
                <div key={rowIdx} className='flex flex-row'>
                {row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall, isVisited, isShortestPath, previousNode } = node;
                    return (
                    <Node
                        key={nodeIdx}
                        col={col}
                        row={row}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        isVisited={isVisited && !isStart && !isFinish}
                        isShortestPath={isShortestPath}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={() => handleMouseDown(row, col)}
                        onMouseEnter={() => handleMouseEnter(row, col)}
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