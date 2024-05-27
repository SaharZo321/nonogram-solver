import { createContext, useMemo, useState } from "react";
import Navbar from "./Components/Navbar/Navbar"
import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { Outlet, useMatch } from "react-router-dom";

const settings = {
	hoverColor: 'rgba(150,150,150,0.3)',
}

export const SettingsContext = createContext(settings)
const initColorModeContext = { toggleColorMode: (mode?: PaletteMode) => { } }
export const ColorModeContext = createContext(initColorModeContext);

function App() {
	const [mode, setMode] = useState<PaletteMode>('light');
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
