import { createContext, useEffect, useMemo, useState } from "react";
import Navbar from "@components/Navbar/Navbar"
import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

type Settings = {
	hoverColor: string,
	username: string,
	set: (key: SettingsKeys, value: string) => void
}

type ExcludeFunctionPropertyNames<T> = Pick<T, {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T]>;

type SettingsKeys = keyof ExcludeFunctionPropertyNames<Settings>

const defaultSettings = {
	hoverColor: 'rgba(150,150,150,0.3)',
	username: '',
	set: (key: SettingsKeys, value: string) => { }
}
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const SettingsContext = createContext(defaultSettings)
const initColorModeContext = { toggleColorMode: (mode?: PaletteMode) => { } }
export const ColorModeContext = createContext(initColorModeContext);

function App() {
	const [mode, setMode] = useState<PaletteMode>(isDarkMode ? 'dark' : 'light');
	const [settings, setSettings] = useState<Settings>(defaultSettings)

	useEffect(() => {
		const newSet = (key: SettingsKeys, value: string) => {
			setSettings(prev => ({ ...prev, [key]: value }))
		}

		setSettings(prev => ({
			...prev,
			set: newSet
		}))

	}, [])

	const colorMode = useMemo(
		() => ({
			toggleColorMode: (newMode?: PaletteMode) => {
				setMode((prevMode) => newMode ? newMode : (prevMode === 'light' ? 'dark' : 'light'));
			},
		}),
		[],
	);


	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode],
	);

	return (
		<SettingsContext.Provider value={settings}>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Navbar />
					<main>
						<Outlet />
					</main>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</SettingsContext.Provider>
	)
}

export default App
