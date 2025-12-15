import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ScriptGetGroupFacebookIds = () => {
    const [open, setOpen] = useState(false);

    const code = `function autoScrollToBottom() {
    const duration = 300000;

    return new Promise(resolve => {
        const intervalTime = 200;
        const scrollStep = 2000;
        const startTime = Date.now();

        const interval = setInterval(() => {
            window.scrollBy(0, scrollStep);
            const elapsed = Date.now() - startTime;

            if (elapsed >= duration) {
                clearInterval(interval);
                resolve();
            }
        }, intervalTime);
    });
}

function extractGroupIdsAndNamesWithK() {
    const anchors = Array.from(document.querySelectorAll('a[href*="facebook.com/groups/"]'));
    const groups = [];

    anchors.forEach((a, index) => {
        // Extract group ID from href
        const href = a.getAttribute('href');
        const match = href.match(/facebook\\.com\\/groups\\/([^/?#]+)/);
        if (!match) {
            console.log(\`Anchor \${index}: No group ID found in href: \${href}\`);
            return;
        }

        const id = match[1];

        // Check for 'K' in nearby text (e.g., "12k members")
        let container = a.parentElement;
        let foundK = false;
        for (let i = 0; i < 5 && container; i++) {
            const textNearby = container.innerText || '';
            if (/[\\d,.]+\\s*[kK]/.test(textNearby)) {
                foundK = true;
                break;
            }
            container = container.parentElement;
        }

        if (!foundK) {
            console.log(\`Anchor \${index}: No 'K' found near group ID \${id}\`);
            return;
        }

        // Try to extract group name
        let name = '';

        // Attempt 1: Get text from <a> tag
        name = a.textContent?.trim();
        console.log(\`Anchor \${index}: Attempt 1 (a.textContent): \${name}\`);

        // Attempt 2: Get text from aria-label
        if (!name || name.length < 2) {
            const ariaLabel = a.getAttribute('aria-label') || '';
            if (ariaLabel.startsWith('Profile photo of')) {
                name = ariaLabel.replace('Profile photo of', '').trim();
            }
            console.log(\`Anchor \${index}: Attempt 2 (aria-label): \${name}\`);
        }

        // Attempt 3: Get text from span with class xjp7ctv
        if (!name || name.length < 2) {
            name = a.querySelector('span.xjp7ctv')?.textContent?.trim() || '';
            console.log(\`Anchor \${index}: Attempt 3 (span.xjp7ctv): \${name}\`);
        }

        // Attempt 4: Get text from closest div with specific classes
        if (!name || name.length < 2) {
            const parentDiv = a.closest('div.x78zum5.xdt5ytf.xz62fqu.x16ldp7u');
            name = parentDiv?.querySelector('a')?.textContent?.trim() || '';
            console.log(\`Anchor \${index}: Attempt 4 (parent div a): \${name}\`);
        }

        // Final fallback
        if (!name || name.length < 2) {
            name = '[Không tìm được tên]';
            console.log(\`Anchor \${index}: No name found for group ID \${id}\`);
        }

        groups.push({ id, name });
        console.log(\`Anchor \${index}: Final group - ID: \${id}, Name: \${name}\`);
    });

    // Remove duplicates by ID
    const seen = new Set();
    const uniqueGroups = groups.filter(g => {
        if (seen.has(g.id)) {
            console.log(\`Duplicate group ID filtered: \${g.id}\`);
            return false;
        }
        seen.add(g.id);
        return true;
    });

    if (uniqueGroups.length === 0) {
        alert("⚠️ Không tìm thấy group nào có chữ 'K' gần link.");
        console.log("No groups found with 'K' in nearby text.");
        return;
    }

    // Format result
    const resultText = uniqueGroups.map(g => \`\${g.id}\\n\${g.name}\`).join('\\n\\n');

    // Create copy button
    const btn = document.createElement('button');
    btn.innerText = '📋 Copy Group IDs và Tên (có chữ K)';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    btn.onclick = () => {
        navigator.clipboard.writeText(resultText)
            .then(() => alert("✅ Đã copy danh sách nhóm vào clipboard"))
            .catch(err => alert(\`❌ Lỗi khi copy: \${err}\`));
    };
    document.body.appendChild(btn);

    console.log('✅ Các nhóm lấy được:', uniqueGroups);
    console.log('Result text:', resultText);
}

autoScrollToBottom().then(() => {
    console.log("Đã cuộn xong. Bắt đầu lọc nhóm...");
    extractGroupIdsAndNamesWithK();
});
`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setOpen(true);
        } catch (err) {
            console.error('Failed to copy:', err);
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
                    mt: 2,
                    mb: 3,
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

export default ScriptGetGroupFacebookIds;