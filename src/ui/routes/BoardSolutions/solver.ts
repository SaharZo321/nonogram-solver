export type SolverProps = {
    boardConstraints: BoardConstraints,
    onMessage: (message: number | BoardSolution) => void
}

export function solve(props: SolverProps) {
    const solverWorker = new Worker(new URL("./solverWorker.ts", import.meta.url), { type: "module" })

    solverWorker.onmessage = (event) => {
        props.onMessage(event.data)
    }

    solverWorker.postMessage(props.boardConstraints)
    return () => solverWorker.terminate()
}