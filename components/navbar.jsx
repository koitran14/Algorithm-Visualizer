"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu.jsx"
import { Github } from "lucide-react";
import Link from "next/link";
  
  const algorithms = {
    "Simple Sorts": [
      {
        title: "Bubble Sort",
        href: "/bubbleSort"
      },
      {
        title: "Insertion Sort",
        href: "/insertionSort"
      },
      {
        title: "Selection Sort",
        href: "/selectionSort"
      }
    ],
    "Binary Tree": [
      {
        title: "Visit now!",
        href: "/binarySearch"
      }
    ],
    "Dijkstra": [
      {
        title: "Visit now!",
        href: "/dijkstra"
      }
    ]
  };
  
export function NavBar () {
  const generalTitles = Object.keys(algorithms);

  return (
    <main className="w-full h-20 flex flex-row items-center justify-center bg-black md:gap-x-16 gap-x-5">
      <Link href={'/'}>
        <h1 className="text-xl text-white">AlgoVisualizer.io</h1>
      </Link>
      <div className="flex flex-row items-center gap-x-2 bg-zinc-200 rounded-xl">
          {generalTitles.map((generalTitle) => (
            <NavigationMenu key={generalTitle}>
              <NavigationMenuList >
              <NavigationMenuItem >
                <NavigationMenuTrigger className="w-36 bg-transparent text-black hover:bg-zinc-200 transition-all duration-300 rounded-xl">{generalTitle}</NavigationMenuTrigger>
                <NavigationMenuContent className="flex flex-col gap-y-2 p-4">
                  {algorithms[generalTitle].map((algorithm, index) => (
                    <NavigationMenuLink key={index} href={algorithm.href} className="w-32 p-2 hover:bg-slate-300 rounded-md text-sm">
                      {algorithm.title}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ))}
      </div>
      <Link href='https://github.com/koitran14/Algorithm-Visualizer' className="text-white w-fit h-fit p-2 rounded-full border hover:bg-white hover:text-black transition-all duration-200 ease-in-out">
        <Github/>
      </Link>
    </main>
  );
}
 