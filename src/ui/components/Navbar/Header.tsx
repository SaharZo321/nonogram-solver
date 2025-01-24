import { Close, Crop32, Remove } from "@mui/icons-material"
import { Box, Button, ClickAwayListener, MenuItem, MenuList, Paper, Popper, styled } from "@mui/material"
import { useCallback, useRef, useState } from "react"



type HeaderProps = {
    onQuit?: () => void
    onMinimize?: () => void
    onMaximize?: () => void
    onOpenDevTools?: () => void
    isDev?: boolean
}

export default function Header(props: HeaderProps) {
    return (
        <MainHeader {...props} />
    )
}

const draggable = (isDraggable: boolean) => ({ WebkitAppRegion: isDraggable ? "drag" : "no-drag" })

const BORDER_COLOR = "#373737"

const HeaderButton = styled(Button)`
    outline: none !important;
`

const StyledPaper = styled(Paper)`
    border: 1px solid ${BORDER_COLOR};
`

function MainHeader(props: HeaderProps) {
    const appButtonRef = useRef(null)
    const [menuState, setMenuState] = useState<"none" | "app">("none")


    const handleMenuClose = useCallback(() => setMenuState("none"), [])

    const handleOpenDevTools = useCallback(() => {
        handleMenuClose()
        props.onOpenDevTools?.()
    }, [])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row-reverse",
                width: "100vw",
                height: "36px",
                position: "absolute",
                left: 0,
                top: 0,
                borderBottom: `1px ${BORDER_COLOR} solid`,
                backgroundColor: "#1c1c1c",
                ...draggable(true),
                zIndex: 1,
            }}
        >
            <Box display="flex" sx={draggable(false)}>
                <HeaderButton
                    onClick={props.onMinimize}
                    color="monochrome"
                > <Remove fontSize="small" htmlColor="white" /> </HeaderButton>
                <HeaderButton
                    onClick={props.onMaximize}
                    color="monochrome"
                > <Crop32 fontSize="small" htmlColor="white" /> </HeaderButton>
                <HeaderButton
                    sx={{
                        ":hover": {
                            backgroundColor: "red",
                        },
                    }}
                    onClick={props.onQuit}
                    color="monochrome"
                    > <Close fontSize="small" htmlColor="white" /> </HeaderButton>
            </Box>
            <Box justifySelf="end" mr="auto" sx={draggable(false)} display="flex">
                <img src={`${props.isDev ? "." : ".."}/src/assets/icon.png`} width="auto" height="auto" style={{ padding: "6px" }} />
                <HeaderButton
                    onClick={() => setMenuState("app")}
                    ref={appButtonRef}
                    color="monochrome"
                >
                    App
                </HeaderButton>
                <Popper
                    open={menuState === "app"}
                    anchorEl={appButtonRef.current}
                    placement="bottom-start"
                    disablePortal={true}
                >
                    <StyledPaper>
                        <ClickAwayListener onClickAway={handleMenuClose}>
                            <MenuList>
                                <MenuItem dense onClick={props.onQuit}>
                                    Quit
                                </MenuItem>
                                {props.isDev && <MenuItem dense onClick={handleOpenDevTools}>
                                    Open DevTools
                                </MenuItem>}
                            </MenuList>
                        </ClickAwayListener>
                    </StyledPaper>
                </Popper>
            </Box>
        </Box>
    )
}