import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TiktokScraperCodeBlock = () => {
    const [open, setOpen] = useState(false);

    const code = `function autoScrollToBottom() {
        const duration = 120000;
        return new Promise(resolve => {
            const intervalTime = 200; // mỗi lần scroll sau
            const scrollStep = 2000;  // scroll xuống mỗi lần
            const startTime = Date.now();
    
            const interval = setInterval(() => {
                window.scrollBy(0, scrollStep);
                const elapsed = Date.now() - startTime;
    
                if (elapsed >= duration) {
                    clearInterval(interval); // Dừng cuộn
                    resolve();
                }
            }, intervalTime);
        });
    }
    
    function getLinkTiktokVideos() {
        const result = [];
        const seen = new Set(); // tránh trùng link
    
        // Chỉ lấy link video TikTok
        document.querySelectorAll('div[data-e2e="search_video-item"] a[href*="/video/"]')
            .forEach(anchor => {
                const link = anchor.href;
                if (!seen.has(link)) {
                    seen.add(link);
    
                    // Lấy mô tả từ ảnh alt (nếu có)
                    let description = "";
                    const img = anchor.querySelector('img[alt]');
                    if (img) {
                        description = img.alt
                            .replace(/#[^\\s#]+/g, '')       // bỏ hashtag
                            .replace(/created by.*$/i, '')  // bỏ created by
                            .replace(/do .* tạo với.*/i, '')
                            .replace(/\\s+/g, ' ')
                            .trim();
                    }
    
                    result.push({ link, description });
                }
            });
    
        console.table(result);
    
        const textToCopy = result.map(v => \`\${v.link}\\n\${v.description}\`).join('\\n\\n');
    
        // Nút copy
        if (!document.querySelector('#btn-copy-tiktok-videos')) {
            const btn = document.createElement('button');
            btn.id = 'btn-copy-tiktok-videos';
            btn.innerText = 'Copy Video Links';
            btn.style.position = 'fixed';
            btn.style.top = '30px';
            btn.style.right = '30px';
            btn.style.padding = '10px 15px';
            btn.style.background = '#fff';
            btn.style.border = '1px solid #ccc';
            btn.style.color = 'red';
            btn.style.fontWeight = 'bold';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = 999999;
            btn.onclick = () => {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert("✅ Đã copy link video TikTok vào clipboard"))
                    .catch(err => alert("❌ Lỗi khi copy: " + err));
            };
            document.body.appendChild(btn);
        }
    }
    
    // Cuộn tới khi hết nội dung (hoặc sau 120s), sau đó chạy lấy link video
    autoScrollToBottom().then(() => {
        console.log("✅ Đã cuộn xong. Bắt đầu trích xuất link video TikTok...");
        getLinkTiktokVideos();
    });`;

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

export default TiktokScraperCodeBlock;
