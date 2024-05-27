import { Brightness4, Brightness7, ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, List, ListItem, Toolbar, Typography, useTheme } from "@mui/material";
import { PropsWithChildren, useContext, useState } from "react";
import AppDrawer from "./AppDrawer";
import { ColorModeContext } from "../../App";
import { Link, NavLink, useMatch } from "react-router-dom";
import styled from "@emotion/styled";

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const theme = useTheme()
    const colorMode = useContext(ColorModeContext)
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
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <AppDrawer open={drawerOpen} onClose={setDrawerOpen} />
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