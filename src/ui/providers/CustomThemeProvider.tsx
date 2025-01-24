import { createTheme } from "@mui/material";
import ThemeProvider, { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";

declare module '@mui/material/styles' {
    interface Palette {
        monochrome: Palette['primary'];
    }

    interface PaletteOptions {
        monochrome?: PaletteOptions['primary'];
    }
}

// Update the Button's color options to include a monochrome option
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        monochrome: true;
    }
}

let customTheme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
    components: {
        MuiButton: {
            styleOverrides: {
                root: { minWidth: 48, textTransform: "none" }
            }
        }
    },
});

customTheme = createTheme(customTheme, {
    // Custom colors created with augmentColor go here
    palette: {
        monochrome: customTheme.palette.augmentColor({
            color: {
                main: '#d5d5d5',
            },
            name: 'monochrome',
        }),
    },
});

export default function CustomThemeProvider(props: ThemeProviderProps) {
    const theme = createTheme(customTheme, {
        ...props.theme,
    })
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )

}