import {
    Box,
    Card,
    Link,
    styled,
    Switch,
    type SwitchProps,
    Typography
} from "@mui/material";


export const TitleMain = styled(Typography)(() => ({
    color: "#4C7195",
    fontSize: "20px",
    textTransform: "uppercase",
    marginBottom: "20px",
    fontWeight: "500"
}));

export const TitleSub = styled(Typography)(() => ({
    color: "#71954c",
    fontSize: "18px",
    textTransform: "uppercase",
    marginBottom: "20px",
    fontWeight: "500"
}));

export const Note = styled(Typography)(() => ({
    fontSize: "16px",
    marginBottom: "20px",
}));


export const HeaderRow = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex',
    marginBottom: '16px',
    width: '100%'
});

export const HeaderRowOneItem = styled('div')({
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'flex',
    marginBottom: '16px',
    width: '100%'
});

export const BackLink = styled(Link)({
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#555',
    border: '1px solid #71954c',
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: '#71954c',
        color: '#fff',
    },
    svg: {
        marginRight: '6px',
    },
});

// export const CardItem = styled(Card)(() => ({
//     padding: "20px",
//     width: "100%",
//     height: "100%",
//     background: "#fff",
//     marginBottom: "20px"
// }));

export const CardItem = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    // transition: 'all 0.3s ease',
    marginBottom: theme.spacing(3),
    // '&:hover': {
    //     boxShadow: '0 6px 28px rgba(0,0,0,0.1)',
    //     transform: 'translateY(-2px)',
    // },
}));

export const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}));

export const BoxTwoColumn = styled('div')({
    display: 'flex',
    gap: '16px',
});

export const TextOver = styled(Box)({
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
});