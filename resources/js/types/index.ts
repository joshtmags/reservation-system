export type * from "./auth";
export type * from "./navigation";
export type * from "./ui";

import type { Auth } from "./auth";

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface TableMetaInterface {
    currentPage: number;
    data: T[];
    firstPageUrl: string | null;
    from: number;
    lastPage?: number;
    lastPageUrl: string | null;
    links: Record<string, boolean | string | null>[];
    nextPageUrl: string | null;
    path: string | null;
    perPage: number;
    prevPageUrl: string;
    to: number;
    total: number;
}
