import type { TableMetaInterface } from "@/types";

export const TableMetaData: TableMetaInterface = {
    currentPage: 1,
    data: [],
    firstPageUrl: "",
    from: 0,
    lastPage: 0,
    lastPageUrl: "",
    links: [],
    nextPageUrl: "",
    path: "",
    perPage: 0,
    prevPageUrl: "",
    to: 0,
    total: 0,
};

export const DateTimeFormat: string = "MM-DD-YYYY hh:mm A";
export const DateFormat: string = "YYYY-MM-DD";

export const PageSize = 10;
