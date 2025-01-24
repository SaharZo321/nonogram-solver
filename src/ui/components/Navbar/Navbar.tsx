import { Brightness4, Brightness7, ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import styled from "@emotion/styled";
import { Settings } from "@renderer/App";

type NavbarProps = {
    setSetting: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void,
}

export default function Navbar(props: NavbarProps) {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const theme = useTheme()

    return (
        <>
            <AppBar>
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
                    <IconButton
                        onClick={() => (
                            props.setSetting("colorMode", theme.palette.mode === 'light' ? "dark" : "light")
                        )}
                        color="inherit"
                        sx={{ ml: 'auto' }}>
                        {theme.palette.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    )
}

type CustomLinkProps = PropsWithChildren<{ to: string, text: string, match?: string }>

function CustomLink(props: CustomLinkProps) {
    const pathMatch = useMatch(props.match ? props.match : props.to)

    return (
        <EnlargeOnHover>
            <Link to={props.to} style={{ textDecoration: 'none' }}>
                <Typography variant="h6" color='white' fontWeight={pathMatch ? 'bold' : 'normal'}>
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