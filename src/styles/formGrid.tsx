export const formGridStyles = {
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2, // khoảng cách giữa các cột và hàng
    },
    fullWidth: {
        gridColumn: 'span 2',
    },
    alignRight: {
        gridColumn: 'span 2',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionRow: {
        gridColumn: 'span 2',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // chia 2 nửa trái / phải
        alignItems: 'center',
        mt: 2,
    },
    actionLeft: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    actionRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '30px',
    },
    submitButton: {
        gridColumn: 'span 2',
        justifySelf: 'end',
        width: 200,
        mt: 2,
    },
};
