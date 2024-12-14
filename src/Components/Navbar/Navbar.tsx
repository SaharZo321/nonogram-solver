import { AccountCircle, Brightness4, Brightness7, ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton,  Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
import { MouseEvent, PropsWithChildren, useCallback, useContext, useState } from "react";
import AppDrawer from "./AppDrawer";
import { ColorModeContext, SettingsContext } from "@renderer/App";
import { Link, useMatch } from "react-router-dom";
import styled from "@emotion/styled";
import LoginDialog from "./LoginDialog";

const menuItems: string[] = ['ITEM 1', 'ITEM 2', 'LOGOUT']

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const theme = useTheme()
    const colorMode = useContext(ColorModeContext)
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const { username, set } = useContext(SettingsContext)
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)


    const handleCloseUserMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(null)
        const id = event.currentTarget.id
        id === 'LOGOUT' && 
            set('username', "")
    }, [set])

    const handleOpenUserMenu = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }, [])

    const onLogin = useCallback((newUsername: string) => {
        set('username', newUsername)
        setLoginDialogOpen(false)
    }, [set])


    return (
        <>
            <AppBar sx={{
                zIndex: theme.zIndex.drawer + 1
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                            mr: 2,
                        }}
                        onClick={() => setDrawerOpen(prev => !prev)}
                    >
                        {
                            drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />
                        }
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Nonogram Solver
                    </Typography>
                    <LinkList>
                        <CustomLink to='/' text="Home"></CustomLink>
                        <CustomLink to='/ai-solver/board-creation' text="Ai Solver" match="/ai-solver/*"></CustomLink>
                    </LinkList>
                    <IconButton onClick={() => colorMode.toggleColorMode()} color="inherit" sx={{ ml: 'auto' }}>
                        {theme.palette.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                    {
                        username ?
                            <Button
                                color="inherit"
                                onClick={handleOpenUserMenu}
                            >
                                <Box display="flex" gap="4px" alignItems="center">
                                    <AccountCircle />
                                    {username}
                                </Box>
                            </Button > :
                            <Button
                                color="inherit"
                                onClick={() => setLoginDialogOpen(true)}
                            >
                                Sign In
                            </Button>
                    }
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {menuItems.map((item) => (
                            <MenuItem key={item} id={item} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{item}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </AppBar>
            <AppDrawer open={drawerOpen} onClose={setDrawerOpen} />
            <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} onLogin={onLogin} />
        </>
    )
}

type CustomLinkProps = PropsWithChildren<{ to: string, text: string, match?: string }>

function CustomLink(props: CustomLinkProps) {
    const pathMatch = useMatch(props.match ? props.match : props.to)

    return (
        <EnlargeOnHover>
            <Link to={props.to} style={{ textDecoration: 'none' }}>
                <Typography variant="h6" color='white' fontWeight={pathMatch ? 'bold' : 'nomral'}>
                    {props.text}
                </Typography>
            </Link>
        </EnlargeOnHover>
    )
}

const EnlargeOnHover = styled.div`
    transition: 0.1s ease-in-out;
    @media (hover: hover) {
        &:hover {
            transform: scale(1.15);
        }
   }
`

const LinkList = styled(Box)({
    display: 'flex',
    gap: '16px',
    padding: '0 32px',
})