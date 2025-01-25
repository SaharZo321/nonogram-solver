import { Box, ClickAwayListener, MenuItem, MenuList, Paper, Popper, PopperProps, styled } from "@mui/material"
import { Settings, SettingsContext } from "@renderer/App"
import { useCallback, useContext, useRef, useState } from "react"




type TitleBarProps = {
    onQuit?: () => void
    onOpenDevTools?: () => void
    isDev?: boolean,
    backgroundColor: string
    setSetting?: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void
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
    const settings = useContext(SettingsContext)
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
                backgroundColor: props.backgroundColor,
                ...draggable(true),
                zIndex: 1,
                boxSizing: "content-box"
            }}
        >
            <Box justifySelf="end" mr="auto" sx={draggable(false)} display="flex">
                <img src={`${props.isDev ? "." : ".."}/src/assets/icon.png`} width="auto" height="auto" style={{ padding: "6px" }} />
                <AppMenu
                    onAppQuit={props.onQuit}
                    onOpenDevTools={props.onOpenDevTools}
                    isDev={props.isDev}
                />
                <ThemeMenu
                    theme={settings.colorMode}
                    setTheme={theme => props.setSetting?.("colorMode", theme)}
                />
            </Box>
        </Box>
    )
}

type AppMenuProps = {
    onClose?: () => void
    isDev?: boolean
    onAppQuit?: () => void,
    onOpenDevTools?: () => void
}

function TitleBarPopper(props: PopperProps) {
    return (
        <Popper
            placement="bottom-start"
            disablePortal={true}
            {...props}
        >
            {props.children}
        </Popper>
    )
}

function AppMenu(props: AppMenuProps) {
    const appButtonRef = useRef(null)
    const [menuState, setMenuState] = useState<boolean>(false)

    const handleCloseMenu = useCallback(() => {
        props.onClose?.()
        setMenuState(false)
    }, [props.onClose])

    const handleOpenDevTools = useCallback(() => {
        props.onOpenDevTools?.()
        setMenuState(false)
    }, [])

    return (
        <>
            <MenuButton
                onClick={() => setMenuState(true)}
                ref={appButtonRef}
            >
                App
            </MenuButton>
            <TitleBarPopper
                open={menuState}
                anchorEl={appButtonRef.current}
            >
                <StyledPaper>
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                        <MenuList>
                            <MenuItem dense onClick={props.onAppQuit}>
                                Quit
                            </MenuItem>
                            {props.isDev && <MenuItem dense onClick={handleOpenDevTools}>
                                Open DevTools
                            </MenuItem>}
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper>
            </TitleBarPopper>
        </>
    )
}

type ThemeMenuProps = {
    onClose?: () => void,
    setTheme: (setting: "dark" | "light" | "system") => void
    theme: "dark" | "light" | "system"
}

function ThemeMenu(props: ThemeMenuProps) {
    const themeButtonRef = useRef(null)
    const [menuState, setMenuState] = useState<boolean>(false)

    const handleCloseMenu = useCallback(() => {
        props.onClose?.()
        setMenuState(false)
    }, [props.onClose])

    const handleSetTheme = useCallback((theme: "dark" | "light" | "system") => {
        handleCloseMenu()
        props.setTheme(theme)
    }, [])

    return (
        <>
            <MenuButton
                onClick={() => setMenuState(true)}
                ref={themeButtonRef}
            >
                Theme
            </MenuButton>
            <TitleBarPopper
                open={menuState}
                anchorEl={themeButtonRef.current}
            >
                <StyledPaper>
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                        <MenuList>
                            <MenuItem
                                dense
                                onClick={() => handleSetTheme("system")}
                                selected={props.theme === "system"}
                            >
                                System
                            </MenuItem>
                            <MenuItem
                                dense
                                onClick={() => handleSetTheme("dark")}
                                selected={props.theme === "dark"}
                            >
                                Dark
                            </MenuItem>
                            <MenuItem
                                dense
                                onClick={() => handleSetTheme("light")}
                                selected={props.theme === "light"}
                            >
                                Light
                            </MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper>
            </TitleBarPopper>
        </>
    )
}

// type 