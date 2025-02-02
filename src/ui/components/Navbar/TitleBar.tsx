import { Box, ClickAwayListener, MenuItem, MenuList, Paper, Popper, styled } from "@mui/material"
import { useCallback, useRef, useState } from "react"




type TitleBarProps = {
    onQuit?: () => void
    onOpenDevTools?: () => void
    isDev?: boolean,
    isMacOs?: boolean,
    backgroundColor: string
    openSettings: () => void
}

export default function TitleBar(props: TitleBarProps) {
    return (
        <MainTitleBar {...props} />
    )
}

const MenuButton = styled(MenuItem)`
    font-size: small;
`

const draggable = (isDraggable: boolean) => ({ WebkitAppRegion: isDraggable ? "drag" : "no-drag" })

const BORDER_COLOR = "#373737"

const StyledPaper = styled(Paper)`
    border: 1px solid ${BORDER_COLOR};
`

function MainTitleBar(props: TitleBarProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: props.isMacOs ? "row-reverse" : "row",
                width: "100vw",
                height: "36px",
                position: "absolute",
                left: 0,
                top: 0,
                borderBottom: `1px ${BORDER_COLOR} solid`,
                backgroundColor: props.backgroundColor,
                ...draggable(true),
                boxSizing: "content-box",
                zIndex: 2000,
            }}
        >

            <Box justifySelf="end" sx={draggable(false)} display="flex" flexDirection={props.isMacOs ? "row-reverse" : "row"}>
                <img src={`${props.isDev ? "." : ".."}/src/assets/icon.png`} width="auto" height="auto" style={{ padding: "6px" }} />
                {
                    props.isMacOs ? (
                        <MenuItem onClick={props.openSettings}>
                            Settings
                        </MenuItem>
                    ) : (
                        <TitleBarMenu
                            label="App"
                            buttons={[
                                { label: "Quit", onClick: props.onQuit },
                                { label: "Settings", onClick: props.openSettings },
                                { label: "Open DevTools", onClick: props.onOpenDevTools, hidden: !props.isDev }
                            ]}
                        />
                    )
                }
            </Box>
        </Box>
    )
}

type TitleBarMenuProps = {
    label: string,
    buttons: {
        label: string,
        hidden?: boolean,
        onClick?: () => void,
        selected?: boolean
    }[]
}

function TitleBarMenu(props: TitleBarMenuProps) {
    const appButtonRef = useRef(null)
    const [menuState, setMenuState] = useState<boolean>(false)

    const handleMenuOpen = useCallback(() => {
        setMenuState(true)
    }, [])

    const handleMenuClose = useCallback(() => {
        setMenuState(false)
    }, [])

    return (
        <>
            <MenuButton
                onClick={handleMenuOpen}
                ref={appButtonRef}
            >
                {props.label}
            </MenuButton>
            <Popper
                placement="bottom-start"
                disablePortal={true}
                open={menuState}
                anchorEl={appButtonRef.current}
            >
                <StyledPaper>
                    <ClickAwayListener onClickAway={handleMenuClose}>
                        <MenuList>
                            {
                                props.buttons.map(({ label, onClick, hidden, selected }, index) => !hidden ? (
                                    <MenuItem
                                        key={index}
                                        dense
                                        onClick={() => {
                                            onClick?.()
                                            handleMenuClose()
                                        }}
                                        selected={selected}
                                    >
                                        {label}
                                    </MenuItem>
                                ) : undefined)
                            }
                        </MenuList>
                    </ClickAwayListener>

                </StyledPaper>
            </Popper>
        </>
    )
}