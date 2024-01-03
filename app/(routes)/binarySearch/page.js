"use client"
import { useState } from 'react';
import TreeNode from './_component/TreeNode';
import BinarySearchTree from './_component/Node';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"

const BSTPage = () => {
  const [tree, setTree] = useState(new BinarySearchTree());
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const renderTree = (node) => {
    if (!node) {
      return null;
    }  

    const leftNode = node.left ? renderTree(node.left) : null;
    const rightNode = node.right ? renderTree(node.right) : null;
    
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className='px-5 flex flex-col items-center justify-center'>
          <TreeNode value={node.value} isHighlighted={highlightedNode && node.value === highlightedNode.value}/>
          {(node.left || node.right) && (<div className='h-8 w-2 border-l-2 border-l-slate-400'></div>)}
        </div>
        <div className={cn("grid grid-cols-2 gap-x-3 items-start h-fit w-fit px-2 justify-center",
          (node.left || node.right ) && "border-t-2 border-t-slate-400" 
        )}>
          <div className='flex items-center justify-center flex-col'>
            {node.left && (<div className='h-8 w-2 border-l-2 border-l-slate-400'></div>)}
            {leftNode}
          </div>
          <div className='flex items-center justify-center flex-col'>
            {node.right && (<div className='h-8 w-2 border-l-2 border-l-slate-400'></div>)}
            {rightNode}
          </div>
        </div>
      </div>
    );
  };

  const handleInsert = () => {
    const value = parseInt(inputValue); 
    if (!isNaN(value)) {
      const insertNode = tree.insert(value);
      setTree(tree);
      setInputValue('');
      toast.success("Insert completely.", {
        description: `Node ${value} has been added.`,
        
      })
      setHighlightedNode(insertNode);
      setTimeout(() => {
        setHighlightedNode(null);
      }, 1200);
    } else {
      toast.error('Please enter a valid numeric value.');
    }
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)){
      const searchNode = tree.search(value);
      if (searchNode) {
        toast.success("Got it!")
        setHighlightedNode(searchNode);
        setTimeout(() => {
          setHighlightedNode(null);
        }, 1200);
      } else {
        toast.error('Node not found.', {
          description: 'Try again.'
        });
      }
    } else {
      toast.error('Please enter a valid numeric value.');
    }
  };
  
  const handleMaxValue = () => {
      const maxValue = tree.max();
      if (maxValue) {
        toast.success("Found it!",{
          description: `The max value is ${maxValue.value}`
        })
        setHighlightedNode(maxValue);
        setTimeout(() => {
          setHighlightedNode(null);
        }, 1200);
      } else {
        toast.error('Node not found.');
      }
  };

  const handleMinValue = () => {
    const minValue = tree.min();
    if (minValue) {
      toast.success("Found it!",{
        description: `The min value is ${minValue.value}`
      })      
      setHighlightedNode(minValue);
      setTimeout(() => {
        setHighlightedNode(null);
      }, 1200);
    } else {
      toast('Node not found.');
    }
  };

  const handleReset = () => {
    setTree(new BinarySearchTree());
  }

  const handleRemove = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const removedNode = tree.remove(value);
      if (removedNode) {
        toast.success("Removed completely.",{
          description: "Node has been deleted."
        })
        setHighlightedNode(removedNode);
        setTimeout(() => {
          const updatedTree = new BinarySearchTree(tree.compareFn);
          updatedTree.root = tree.root; 
          setTree(updatedTree); 
          setInputValue('');
          setHighlightedNode(null);
        }, 1200);
        
      } else {
        toast.error("Something went wrong.",{ description: 'Node not found or tree is empty.'});
      }
    } else {
      toast.error("Invalid input",{
        description: 'Please enter a valid numeric value.'
      });
    }
  };

  const handleInOrderTraversal = () => {
    const traversedNodes = tree.inOrderTraverse();
    const values = traversedNodes.map(node => node.value);
    const traversedString = values.join(', ');
    if (traversedString.length > 0) {
      toast.success("In-order traversing completely.",{
        description: `Result: ${traversedString}`
      })
    } else {
      toast.error("Something went wrong", {
        description: "Maybe the tree not exists."
      })
    }
  };

  const handlePostOrderTraversal = () => {
    const traversedNodes = tree.postOrderTraverse();
    const values = traversedNodes.map(node => node.value);
    const traversedString = values.join(', ');
    if (traversedString.length > 0) {
      toast.success("Post-order traversing completely.",{
        description: `Result: ${traversedString}`
      })
    } else {
      toast.error("Something went wrong", {
        description: "Maybe the tree not exists."
      })
    }
  };

  const handlePreOrderTraversal = () => {
    const traversedNodes = tree.preOrderTraverse();
    const values = traversedNodes.map(node => node.value);
    const traversedString = values.join(', ');
    if (traversedString.length > 0) {
      toast.success("Pre-order traversing completely.",{
        description: `Result: ${traversedString}`
      })
    } else {
      toast.error("Something went wrong", {
        description: "Maybe the tree not exists."
      })
    }
  };

  return (
    <div className='flex flex-col gap-y-2 pt-5'>
      <div className='flex md:flex-row flex-col md:gap-x-3 gap-y-3 justify-center items-center'>
        <div className="flex flex-row gap-x-1 items-center justify-center">
            <Button className='px-4 py-2 bg-yellow-500' onClick={handleInsert} disabled={highlightedNode}> 
              Insert Node
            </Button>
            <Button className="px-4 py-2 bg-zinc-500 text-white"
              onClick={handleRemove}
              disabled={highlightedNode}
            >
              Remove Node
            </Button>
        </div>
        <div className="flex flex-row gap-x-1 items-center justify-center">
            <Button className='px-4 py-2 bg-indigo-800 text-white'
              onClick={handleSearch}
              disabled={highlightedNode}
            >Search</Button>
            <Button disabled={highlightedNode} onClick={handleMinValue} className='px-4 py-2 bg-teal-400'>
              Min Value
            </Button>
            <Button onClick={handleMaxValue} disabled={highlightedNode} className='px-4 py-2 bg-rose-500 text-white'>Max Value</Button>
        </div>
        <div className='flex flex-row items-center justify-center gap-x-1'>
            <Button disabled={highlightedNode} onClick={handleInOrderTraversal} className='px-4 py-2 bg-amber-600 text-white'>
              In Order Traversal
            </Button>
            <Button onClick={handlePostOrderTraversal} disabled={highlightedNode} className='px-4 py-2 bg-lime-400'>
              Post Order Traversal
            </Button>
            <Button onClick={handlePreOrderTraversal} disabled={highlightedNode}  className='px-4 py-2 bg-cyan-500'>
              Pre Order Traversal
            </Button>
        </div>
        
      </div>
      <div  className='flex items-center justify-center '>
        <Button disabled={highlightedNode} className='px-4 py-2 bg-violet-400 text-white font-medium'
          onClick={handleReset}
        >
          Delete Tree
        </Button>
      </div>
      <div className='w-full items-center flex justify-center'>
        <input
          type="text"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-[50%]"
        />
      </div>
      <div className="flex justify-center mt-5">
        {renderTree(tree.root)}
      </div>
    </div>
  );
};

export default BSTPage;
