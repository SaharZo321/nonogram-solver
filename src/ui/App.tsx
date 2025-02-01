import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { CssBaseline, PaletteMode, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import TitleBar from "@components/Navbar/TitleBar";
import CustomThemeProvider from "./providers/CustomThemeProvider";
import SettingsModal from "@components/Settings/Settings";



export type Settings = {
    hoverColor: string,
    tileColor: string,
    colorMode: PaletteMode | "system",
}

const defaultSettings: Settings = {
    hoverColor: '#3a3a3a',
    tileColor: '#000000',
    colorMode: "system",
}

export const SettingsContext = createContext(defaultSettings)
const TITLEBAR_COLOR = {
    dark: "#1c1c1c",
    light: "#f0f0f0",
}

function App() {
    const [settings, setSettings] = useState<Settings>(defaultSettings)
    const [themeMode, setThemeMode] = useState<PaletteMode>("dark")
    const [isDev, setIsDev] = useState<boolean>(false)
    const [isMacOs, setIsMacOs] = useState<boolean>(false)
    const [settingsModal, setSettingsModal] = useState<boolean>(false)

    const setSetting = useCallback(<Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])


    useEffect(() => {
        if (isMacOs) {
            return window.electron.subscribeThemeChange(setThemeMode)
        }
        switch (settings.colorMode) {
            case "system": {
                (async () => {
                    setThemeMode(await window.electron.getSystemTheme())
                })()
                return window.electron.subscribeThemeChange(setThemeMode)
            }
            default: {
                setThemeMode(settings.colorMode)
            }
        }
    }, [settings.colorMode, isMacOs])

    useEffect(() => {
        (async () => {
            setIsDev(await window.electron.isDev())
            setIsMacOs(await window.electron.isMacOs())
        })()
    }, [])

    useEffect(() => {
        window.electron.setTitleBarOverlay({
            color: TITLEBAR_COLOR[themeMode],
            symbolColor: TITLEBAR_COLOR[themeMode === "dark" ? "light" : "dark"]
        })
    }, [themeMode])

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            "::-webkit-scrollbar": {
                                width: "10px",
                                height: "10px",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#8080801c",
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: "#87878764",
                                borderRadius: "5px",
                            },
                            "::-webkit-scrollbar-thumb:hover": {
                                background: "#7c7c7cb5",
                            },
                        },
                    },
                }
            }),
        [themeMode],
    );

    return (
        <SettingsContext.Provider value={settings}>
            <CustomThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <TitleBar
                    isDev={isDev}
                    onQuit={() => window.electron.sendFrameAction("QUIT")}
                    onOpenDevTools={() => window.electron.sendFrameAction("OPEN_DEVTOOLS")}
                    backgroundColor={TITLEBAR_COLOR[themeMode]}
                    openSettings={() => setSettingsModal(true)}
                    isMacOs={isMacOs}
                />
                <Outlet />
                <SettingsModal open={settingsModal} onClose={() => setSettingsModal(false)} setSetting={setSetting} />
            </CustomThemeProvider>
        </SettingsContext.Provider>
    )
}

export default App
