import { Box, SxProps, Typography, styled } from "@mui/material"
import { BoardConstraints } from "@board/Board"
import { memo } from "react"

type RowConstraintsProps = {
    constraints: BoardConstraints['rows'],
    sx?: SxProps,
    fontSize: string,
}

const RowConstraintContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    flexBasis: '100%',
    gap: '1vmin'
})


const RowConstraintsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
})

type ConstraintProps = {
    constraint: number[],
    fontSize: string
}

const RowConstraint = memo((props: ConstraintProps) => {
    return (
        <RowConstraintContainer>
            {
                props.constraint.map((number, index) => (
                    <Typography key={index}
                        sx={{
                            fontSize: props.fontSize,
                            alignSelf: 'center'
                        }}
                    >
                        {number}
                    </Typography>
                ))
            }
        </RowConstraintContainer >
    )
}, ({constraint, fontSize}, {constraint: nextConstraint, fontSize: nextFontSize}) => JSON.stringify(constraint)==JSON.stringify(nextConstraint) && fontSize === nextFontSize)

export const RowsConstraints= memo((props: RowConstraintsProps) => {
    const styledConstraints = props.constraints.map((constraint, index) => (
        <RowConstraint key={index} constraint={constraint} fontSize={props.fontSize} />
    ))

    return (
        <RowConstraintsContainer sx={props.sx}>
            {styledConstraints}
        </RowConstraintsContainer>
    )
})

const ColumnConstraintsContainer = styled(Box)({
    display: 'flex'
})

const ColumnConstraintContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    flexBasis: '100%',
    alignItems: 'center',
    flexDirection: 'column',
})

type ColumnConstraintsProps = {
    constraints: BoardConstraints['columns'],
    sx?: SxProps,
    fontSize: string,
}

const ColumnConstraint = memo((props: ConstraintProps) => {
    return (
        <ColumnConstraintContainer>
            {
                props.constraint.map((number, index) => (
                    <Typography key={index}
                        sx={{
                            fontSize: props.fontSize,
                        }}
                        textAlign='center'
                    >
                        {number}
                    </Typography>
                ))
            }
        </ColumnConstraintContainer >
    )
}, ({constraint, fontSize}, {constraint: nextConstraint, fontSize: nextFontSize}) => JSON.stringify(constraint) === JSON.stringify(nextConstraint) && fontSize === nextFontSize)

export const ColumnConstraints = memo((props: ColumnConstraintsProps) => {
    const styledConstraints = props.constraints.map((constraint, index) => (
        <ColumnConstraint key={index} constraint={constraint} fontSize={props.fontSize} />
    ))
    return (
        <ColumnConstraintsContainer sx={props.sx}>
            {styledConstraints}
        </ColumnConstraintsContainer>
    )
})
