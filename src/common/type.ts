import { CollaboratorType, CommissionStatus, FieldCooperation, RentalAmenity, RentalType, UserRole } from "./enum";

// ---------------------    COMMON    --------------------- //
export type Option = {
    label: string;
    value: string;
};

export type Ward = {
    Id: string;
    Name: string;
    Level: string;
};

export type District = {
    Id: string;
    Name: string;
    Wards: Ward[];
};

export type Province = {
    Id: string;
    Name: string;
    Districts: District[];
};





// ---------------------    AUTH    --------------------- //
export type LoginPayload = {
    phone: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        role: string;
    };
};


// ---------------------    USER    --------------------- //

export type User = {
    id?: string;
    name: string;
    phone: string;
    password?: string;
    cccd?: string;
    email?: string;
    link_facebook?: string;
    zalo?: string;
    role?: UserRole;
    note?: string;
    address?: string;
    active?: boolean;
}



// ---------------------    RENTAL    --------------------- //

export type Rental = {
    collaborator_id: string;
    title: string;
    rental_type: RentalType;
    province: string;
    district: string;
    ward: string;
    street: string;
    house_number: string;
    address_detail: string;
    address_detail_display: string;
    price: number;
    active: boolean;
    description?: string;
    commission_value: string;
    amenities?: RentalAmenity[];
};

export type RentalInput = {
    title: string;
    rental_type: RentalType;
    province: string;
    district: string;
    ward: string;
    street?: string;
    house_number?: string;

    address_detail: string;
    address_detail_display: string;

    commission_value: string; // 🔥 STRING (match entity)

    collaborator_id: string;

    price?: number;

    amenities?: RentalAmenity[];

    active: boolean;
    description?: string;

    rental_images?: UploadPreview[];   // 👉 chỉ dùng ở UI
    upload_ids?: string[];      // 👉 chỉ gửi backend

    cover_index?: number;
}


// ---------------------    ROOM    --------------------- //
export type RoomInput = {
    rental_id: string;
    collaborator_id: string;
    room_code: string;
    floor?: number;
    room_number?: string;
    price: number;
    area?: number;
    max_people?: number;
    status: string;
    room_images?: UploadPreview[];
    amenities?: RentalAmenity[];
}


export interface UploadPreview {
    file: File;
    preview: string;
    isCover: boolean;
}



// ---------------------    COLLABORATOR    --------------------- //

export type Collaborator = {
    id?: string;
    user: User;
    type: CollaboratorType;
    field_cooperation: FieldCooperation;
    active?: boolean;
};


export type CollaboratorInput = {
    user_id: string;
    field_cooperation: FieldCooperation;
    note?: string;
    active?: boolean;
};


// ---------------------    TENANT    --------------------- //
export type Tenant = {
    id: string;
    user_id: string;
    note?: string;
    created_at: string;

    user: {
        id: string;
        name: string;
        phone: string;
        email?: string;
        link_facebook?: string;
        active: boolean;
    };

    contracts?: any[];
};

export type TenantInput = {
    user_id: string;
    note?: string;
    active: boolean;
};






export type Commission = {
    id: string;
    amount: number;
    status: CommissionStatus;
    contractId?: string;
    saleId?: string;
    collaboratorId?: string;
}


export type TopicInput = {
    name: string;
    description: string;
    type: string;
};

export type CronJobInput = {
    job_type: string;
    description?: string;
    is_run_job: boolean;
}

export type CronJobUpdate = {
    is_run_job: boolean;
}

export type FacebookPageInput = {
    page_id: string;
    page_name: string;
    page_access_token: string;
    topic_id: string;
    facebook_id: string;
    active: boolean;
};

export type ThreadInput = {
    name: string;
    gmail: string;
    username: string;
    password: string;
    active: boolean;
}

export type Gmail = {
    id?: string;
    name: string;
    gmail: string;
    apppassword: string;
    active: boolean;
}

export type FacebookPageInputUpdate = Partial<FacebookPageInput>;

export type AffiliateInput = {
    comment_text: string;
    link_affiliate?: string;
    affiliate_category_id: string;
};

export type ShopeeInput = {
    code: string;
    name: string;
    link: string;
    video: string;
};

export type PinterestInput = {
    id?: string;
    gmail: string;
    password: string;
    name: string;
    pinterest_account_id: string;
    client_id: string;
    client_secret: string;
    active?: boolean;
    access_token?: string | null,
    refresh_token?: string | null,
    token_expiry?: string | null,
    board_id?: string | null,
}

export type AffiliateCategoryInput = {
    name: string;
    type: string;
}

export type AffiliateCategory = {
    id: string;
    name: string;
    type: string;
    topics: { id: string; name: string }[];
    createdAt: string;
};

export type AffiliateCategoryTopicInput = {
    topic_id: string;
    affiliate_category_ids: string[];
}

export type FacebookPageTokenUpdate = {
    client_id: string;
    client_secret: string;
    access_token: string;
    account_facebook: string;
    facebook_id: string;
}

export type YoutubeInput = {
    id?: string;
    gmail: string;
    name: string;
    youtube_channel_id: string;
    client_id: string;
    client_secret: string;
    access_token?: string | null;
    refresh_token?: string | null;
    token_expiry?: string | null;
    topic_id?: string;
    active?: boolean;
};

export type YoutubeUpdateToken = {
    code: string;
    id: string;
}

export type PinterestUpdateToken = {
    code: string;
    id: string;
}

export type LinkedInUpdateToken = {
    code: string;
    id: string;
}


export type AccountFacebook = {
    id?: string;
    gmail: string;
    facebook_id: string;
    name: string;
    active: boolean;
    have_app: boolean;
};

export type AccountLinkedin = {
    id?: string;
    linkedin_id: string;
    name: string;
    linkedin_profile_urn?: string;
    client_id: string;
    client_secret: string;
    redirect_uri?: string;
    access_token?: string;
    expires_at?: Date | null;
    gmail: string;
    active: boolean;
}

export type AppFacebook = {
    id?: string;
    account_facebook: string;
    app_name: string;
    client_id: string;
    client_secret: string;
    active: boolean;
    account?: AccountFacebook
};

export type StatusType = {
    value: string;
    label: string;
}

export type GroupFacebook = {
    id?: string;
    topic_id: string;
    group_id: string;
    name: string;
}

export type GroupFacebookInfo = {
    group_id: string;
    group_name: string;
}

export type GroupFacebookPayload = {
    topic_id: string;
    groups: GroupFacebookInfo[]
}

export type PageInfo = {
    page_id: string;
    page_name: string;
    page_access_token: string;
};

export type FacbookInfo = {
    name: string;
    page: PageInfo[];
};

export type PageAuthInfo = {
    page_id: string;
    page_access_token: string;
};

export type Topic = {
    id?: string;
    name: string;
    type: string;
    description: string;
    is_priority?: boolean;
};



export type Broker = {
    id?: string;
    name: string;
    link: string;
    avatar: string;
    area: string;
    email: string;
    phone: string;
    selling: string;
    active: boolean;
}

export type GenerateVideoProductTiktok = {
    product_tiktok_url: string;
}

export type OptionsYoutube = {
    language?: string;
    lengthSeconds?: number;
    style?: string;
}
export type GenerateVideoUrlYoutube = {
    url: string;
    options?: OptionsYoutube;
}

export type ProductTiktokUpdate = {
    img_url?: string;
    is_posted?: boolean;
};