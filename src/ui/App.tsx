import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@components/Navbar/Navbar"
import { CssBaseline, PaletteMode, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import TitleBar from "@components/Navbar/TitleBar";
import CustomThemeProvider from "./providers/CustomThemeProvider";



export type Settings = {
    hoverColor: string,
    colorMode: PaletteMode | "system",
}

const defaultSettings: Settings = {
    hoverColor: 'rgba(150,150,150,0.3)',
    colorMode: "dark",
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
    
    const setSetting = useCallback(<Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    useEffect(() => {
        switch(settings.colorMode) {
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
    }, [settings.colorMode])

    useEffect(() => {
        (async () => setIsDev(await window.electron.isDev()))()
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
            }),
        [themeMode],
    );

    return (
        <SettingsContext.Provider value={settings}>
            <CustomThemeProvider theme={theme}>
                <CssBaseline />
                <TitleBar
                    isDev={isDev}
                    onQuit={() => window.electron.sendFrameAction("QUIT")}
                    onOpenDevTools={() => window.electron.sendFrameAction("OPEN_DEVTOOLS")}
                    backgroundColor={TITLEBAR_COLOR[themeMode]}
                    setSetting={setSetting}
                />
                {/* <Navbar setSetting={setSetting}/> */}
                <main>
                    <Outlet />
                </main>
            </CustomThemeProvider>
        </SettingsContext.Provider>
    )
}

export default App
