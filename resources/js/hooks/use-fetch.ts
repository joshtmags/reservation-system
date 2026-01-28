import axios from "axios";
import type { SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import { PageSize, TableMetaData } from "@/lib/constants/app";
import type { TableMetaInterface } from "@/types";

interface ApiResponse {
    status: number;
    data: TableMetaInterface;
}

interface fetchProps {
    apiRoute: (
        params: Record<string, string | number | boolean>,
    ) => Promise<ApiResponse>;
    passedParams?: Record<string, string | number | boolean>;
    defaultPerPage?: number;
    postFetchCb?: (data: SetStateAction<TableMetaInterface>) => void;
    withArguments?: boolean;
    setFetching?: (val: boolean) => void;
}

const useAsyncDataFetch = ({
    apiRoute,
    passedParams = {},
    defaultPerPage = PageSize,
    postFetchCb,
}: fetchProps) => {
    const [dataset, setDataset] = useState<TableMetaInterface>(TableMetaData);
    const [currentFilters, setCurrentFilters] = useState({});
    const [fetching, setFetching] = useState(false);
    const [perPage, setPerPage] = useState(defaultPerPage);
    const [page, setPage] = useState(1);
    const handlePageChange = (page: number) => setPage(page);

    const handleLinkPageChange = async (link: string | null) => {
        if (link) {
            setFetching(true);
            const res = await axios.get(link);
            setFetching(false);

            if (res && res.status === 200) {
                setDataset(res.data);
            }
        }
    };

    const handlePerPageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPerPage(Number(event.target.value));
        setPage(1);
    };

    const fetch = useCallback(async () => {
        setFetching(true);

        const queryParams = {
            ...passedParams,
            ...currentFilters,
            perPage,
            page,
        };

        const res = await apiRoute(queryParams);

        if (res && res.status === 200) {
            setDataset(res.data);

            postFetchCb?.(res.data);
        }

        setFetching(false);
    }, [apiRoute, passedParams, currentFilters, perPage, page, postFetchCb]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const refresh = () => fetch();

    return {
        perPage,
        currentFilters,
        dataset,
        fetching,
        handlePageChange,
        handlePerPageChange,
        refresh,
        setCurrentFilters,
        fetch,
        page,
        setFetching,
        handleLinkPageChange,
    };
};

export default useAsyncDataFetch;
