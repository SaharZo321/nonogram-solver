import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Dialog, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type LoginDialogProps = {
    open: boolean,
    onClose: () => void
    onLogin: (usedrname: string) => void
}

const usernameRegex = /^[\w\d_]{3,16}$/

const passwordRegex = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/

export default function LoginDialog(props: LoginDialogProps) {

    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const onCredentialsChange = useCallback((value: string, id: string) => {
        setCredentials(prev => ({
            ...prev,
            [id]: value,
        }))
    }, [])

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }, [])

    useEffect(() => {
        if(props.open) {
            setCredentials({ username: "", password: "" })
            setShowPassword(false)
        }
    }, [props.open])

    const isPasswordOk = useCallback(() => Boolean(credentials.password.match(passwordRegex)), [credentials.password])
    const isUsernameOk = useCallback(() => Boolean(credentials.username.match(usernameRegex)), [credentials.username])

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <Box display='flex' flexDirection='column' padding='24px' gap='36px' alignItems='center' >
                <Box display='flex' flexDirection='column' gap='4px' alignItems='center' >
                    <FormControl
                        sx={{ m: 1, width: '25ch' }}
                        required
                        error={!isUsernameOk()}
                    >
                        <InputLabel>Username</InputLabel>
                        <OutlinedInput
                            id="username"
                            label="Username"
                            onChange={(event) => onCredentialsChange(event.target.value, event.target.id)}
                            value={credentials.username}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: '25ch' }}
                        required
                        error={!isPasswordOk()}
                    >
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={(event) => onCredentialsChange(event.target.value, event.target.id)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{ m: 1, width: '10ch' }}
                        disabled={!isPasswordOk() || !isUsernameOk()}
                        onClick={() => props.onLogin(credentials.username)}
                    >
                        Login
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => props.onLogin('Guest')}
                >
                    Sign in as guest
                </Button>
            </Box>
        </Dialog>
    )
}