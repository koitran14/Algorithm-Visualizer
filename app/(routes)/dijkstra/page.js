import { DijkstraVisualizer } from "./_components/DijkstraVisualizer";

export default function DijkstraPage (){
    return(
        <div className="h-full w-full flex flex-col gap-y-2 items-center">
            <div className=" flex w-full h-full items-center justify-center">
                <DijkstraVisualizer />
            </div>
        </div>
    )
}