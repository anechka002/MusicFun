// export type Attachment = {
//     id: string;
//     addedAt: string;
//     updatedAt: string;
//     version: number;
//     url: string;
//     contentType: string;
//     originalName: string;
//     fileSize: number;
// };

// export type Image = {
//     type: "original" | "thumbnail" | "medium";
//     width: number;
//     height: number;
//     fileSize: number;
//     url: string;
// };

// export type TrackUser = {
//     id: string;
//     name: string;
// };

// export type TrackAttributes = {
//     title: string;
//     user: TrackUser;
//     addedAt: string;
//     attachments: Attachment[];
//     images: {
//         main: Image[];
//     };
//     currentUserReaction: 0 | 1 | -1;
//     publishedAt: string;
//     likesCount: number;
//     isPublished: boolean;
// };

// export type TrackRelationships = {
//     artists: {
//         data: {
//             id: string;
//             type: "artists";
//         }[];
//     };
// };

// export type TrackDataItem = {
//     id: string;
//     type: "tracks";
//     attributes: TrackAttributes;
//     relationships: TrackRelationships;
// };

// export type ArtistAttributes = {
//     name: string;
// };

// export type ArtistIncludedItem = {
//     id: string;
//     type: "artists";
//     attributes: ArtistAttributes;
// };

// export type Meta = {
//     page: number;
//     pageSize: number;
//     totalCount: number;
//     pagesCount: number;
//     nextCursor: string | null;
// };

// export type TracksResponse = {
//     data: TrackDataItem[];
//     included: ArtistIncludedItem[];
//     meta: Meta;
// };


export type Attachment = {
    id: string;
    addedAt: string;
    updatedAt: string;
    version: number;
    url: string;
    contentType: string;
    originalName: string;
    fileSize: number;
};

export type Image = {
    type: "original" | "thumbnail" | "medium";
    width: number;
    height: number;
    fileSize: number;
    url: string;
};

export type TrackUser = {
    id: string;
    name: string;
};

export type TrackAttributes = {
    title: string;
    user: TrackUser;
    addedAt: string;
    attachments: Attachment[];
    images: {
        main: Image[];
    };
    currentUserReaction: 0 | 1 | -1;
    publishedAt: string;
    likesCount: number;
    isPublished: boolean;
};

export type TrackRelationships = {
    artists: {
        data: {
            id: string;
            type: "artists";
        }[];
    };
};

export type TrackDataItem = {
    id: string;
    type: "tracks";
    attributes: TrackAttributes;
    relationships: TrackRelationships;
};

export type ArtistAttributes = {
    name: string;
};

export type ArtistIncludedItem = {
    id: string;
    type: "artists";
    attributes: ArtistAttributes;
};

export type Meta = {
    page: number;
    pageSize: number;
    totalCount: number;
    pagesCount: number;
    nextCursor: string | null;
};

export type TracksResponse = {
    data: TrackDataItem[];
    included: ArtistIncludedItem[];
    meta: Meta;
};


export type TrackTag = {
    id: string;
    name: string;
};

export type TrackArtist = {
    id: string;
    name: string;
};

export type TrackAttributesFull = TrackAttributes & {
    lyrics: string;
    releaseDate: string;
    updatedAt: string;
    duration: number;
    tags: TrackTag[];
    artists: TrackArtist[];
};

export type TrackDataItemFull = {
    id: string;
    type: "tracks";
    attributes: TrackAttributesFull;
};

export type TrackResponse = {
    data: TrackDataItemFull;
};
