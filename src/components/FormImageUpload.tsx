'use client';

import {
    Box,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { UploadPreview } from '@/common/type';

export default function FormImageUpload({
    value = [],
    onChange,
    label,
}: {
    value?: UploadPreview[];
    onChange: (files: UploadPreview[]) => void;
    label?: string;
}) {
    const images = value;

    const handleAddFiles = (files: FileList) => {
        const newFiles: UploadPreview[] = Array.from(files).map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            isCover: images.length === 0 && index === 0,
            client_id: crypto.randomUUID()
        }));

        onChange([...images, ...newFiles]);
    };

    const handleRemove = (idx: number) => {
        const removed = images[idx];
        if (removed.file && removed.preview.startsWith('blob:')) {
            URL.revokeObjectURL(removed.preview);
        }

        const next = images.filter((_, i) => i !== idx);

        if (!next.some(i => i.isCover) && next.length) {
            next[0] = { ...next[0], isCover: true };
        }

        onChange(next);
    };

    const setCover = (idx: number) => {
        onChange(
            images.map((img, i) => ({
                ...img,
                isCover: i === idx,
            })),
        );
    };

    return (
        <Box>
            <Button variant="outlined" component="label">
                {label || 'Upload hình'}
                <input
                    hidden
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) handleAddFiles(e.target.files);
                    }}
                />
            </Button>

            <Box
                mt={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 2,
                }}
            >
                {images.map((img, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: img.isCover
                                ? '2px solid #1976d2'
                                : '1px solid #ddd',
                        }}
                    >
                        <img
                            src={img.preview}
                            alt=""
                            style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                            }}
                        />

                        <Box
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                display: 'flex',
                                gap: 0.5,
                            }}
                        >
                            <Tooltip title="Xoá">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemove(idx)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                py: 0.5,
                            }}
                            onClick={() => setCover(idx)}
                        >
                            {img.isCover
                                ? <StarIcon fontSize="small" />
                                : <StarBorderIcon fontSize="small" />}
                            Ảnh chính
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
