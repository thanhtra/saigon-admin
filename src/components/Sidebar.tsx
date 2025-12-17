'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Collapse,
    Toolbar,
    Box,
    Typography,
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const [openTiktok, setOpenTiktok] = useState(false);
    const [openFacebook, setOpenFacebook] = useState(false);
    const [openLinkedIn, setOpenLinkedIn] = useState(false);
    const [openYoutube, setOpenYoutube] = useState(false);
    const [openData, setOpenData] = useState(false);
    const [openThreads, setOpenThreads] = useState(false);
    const [openPinterest, setOpenPinterest] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [openMarketing, setOpenMarketing] = useState(false);


    const toggleTiktok = () => setOpenTiktok(!openTiktok);
    const toggleFacebook = () => setOpenFacebook(!openFacebook);
    const toggleLinkedIn = () => setOpenLinkedIn(!openLinkedIn);
    const toggleYoutube = () => setOpenYoutube(!openYoutube);
    const toggleData = () => setOpenData(!openData);
    const toggleThreads = () => setOpenThreads(!openThreads);
    const togglePinterest = () => setOpenPinterest(!openPinterest);
    const toggleVideo = () => setOpenVideo(!openVideo);
    const toggleMarketing = () => setOpenMarketing(!openMarketing);


    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', paddingTop: "10px", marginBottom: "50px", }}>
                <List>
                    {/* Marketing */}
                    <ListItemButton onClick={toggleMarketing}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Marketing
                                </Typography>
                            }
                        />
                        {openMarketing ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openMarketing} timeout="auto" unmountOnExit>
                        <ListItemButton
                            sx={{ pl: 4 }}
                            component={Link}
                            href="/marketing/user"
                            selected={isActive('/marketing/user')}
                        >
                            <ListItemText primary="Người dùng" />
                        </ListItemButton>

                        <ListItemButton
                            sx={{ pl: 4 }}
                            component={Link}
                            href="/cron-job"
                            selected={isActive('/cron-job')}
                        >
                            <ListItemText primary="Cron Job" />
                        </ListItemButton>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/check"
                                selected={isActive('/data/check')}
                            >
                                <ListItemText primary="Kiểm tra dữ liệu" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/collaborator"
                                selected={isActive('/data/collaborator')}
                            >
                                <ListItemText primary="Cộng tác viên" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/topics"
                                selected={isActive('/data/topics')}
                            >
                                <ListItemText primary="Chủ đề" />
                            </ListItemButton>

                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/youtube"
                                selected={isActive('/data/youtube')}
                            >
                                <ListItemText primary="Youtube" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate-category"
                                selected={isActive('/data/affiliate-category')}
                            >
                                <ListItemText primary="Danh mục affiliate" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate"
                                selected={isActive('/data/affiliate')}
                            >
                                <ListItemText primary="Affiliate" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/shopee"
                                selected={isActive('/data/shopee')}
                            >
                                <ListItemText primary="Shopee" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate-category-topic"
                                selected={isActive('/data/affiliate-category-topic')}
                            >
                                <ListItemText primary="Map Danh mục và Chủ đề" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/post"
                                selected={isActive('/data/post')}
                            >
                                <ListItemText primary="Bài đăng" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/broker"
                                selected={isActive('/data/broker')}
                            >
                                <ListItemText primary="Môi giới BDS" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/gmail"
                                selected={isActive('/data/gmail')}
                            >
                                <ListItemText primary="Gmail" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Quản lý dữ liệu */}
                    <ListItemButton onClick={toggleData}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Quản lý dữ liệu
                                </Typography>
                            }
                        />
                        {openData ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openData} timeout="auto" unmountOnExit>
                        <ListItemButton
                            sx={{ pl: 4 }}
                            component={Link}
                            href="/manage-post"
                            selected={isActive('/manage-post')}
                        >
                            <ListItemText primary="Đăng bài" />
                        </ListItemButton>

                        <ListItemButton
                            sx={{ pl: 4 }}
                            component={Link}
                            href="/cron-job"
                            selected={isActive('/cron-job')}
                        >
                            <ListItemText primary="Cron Job" />
                        </ListItemButton>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/check"
                                selected={isActive('/data/check')}
                            >
                                <ListItemText primary="Kiểm tra dữ liệu" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/collaborator"
                                selected={isActive('/data/collaborator')}
                            >
                                <ListItemText primary="Cộng tác viên" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/topics"
                                selected={isActive('/data/topics')}
                            >
                                <ListItemText primary="Chủ đề" />
                            </ListItemButton>

                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/youtube"
                                selected={isActive('/data/youtube')}
                            >
                                <ListItemText primary="Youtube" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate-category"
                                selected={isActive('/data/affiliate-category')}
                            >
                                <ListItemText primary="Danh mục affiliate" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate"
                                selected={isActive('/data/affiliate')}
                            >
                                <ListItemText primary="Affiliate" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/shopee"
                                selected={isActive('/data/shopee')}
                            >
                                <ListItemText primary="Shopee" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/affiliate-category-topic"
                                selected={isActive('/data/affiliate-category-topic')}
                            >
                                <ListItemText primary="Map Danh mục và Chủ đề" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/post"
                                selected={isActive('/data/post')}
                            >
                                <ListItemText primary="Bài đăng" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/broker"
                                selected={isActive('/data/broker')}
                            >
                                <ListItemText primary="Môi giới BDS" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/data/gmail"
                                selected={isActive('/data/gmail')}
                            >
                                <ListItemText primary="Gmail" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Facebook */}
                    <ListItemButton onClick={toggleFacebook}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Facebook
                                </Typography>
                            }
                        />
                        {openFacebook ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFacebook} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/facebook/account"
                                selected={isActive('/facebook/account')}
                            >
                                <ListItemText primary="Tài khoản" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/facebook/app"
                                selected={isActive('/facebook/app')}
                            >
                                <ListItemText primary="App Developer" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/facebook/page-facebook"
                                selected={isActive('/facebook/page-facebook')}
                            >
                                <ListItemText primary="Fanpage" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/facebook/group-facebook"
                                selected={isActive('/facebook/group-facebook')}
                            >
                                <ListItemText primary="Group" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Threads */}
                    <ListItemButton onClick={toggleThreads}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Threads
                                </Typography>
                            }
                        />
                        {openThreads ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openThreads} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/thread/thread-account"
                                selected={isActive('/thread/thread-account')}
                            >
                                <ListItemText primary="Tài khoản" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* LinkedIn */}
                    <ListItemButton onClick={toggleLinkedIn}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    LinkedIn
                                </Typography>
                            }
                        />
                        {openLinkedIn ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openLinkedIn} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/linkedin/account"
                                selected={isActive('/linkedin/account')}
                            >
                                <ListItemText primary="Tài khoản" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/linkedin/page"
                                selected={isActive('/linkedin/page')}
                            >
                                <ListItemText primary="Fanpage" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Tiktok */}
                    <ListItemButton onClick={toggleTiktok}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Tiktok
                                </Typography>
                            }
                        />
                        {openTiktok ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openTiktok} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/tiktok/video-tiktok"
                                selected={isActive('/data/video-tiktok')}
                            >
                                <ListItemText primary="Video" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/tiktok/product-tiktok"
                                selected={isActive('/tiktok/product-tiktok')}
                            >
                                <ListItemText primary="Sản phẩm" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Youtube */}
                    <ListItemButton onClick={toggleYoutube}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Youtube
                                </Typography>
                            }
                        />
                        {openYoutube ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openYoutube} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/youtube/post-shorts"
                                selected={isActive('/youtube/post-shorts')}
                            >
                                <ListItemText primary="Đăng video shorts" />
                            </ListItemButton>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/youtube/group"
                                selected={isActive('/youtube/group')}
                            >
                                <ListItemText primary="Nhóm" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Pinterest */}
                    <ListItemButton onClick={togglePinterest}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Pinterest
                                </Typography>
                            }
                        />
                        {openPinterest ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openPinterest} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/pinterest/pinterest-account"
                                selected={isActive('/pinterest/pinterest-account')}
                            >
                                <ListItemText primary="Tài khoản" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Video */}
                    <ListItemButton onClick={toggleVideo}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Video
                                </Typography>
                            }
                        />
                        {openVideo ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openVideo} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/video/generate-from-tiktok"
                                selected={isActive('/video/generate-from-tiktok')}
                            >
                                <ListItemText primary="Generate Tiktok" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <Collapse in={openVideo} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                component={Link}
                                href="/video/generate-from-youtube"
                                selected={isActive('/video/generate-from-youtube')}
                            >
                                <ListItemText primary="Generate Youtube" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
