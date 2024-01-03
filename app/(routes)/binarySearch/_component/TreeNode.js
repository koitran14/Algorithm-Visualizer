import React from 'react';
import { cn } from '@/lib/utils';

const TreeNode = ({ value, isHighlighted }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("w-20 h-10 bg-gray-400 rounded-md px-4 py-2 flex items-center justify-center text-white",
        isHighlighted && "bg-teal-400"
      )}>
        {value}
      </div>
    </div>
  );
};

export default TreeNode;
