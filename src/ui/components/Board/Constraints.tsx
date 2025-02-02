import { Box, SxProps, Typography, styled } from "@mui/material"
import { memo } from "react"

type RowConstraintsProps = {
    constraints: BoardConstraints['rows'],
    sx?: SxProps,
    fontSize: string,
    onConstraintClick?: (index: number) => void
}

const RowConstraintContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    border: "solid 2px lightgray",
    boxSizing: "border-box",
    flexBasis: '100%',
    alignItems: 'center',
    borderRadius: "8px",
    paddingRight: "3px"
})


const RowConstraintsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
})

type ConstraintProps = {
    constraint: number[],
    fontSize: string
    onClick?: () => void
}

const RowConstraint = memo((props: ConstraintProps) => {
    return (
        <RowConstraintContainer 
            onClick={props.onClick}
            sx={{
                "&:hover": {
                    cursor: props.onClick ? "pointer" : undefined,
                },
            }}
        >
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
                    <RowConstraint
                        key={index}
                        constraint={constraint}
                        fontSize={props.fontSize}
                        onClick={props.onConstraintClick ? () => props.onConstraintClick?.(index) : undefined}
                    />
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
    border: "solid 2px lightgray",
    borderRadius: "8px"
})

type ColumnConstraintsProps = {
    constraints: BoardConstraints['columns'],
    sx?: SxProps,
    fontSize: string,
    onConstraintClick?: (index: number) => void
}

const ColumnConstraint = memo((props: ConstraintProps) => {
    return (
        <ColumnConstraintContainer
            onClick={props.onClick}
            sx={{
                "&:hover": {
                    cursor: props.onClick ? "pointer" : undefined,
                },
            }}
        >
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
                    <ColumnConstraint
                        key={index}
                        constraint={constraint}
                        fontSize={props.fontSize}
                        onClick={props.onConstraintClick ? () => props.onConstraintClick?.(index): undefined}
                    />
                ))
            }
        </ColumnConstraintsContainer>
    )
})
