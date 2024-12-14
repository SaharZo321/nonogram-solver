import { Box, Drawer, FormControlLabel, FormGroup, List, ListItem, Switch } from "@mui/material";
import { useContext, useReducer } from "react";
import { ColorModeContext } from "@renderer/App";

type AppDrawerProps = {
    open: boolean,
    onClose: (open: boolean) => void
}


type SettingsOptions = {
    shit: boolean
}

type SettingsReducerActions = {
    type: 'change-shit',
    payload: SettingsOptions['shit'],
}

const settingsReducer = (state: SettingsOptions, action: SettingsReducerActions): SettingsOptions => {
    switch (action.type) {
        case 'change-shit': {
            console.log(state)
            return {
                ...state,
                shit: action.payload
            }

        }
        default: {
            return state
        }
    }
}

export default function AppDrawer(props: AppDrawerProps) {
    const [settingsState, settingsDispatcher] = useReducer(settingsReducer, { shit: false })

    return (
        <Drawer
            open={props.open}
            onClose={() => props.onClose(false)}
        >
            <Box sx={{
                paddingTop: '80px',
                width: '300px'
            }}>
                <List>
                    <ListItem sx={{ justifyContent: 'center' }}>
                        
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}