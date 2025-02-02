import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

type ConstraintDialogProps = {
    open: boolean
    type?: "row" | "column"
    index?: number,
    onSave: (constraint: LineConstraint) => void
    onClose: () => void
    initialConstraint: LineConstraint
    maxSize: number
}

const stringToConstraint = (str: string) => {
    return str.split(" ").map(Number).filter(num => num !== 0)

}
const constraintToString = (constraint: LineConstraint) => constraint.join(" ")

const CONSTRAINT_REGEX = /^(?:[1-9]\d*(?: [1-9]\d*)* ?)?$/

const isError = (str: string, maxSize: number) => {
    if (!str.match(CONSTRAINT_REGEX)) {
        return true
    }
    const constraint = stringToConstraint(str)
    return constraint.reduce((acu, num) => acu + num + 1, 0) - 1 > maxSize
}

const ConstraintDialog: React.FC<ConstraintDialogProps> = ({
    open,
    type,
    index,
    onClose,
    onSave,
    initialConstraint,
    maxSize
}) => {

    const [constraintStr, setConstraintStr] = useState<string>(constraintToString(initialConstraint))

    const [typeIndex, setTypeIndex] = useState<{ index: number, type: "row" | "column" }>()

    const handleTypeIndexChange = useDebouncedCallback(setTypeIndex, 200)

    useEffect(() => {
        if (type === undefined || index === undefined) {
            handleTypeIndexChange(undefined)
        } else {
            setTypeIndex({ type, index })
        }
    }, [type, index])

    useEffect(() => {
        setConstraintStr(constraintToString(initialConstraint))
    }, [initialConstraint])

    const handleSave = useCallback(() => {
        onSave(stringToConstraint(constraintStr))
        onClose()
    }, [onSave, constraintStr])

    const handleConstraintChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        if (!isError(event.target.value, maxSize)) {
            setConstraintStr(event.target.value)
        }
    }, [maxSize])

    const handleKeyDown: React.KeyboardEventHandler = event => {
        if (event.key === "Enter") {
            handleSave()
        }
    };


    return (
        <Dialog
            open={open}
            onKeyDown={handleKeyDown}
        >
            <DialogTitle>
                Setting {typeIndex?.type} {(typeIndex?.index ? typeIndex.index : 0) + 1}
            </DialogTitle>
            <DialogContent>
                <TextField
                    value={constraintStr}
                    onChange={handleConstraintChange}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ConstraintDialog