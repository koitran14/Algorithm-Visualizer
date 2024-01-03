import { DijkstraVisualizer } from "./_components/DijkstraVisualizer";

export default function DijkstraPage (){
    return(
        <div className="h-full w-full flex flex-col gap-y-2 items-center">
            <h1 className="text-3xl font-medium text-rose-500">Dijkstra Algorithm</h1>
            <div className=" flex w-full h-full items-center justify-center">
                <DijkstraVisualizer />
            </div>
        </div>
    )
}