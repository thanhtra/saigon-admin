export const formGridStyles = {
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2, // khoảng cách giữa các cột và hàng
    },
    fullWidth: {
        gridColumn: 'span 2',
    },
    formFour: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2, // khoảng cách giữa các cột và hàng
    },
    formTwo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2, // khoảng cách giữa các cột và hàng
    },
    fullWidthFormFour: {
        gridColumn: 'span 4',
    },

    alignRight: {
        gridColumn: 'span 2',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionRow: {
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            md: 'minmax(0, 1fr) minmax(0, 1fr)',
        },
        alignItems: 'center',
        mt: 2,
        width: '100%',
        minWidth: 0,
    },

    actionRowFormFour: {
        gridColumn: 'span 4',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // chia 2 nửa trái / phải
        alignItems: 'center',
        mt: 2,
    },
    actionLeftFormFour: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '15px',
    },
    actionLeft: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '30px',
    },
    actionRightInLeft: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: {
            xs: 1.5,
            md: '30px',
        },
        minWidth: 0,
        flexWrap: 'wrap',
    },
    submitButton: {
        gridColumn: 'span 2',
        justifySelf: 'end',
        width: 200,
        mt: 2,
    },
    twoColumnGrid: {
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    },
};

