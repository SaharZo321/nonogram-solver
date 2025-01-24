import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@components/Navbar/Navbar"
import { CssBaseline, PaletteMode, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "@components/Navbar/Header";
import CustomThemeProvider from "./providers/CustomThemeProvider";



export type Settings = {
    hoverColor: string,
    colorMode: PaletteMode,
}

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const defaultSettings: Settings = {
    hoverColor: 'rgba(150,150,150,0.3)',
    colorMode: isDarkMode ? "dark" : "light"
}

export const SettingsContext = createContext(defaultSettings)

function App() {
    const [settings, setSettings] = useState<Settings>(defaultSettings)
    const [isDev, setIsDev] = useState<boolean>(false)
    const setSetting = useCallback(<Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    useEffect(() => {
        (async () => setIsDev(await window.electron.isDev()))()
    }, [])

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: settings.colorMode,
                },
            }),
        [settings.colorMode],
    );

    return (
        <SettingsContext.Provider value={settings}>
            <CustomThemeProvider theme={theme}>
                <CssBaseline />
                <Header
                    isDev={isDev}
                    onQuit={() => window.electron.sendFrameAction("QUIT")}
                    onMaximize={() => window.electron.sendFrameAction("MAXIMIZE")}
                    onMinimize={() => window.electron.sendFrameAction("MINIMIZE")}
                    onOpenDevTools={() => window.electron.sendFrameAction("OPEN_DEVTOOLS")}
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
