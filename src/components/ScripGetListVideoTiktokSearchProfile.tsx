import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TiktokScraperCodeBlock = () => {
    const [open, setOpen] = useState(false);

    const code = `function autoScrollToBottom() {
        const duration = 12000;
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
    
    function getLinkTiktok() {
        const result = [];

    document.querySelectorAll('div[data-e2e="user-post-item"] a').forEach(anchor => {
    const link = anchor.href;
    const img = anchor.querySelector('img[alt]');
    
    if (img) {
        let fullText = img.alt;

        // Làm sạch mô tả: bỏ hashtag và phần "created by ..." hoặc "do ... tạo với ..."
        let cleanText = fullText
        .replace(/#[^\\s#]+/g, '')                          // bỏ hashtag (ví dụ: #dailyvlog)
        .replace(/created by.*$/i, '')                    // bỏ "created by ..."
        .replace(/do .* tạo với.*/i, '')                  // bỏ "do ... tạo với ..."
        .replace(/\\s+/g, ' ')                             // gom khoảng trắng thừa
        .trim();

        result.push({ link, description: cleanText });
    }
    });

    console.table(result);
    
        const textToCopy = result.map(v => \`\${v.link}\\n\${v.description}\`).join('\\n\\n');
    
        const btn = document.createElement('button');
       btn.innerText = 'Copy Links';
       btn.style.position = 'fixed';
       btn.style.top = '30px';
       btn.style.right = '30px';
       btn.style.color = 'red';
       btn.style.zIndex = 999999;
       btn.onclick = () => {
           navigator.clipboard.writeText(textToCopy)
               .then(() => alert("✅ Đã copy ID nhóm vào clipboard"))
               .catch(err => alert("❌ Lỗi khi copy: " + err));
       };
       document.body.appendChild(btn);
    }
    
    // Cuộn tới khi hết nội dung (hoặc sau 18s), sau đó chạy lấy nhóm
    autoScrollToBottom().then(() => {
        console.log("✅ Đã cuộn xong. Bắt đầu trích xuất nhóm...");
        getLinkTiktok();
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
                    marginTop: "20px",
                    marginBottom: "30px"
                }}
            >
                <Button
                    onClick={handleCopy}
                    startIcon={<ContentCopyIcon />}
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white', borderColor: 'white' }}
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



// const code = `const result = [];

// document.querySelectorAll('div[data-e2e="search_top-item"] a').forEach(anchor => {
//   const link = anchor.href;
//   const img = anchor.querySelector('img[alt]');
  
//   if (img) {
//     let fullText = img.alt;

//     // Làm sạch mô tả: bỏ hashtag và phần "created by ..." hoặc "do ... tạo với ..."
//     let cleanText = fullText
//       .replace(/#\S+/g, '')                      // bỏ hashtag
//       .replace(/created by.*$/i, '')             // bỏ "created by ..." và những gì sau đó
//       .replace(/do .* tạo với.*/i, '')           // bỏ "do ... tạo với ..."
//       .replace(/\s+/g, ' ')                      // gom khoảng trắng thừa
//       .trim();

//     result.push({ link, description: cleanText });
//   }
// });

// console.table(result);

// // Copy ra clipboard nếu muốn
// copy(result.map(v => \`\${v.link}\\n\${v.description}\`).join('\\n\\n'));`;
