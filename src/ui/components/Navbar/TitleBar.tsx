import { Box, ClickAwayListener, MenuItem, MenuList, Paper, Popper, styled } from "@mui/material"
import { Settings, SettingsContext } from "@renderer/App"
import { PropsWithChildren, useCallback, useContext, useRef, useState } from "react"




type TitleBarProps = {
    onQuit?: () => void
    onOpenDevTools?: () => void
    isDev?: boolean,
    isMacOs?: boolean,
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
                boxSizing: "content-box"
            }}
        >
            {
                !props.isMacOs && (
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
                )
            }
        </Box>
    )
}

type AppMenuProps = {
    isDev?: boolean
    onAppQuit?: () => void,
    onOpenDevTools?: () => void
}

function TitleBarMenu(props: PropsWithChildren<{ onOpen: () => void, onClose: () => void, label: string, open: boolean }>) {
    const appButtonRef = useRef(null)

    return (
        <>
            <MenuButton
                onClick={props.onOpen}
                ref={appButtonRef}
            >
                {props.label}
            </MenuButton>
            <Popper
                placement="bottom-start"
                disablePortal={true}
                open={props.open}
                anchorEl={appButtonRef.current}
            >
                <StyledPaper>
                    <ClickAwayListener onClickAway={props.onClose}>
                        <MenuList>
                            {props.children}
                        </MenuList>
                    </ClickAwayListener>

                </StyledPaper>
            </Popper>
        </>
    )
}

function AppMenu(props: AppMenuProps) {
    const [menuState, setMenuState] = useState<boolean>(false)

    const handleOpenDevTools = useCallback(() => {
        props.onOpenDevTools?.()
        setMenuState(false)
    }, [])

    return (
        <TitleBarMenu
            label="App"
            open={menuState}
            onClose={() => setMenuState(false)}
            onOpen={() => setMenuState(true)}
        >
            <MenuItem dense onClick={props.onAppQuit}>
                Quit
            </MenuItem>
            {props.isDev && <MenuItem dense onClick={handleOpenDevTools}>
                Open DevTools
            </MenuItem>}
        </TitleBarMenu>
    )
}

type Mode = "dark" | "light" | "system"

type ThemeMenuItemProps = {
    mode: Mode
    handleSetTheme: (mode: Mode) => void
    chosenMode: Mode
}
function ThemeMenuItem(props: ThemeMenuItemProps) {
    return (
        <MenuItem
            dense
            onClick={() => props.handleSetTheme(props.mode)}
            selected={props.chosenMode === props.mode}
        >
            {props.mode.charAt(0).toUpperCase() + props.mode.substring(1)}
        </MenuItem>
    )
}

type ThemeMenuProps = {
    setTheme: (setting: "dark" | "light" | "system") => void
    theme: "dark" | "light" | "system"
}

const modes: Mode[] = ["system", "light", "dark"]

function ThemeMenu(props: ThemeMenuProps) {
    const [menuState, setMenuState] = useState<boolean>(false)

    const handleSetTheme = useCallback((theme: "dark" | "light" | "system") => {
        setMenuState(false)
        props.setTheme(theme)
    }, [])

    return (

        <TitleBarMenu
            open={menuState}
            label="Theme"
            onClose={() => setMenuState(false)}
            onOpen={() => setMenuState(true)}
        >
            {
                modes.map((mode, index) => (
                    <ThemeMenuItem
                        key={index}
                        mode={mode}
                        chosenMode={props.theme}
                        handleSetTheme={handleSetTheme}
                    />
                ))
            }
        </TitleBarMenu>
    )

}

// type 