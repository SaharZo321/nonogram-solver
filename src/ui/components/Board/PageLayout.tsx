import styled from "@emotion/styled"
import { BoardContainerProps, BoardContainer } from "./BoardContainer"
import { Box } from "@mui/material"
import { PropsWithChildren } from "react"

export const BoardContainerWrapper = styled(Box)`
    min-height: 100vh;
    padding-top: 64px;
    width: 100vw;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`

export const BoardContainerPage = (props: PropsWithChildren<BoardContainerProps>) => {
    return (
        <BoardContainerWrapper>
            <BoardContainer {...props} />
            {props.children}
        </BoardContainerWrapper>
    )
}