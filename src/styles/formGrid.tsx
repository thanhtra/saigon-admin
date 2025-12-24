// src/styles/formGrid.ts
export const formGridStyles = {
    form: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2, // khoảng cách giữa các cột và hàng
    },
    fullWidth: {
        gridColumn: 'span 2', // chiếm toàn bộ 2 cột
    },
    alignRight: {
        gridColumn: 'span 2',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionRow: {
        gridColumn: 'span 2',
        display: 'flex',
        justifyContent: 'flex-end', // cả cụm nằm bên phải
        alignItems: 'center',
        gap: '30px',                // khoảng cách giữa switch và nút
    },
    submitButton: {
        gridColumn: 'span 2',
        justifySelf: 'end',
        width: 200,
        mt: 2,
    },
};
