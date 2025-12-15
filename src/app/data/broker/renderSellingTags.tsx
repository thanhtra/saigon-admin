import { Box } from "@mui/material";
import React from "react";

// 🎨 Bảng màu cố định theo từng loại lĩnh vực
const SELLING_COLORS: Record<string, string> = {
    "bán nhà phố dự án": "#1976d2", // xanh dương
    "bán biệt thự": "#9c27b0", // tím
    "bán căn hộ cao cấp": "#e91e63", // hồng
    "bán căn hộ chung cư": "#ff9800", // cam
    "bán đất thổ cư": "#4caf50", // xanh lá
    "bán đất nền dự án": "#009688", // xanh ngọc
    "bán văn phòng": "#3f51b5", // xanh lam
    "căn hộ cao cấp": "#f57c00",
    "căn hộ chung cư": "#ff5722",
    "nhà phố": "#8bc34a",
    "văn phòng": "#00bcd4",
    "mặt bằng": "#795548",
    "bán nhà mặt bằng": "#ff7043",
};

export function renderSellingTags(selling: string[] | string | null | undefined) {
    if (!selling) return null;

    const items = Array.isArray(selling)
        ? selling
        : selling.split(",").map((s) => s.trim()).filter(Boolean);

    return (
        <>
            {items.map((text, idx) => {
                const lower = text.toLowerCase();
                const color = SELLING_COLORS[lower] || "#607d8b"; // màu mặc định xám xanh

                return (
                    <Box
                        key={idx}
                        component="span"
                        sx={{
                            display: "inline-block",
                            backgroundColor: color,
                            color: "#fff",
                            borderRadius: "12px",
                            padding: "2px 8px",
                            fontSize: "12px",
                            marginRight: "6px",
                            marginBottom: "6px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {text}
                    </Box>
                );
            })}
        </>
    );
}
