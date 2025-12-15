'use client';

import { BackLink } from '@/styles/common';
import React from 'react';

type Props = {
    href: string;
    label?: string;
};

const BackToList: React.FC<Props> = ({ href, label = 'Trở về danh sách' }) => {
    return (
        <BackLink href={href}>
            <span className="mr-1">←</span> {label}
        </BackLink>
    );
};

export default BackToList;
