import throttle from "lodash.throttle"

export type SolverProps = {
    boardConstraints: BoardConstraints,
    onMessage: (message: number | BoardSolution) => void
    onError?: () => void
    frequencyMS?: number
}

export const solve = (props: SolverProps) => {
    const solverWorker = new Worker(new URL("./solverWorker.ts", import.meta.url), { type: "module" })
    
    solverWorker.onmessage = throttle((event) => {
        props.onMessage(event.data)
        console.log("invoked")
    }, props.frequencyMS)

    solverWorker.onerror = props.onError ? props.onError : null

    solverWorker.postMessage(props.boardConstraints)
    return () => solverWorker.terminate()
}

