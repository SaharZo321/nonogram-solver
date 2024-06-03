import { Button, Slider, styled } from "@mui/material";

export const StyledButton = styled(Button)({
    width: '64px',
    height: '64px'
})

export const StyledSlider = styled(Slider)(({ theme }) => ({
    height: 4,
    '& .MuiSlider-thumb': {
        width: 16,
        height: 16,
        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
        '&::before': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
        },
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                ? 'rgb(255 255 255 / 16%)'
                : 'rgb(0 0 0 / 16%)'
                }`,
        },
        '&.Mui-active': {
            width: 24,
            height: 24,
        },
    },
    '& .MuiSlider-rail': {
        opacity: 0.28,
    },
}))