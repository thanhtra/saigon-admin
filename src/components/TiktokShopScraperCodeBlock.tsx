import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TiktokShopScraperCodeBlock = () => {
    const [open, setOpen] = useState(false);

    const code = `// ✅ Lấy danh sách sản phẩm TikTok Shop
const products = [...document.querySelectorAll('a[href*="/shop/vn/pdp/"]')].map(aTag => {
  const nameTag = aTag.querySelector('h3');
  return {
    url: aTag.href,
    name: nameTag?.getAttribute('title') || nameTag?.innerText || '',
  };
});

// ✅ Tạo nội dung text xuống dòng (mỗi sản phẩm cách nhau 1 dòng trống)
const text = products
  .map(p => \`\${p.url}\\n\${p.name}\`)
  .join('\\n\\n');

// ✅ Xóa hộp cũ (nếu có)
document.getElementById('tiktok-affiliate-box')?.remove();

// ✅ Tạo hộp hiển thị kết quả
const container = document.createElement('div');
container.id = 'tiktok-affiliate-box';
Object.assign(container.style, {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: '999999',
  background: 'white',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  maxHeight: '400px',
  overflow: 'auto',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  fontFamily: 'sans-serif',
  width: '320px',
});

// ✅ Hiển thị danh sách sản phẩm
const pre = document.createElement('pre');
pre.textContent = text || 'Không tìm thấy sản phẩm nào!';
Object.assign(pre.style, {
  whiteSpace: 'pre-wrap',
  fontSize: '13px',
  marginBottom: '8px',
});
container.appendChild(pre);

// ✅ Tạo nút Copy
if (text.trim()) {
  const btn = document.createElement('button');
  btn.textContent = 'Copy';
  Object.assign(btn.style, {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  });

  btn.onclick = async () => {
    await navigator.clipboard.writeText(text);
    // 🔥 Ẩn toàn bộ khung sau khi copy
    container.remove();
    alert('✅ Đã copy toàn bộ danh sách sản phẩm!');
  };

  container.appendChild(btn);
}

// ✅ Gắn vào trang
document.body.appendChild(container);`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setOpen(true);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: '#1e1e1e',
                    color: '#fff',
                    p: 2,
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    position: 'relative',
                    marginTop: '20px',
                    marginBottom: '30px',
                }}
            >
                <Button
                    onClick={handleCopy}
                    startIcon={<ContentCopyIcon />}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        borderColor: 'white',
                    }}
                    variant="outlined"
                >
                    Copy
                </Button>
                <code>{code}</code>
            </Box>

            <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Đã sao chép vào clipboard!
                </Alert>
            </Snackbar>
        </>
    );
};

export default TiktokShopScraperCodeBlock;
