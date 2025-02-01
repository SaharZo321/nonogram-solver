import { Box, SxProps, Typography, styled } from "@mui/material"
import { memo, useEffect } from "react"

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
            <Typography fontSize={props.fontSize} alignSelf="center">
                {props.constraint.join(" ")}
            </Typography>
        </RowConstraintContainer >
    )
})

export const RowsConstraints = memo((props: RowConstraintsProps) => {
    return (
        <RowConstraintsContainer sx={props.sx}>
            {
                props.constraints.map((constraint, index) => (
                    <RowConstraint key={index} constraint={constraint} fontSize={props.fontSize} />
                ))
            }
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
})

export const ColumnConstraints = memo((props: ColumnConstraintsProps) => {
    return (
        <ColumnConstraintsContainer sx={props.sx}>
            {
                props.constraints.map((constraint, index) => (
                    <ColumnConstraint key={index} constraint={constraint} fontSize={props.fontSize} />
                ))
            }
        </ColumnConstraintsContainer>
    )
})
