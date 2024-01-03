import { Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import './NodeEffect.css'

export const Node = ({row, col, isStart, isFinish, isVisited, isWall, isShortestPath, onMouseDown, onMouseEnter, onMouseUp }) => {
  const nodeClass = cn(
      "bg-slate-200/70 h-6 w-6 border border-sky-400/50 hover:bg-slate-400/80 flex items-center justify-center",
      isStart && "bg-green-800 hover:bg-green-900/90 border-white",
      isFinish && "bg-red-400 hover:bg-red-600 border-white",
      isVisited && "node-visited border-white",
      isWall && "bg-zinc-500 hover:bg-zinc-600",
      isShortestPath && "node-shortest-path" 
  );

  return (
      <div className={nodeClass}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      >
          {isWall && <Weight className="text-white h-5 w-5" />}
      </div>
  );
};
