import { ProductTiktokCategory, ProductTiktokCategoryLabel } from "@/utils/const";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import { MAIL_TO, NickTiktok, PROMPT_TEMPLATE } from "./const";
import { ProductWithNextOrder } from "./page";


type Props = {
    open: boolean;
    onClose: () => void;
    product: ProductWithNextOrder | null;
    onMarkPosted?: (id: string) => Promise<void> | void;
    onGetPrompt?: (prompt: string) => void;
};

export default function ProductPopupActions({
    open,
    onClose,
    product,
    onMarkPosted,
    onGetPrompt,
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const [snack, setSnack] = React.useState<{ open: boolean; severity?: "success" | "error" | "info"; message?: string }>({
        open: false,
    });
    const [promptShown, setPromptShown] = React.useState<string>("");

    React.useEffect(() => {
        if (product && open) {
            const prompt = PROMPT_TEMPLATE.replace(/{{\s*title\s*}}/g, product.title || "");
            setPromptShown(prompt);
            if (onGetPrompt) onGetPrompt(prompt);
        } else {
            setPromptShown("");
        }
    }, [product, open, onGetPrompt]);

    if (!product) return null;

    const handleOpenLink = () => window.open(product.link, "_blank", "noopener,noreferrer");

    const handleDownloadImage = async () => {
        if (!product.img_url) {
            setSnack({ open: true, severity: "error", message: "Không có img_url để tải." });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(product.img_url, { mode: "cors" });
            if (!res.ok) throw new Error(`Fetch image failed: ${res.status}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const safe = (product.title || product.id).slice(0, 40).replace(/[^a-z0-9_\-\.]/gi, "_");
            const ext = (blob.type && blob.type.split("/")[1]) || "jpg";
            a.download = `${safe}.${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            setSnack({ open: true, severity: "success", message: "Đã tải ảnh về." });
        } catch (err) {
            console.error(err);
            setSnack({ open: true, severity: "error", message: "Tải ảnh thất bại." });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMail = async () => {
        const subject = `stt ${product.next_order_index} -- tiktok ${NickTiktok[product.category as ProductTiktokCategory] || 0}`;
        const body = [
            `${ProductTiktokCategoryLabel[product.category as ProductTiktokCategory] || "-"} - ${NickTiktok[product.category as ProductTiktokCategory]}`,
            `${product.title}`,
            `${product.link}`,
        ].join("\n\n");

        try {
            const mailto = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailto, "_self");
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkPosted = async () => {
        try {
            setLoading(true);
            if (onMarkPosted) {
                await onMarkPosted(product.id);
            } else {
                setSnack({ open: true, severity: "error", message: "Cập nhật thất bại." });
            }
        } catch (err) {
            console.log("error: ", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(promptShown);
            setSnack({ open: true, severity: "success", message: "Đã copy prompt." });
        } catch {
            setSnack({ open: true, severity: "error", message: "Copy prompt thất bại." });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Thông tin sản phẩm <Button onClick={onClose} sx={{ float: "right" }}>Đóng</Button></DialogTitle>
                <DialogContent dividers>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Box sx={{ minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Avatar
                                variant="rounded"
                                src={product.img_url}
                                alt={product.title}
                                sx={{ width: 140, height: 140 }}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">Tiktok</Typography>
                            <Typography variant="body1" gutterBottom>
                                {NickTiktok[product.category as ProductTiktokCategory]}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Loại sản phẩm</Typography>
                            <Typography variant="body1" gutterBottom>
                                {ProductTiktokCategoryLabel[product.category as ProductTiktokCategory] || "-"}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Tiêu đề</Typography>
                            <Typography variant="body1" gutterBottom>{product.title}</Typography>


                            <Typography variant="subtitle2" color="text.secondary">Link</Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2">Xem sản phẩm</Typography>
                                <IconButton size="small" onClick={handleOpenLink}><OpenInNewIcon /></IconButton>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadImage}
                                    disabled={!product.img_url || loading}
                                    size="small"
                                >
                                    {loading ? <CircularProgress size={16} /> : "Tải hình"}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={handleCopyPrompt}
                                    size="small"
                                >
                                    Lấy prompt
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<EmailIcon />}
                                    onClick={handleSendMail}
                                    size="small"
                                >
                                    Gửi mail
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleMarkPosted}
                                    size="small"
                                    disabled={product.is_posted}
                                >
                                    {product.is_posted ? "Đã tạo video" : "Cập nhật đã tạo video"}
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* ✅ Luôn hiển thị prompt */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">Prompt</Typography>
                        <TextField
                            value={promptShown}
                            multiline
                            minRows={6}
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity || "info"} sx={{ width: "100%" }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
}
