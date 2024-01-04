import { Flag, Target, Weight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Node = ({row, col, isStart, isFinish, isVisited, isVisiting, isWall, isShortestPath, onMouseDown, onMouseEnter, onMouseUp }) => {
  const nodeClass = cn(
      "bg-slate-200/70 h-6 w-6 border border-sky-400/50 hover:bg-slate-400/80 flex items-center justify-center",
      isStart && "bg-green-800 hover:bg-green-900/90 border-white",
      isFinish && "bg-red-400 hover:bg-red-600 border-white",
      isShortestPath &&"node-shortest-path border-white" ,
      isVisited && "",
      isVisiting && "node-visited border-white",
      isWall && "bg-zinc-500 hover:bg-zinc-600 border-white",
  );

  return (
      <div className={nodeClass}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      >
          {isWall && <Weight className="text-white h-5 w-5" />}
          {isShortestPath && isStart && <Flag className="h-4 w-4 text-teal-800"/>}
          {isShortestPath && isFinish && <Target className="h-4 w-4 text-red-600"/>}
      </div>
  );
};
