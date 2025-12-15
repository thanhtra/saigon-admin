import { tmpdir } from 'os';
import path from 'path';
const fs = require('fs');
const puppeteer = require('puppeteer');


// const downloadTikTokVideoSsstik = async (tiktokUrl: string): Promise<any> => {
//     const browser = await puppeteer.launch({ headless: false, slowMo: 80 });
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://ssstik.io/', {
//             waitUntil: 'networkidle2',
//             timeout: 60000,
//         });

//         await page.type('#main_page_text', tiktokUrl);
//         await page.click('#submit');

//         // Đợi link download hiện
//         await page.waitForSelector('#dl_btns a.download_link.without_watermark', { timeout: 20000 });

//         // Lấy link tải
//         const downloadUrl = await page.$eval('#dl_btns a.download_link.without_watermark', (el: any) => el.href);

//         console.log('✅ Video URL:', downloadUrl);
//         await browser.close();
//         return downloadUrl;

//     } catch (error) {
//         console.error('❌ Error:', error);
//         await browser.close();
//         return null;
//     }
// }

// const downloadTikTokVideoTikWM = async (tiktokUrl: string): Promise<string | null> => {
//     const browser = await puppeteer.launch({ headless: false, slowMo: 80 });
//     const page = await browser.newPage();

//     try {
//         // Navigate to tikwm.com
//         await page.goto('https://tikwm.com/', {
//             waitUntil: 'networkidle2',
//             timeout: 60000,
//         });

//         // Input the TikTok URL into the search field
//         await page.type('input[name="url"]', tiktokUrl);

//         // Click the download button (update selector based on inspection)
//         await page.click('button.btn.btn-success.btn-submit'); // This might need adjustment—see notes below

//         // Wait for the result container with download links to appear
//         await page.waitForSelector('div.result a.btn.btn-success[href*="/video/media/play"]', { timeout: 20000 });

//         // Extract the no-watermark video download URL
//         const downloadUrl = await page.$eval(
//             'div.result a.btn.btn-success[href*="/video/media/play"]',
//             (el: any) => el.href
//         );
//         console.log('✅ Video URL:', downloadUrl);

//         await browser.close();
//         return downloadUrl;
//     } catch (error) {
//         console.error('❌ Error downloading from tikwm.com:', error);
//         await browser.close();
//         return null;
//     }
// };

const saveBlobToFile = async (blob: Blob, filename: string): Promise<string> => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempPath = path.join(tmpdir(), filename);
    fs.writeFileSync(tempPath, buffer);
    return tempPath;
};


// type PageFileInfo = {
//     pageAccessToken: string;
//     pageId: string;
//     downloadUrl: string;
//     description: string;
//     fileName: string;
//     commentText: string;
// };


// const uploadToFacebookReels = async (payload: PageFileInfo): Promise<boolean> => {
//     try {
//         // Step 1: Fetch blob from TikTok video URL
//         const response = await fetch(payload.downloadUrl);
//         const blob = await response.blob();

//         // Step 2: Save blob to a temporary file
//         const videoPath = await saveBlobToFile(blob, payload.fileName);

//         // Step 2: Upload to Facebook /videos
//         const formData = new FormData();
//         formData.append('source', fs.createReadStream(videoPath));
//         formData.append('description', payload.description);
//         formData.append('published', 'true');
//         formData.append('access_token', payload.pageAccessToken);
//         formData.append('privacy', JSON.stringify({ value: 'EVERYONE' }));

//         const fbResponse = await axios.post(
//             `${FACEBOOK_API_URL}/${payload.pageId}/videos`,
//             formData,
//             { headers: formData.getHeaders() }
//         );

//         console.log('✅ Uploaded to Facebook:', fbResponse.data);

//         // Step 3: Cleanup
//         fs.unlinkSync(videoPath);

//         //comment post
//         const videoId = fbResponse.data.id;
//         const commentResponse = await axios.post(
//             `${FACEBOOK_API_URL}/${videoId}/comments`,
//             {
//                 message: payload.commentText,
//                 access_token: payload.pageAccessToken,
//             }
//         );

//         console.log('💬 Comment posted:', commentResponse.data);

//         return true;
//     } catch (error: any) {
//         console.error('❌ Error uploading to Facebook:', error.response?.data || error.message);
//         return false;
//     }
// }