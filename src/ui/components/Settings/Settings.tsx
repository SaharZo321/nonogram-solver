import React, { useCallback, useContext, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Select,
    MenuItem,
    Popover,
} from "@mui/material";
import { Settings, SettingsContext } from "@renderer/App";
import { HexColorPicker } from "react-colorful";
import { useDebouncedCallback } from "use-debounce";

type SettingsModalProps = {
    open: boolean,
    onClose: () => void,
    setSetting: <Key extends keyof Settings >(key: Key, value: Settings[Key]) => void
}

const DEBOUNCE_DELAY_MS = 50

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, setSetting: setSettings }) => {
    const handleTileColorChange = useDebouncedCallback((color: string) => setSettings("tileColor", color), DEBOUNCE_DELAY_MS)
    const handleHoverColorChange = useDebouncedCallback((color: string) => setSettings("hoverColor", color), DEBOUNCE_DELAY_MS)
    const handleThemeChange = useCallback((theme: string) => setSettings("colorMode", theme as Settings["colorMode"]), [])

    const { colorMode, hoverColor, tileColor } = useContext(SettingsContext)

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent sx={{ width: 400, height: "50vh" }}>
                {/* Theme Selection */}
                <Box>
                    <h3>Theme</h3>
                    <Select
                        value={colorMode}
                        onChange={event => handleThemeChange(event.target.value)}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="system">System</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                    </Select>
                </Box>

                {/* Tile Color */}
                <Box>
                    <h3>Tile Color</h3>
                    <ColorPickerField
                        color={tileColor}
                        onChange={handleTileColorChange}
                    />
                </Box>

                {/* Tile Hover Color */}
                <Box>
                    <h3>Tile Hover Color</h3>
                    <ColorPickerField
                        color={hoverColor}
                        onChange={handleHoverColorChange}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsModal;

const ColorPickerField: React.FC<{
    color: string;
    onChange: (color: string) => void;
}> = ({ color, onChange }) => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                variant="contained"
                sx={{
                    backgroundColor: color,
                    width: "100%",
                    minHeight: "40px",
                    borderRadius: "8px",
                    padding: 0,
                    boxShadow: "inset 0 0 10px black",
        
                    // "&:hover": { backgroundColor: color },
                }}
            />

            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Box p={2}>
                    <HexColorPicker color={color} onChange={onChange} />
                </Box>
            </Popover>
        </>
    );
};
