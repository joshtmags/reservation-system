import type {
    ColumnDef,
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
    VisibilityState} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PageSize } from "@/lib/constants/app"
import type { TableMetaInterface } from "@/types"

interface DataTableProps<TData, TValue> {
    fetching: boolean;
    dataset: TableMetaInterface;
    columns: ColumnDef<TData, TValue>[];
    pageSize?: number;
    filterPlaceholder?: string;
    filterColumnId?: string;
    handleLinkPageChange?: (link: string | null) => void;
    handlePageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
    fetching,
    dataset,
    columns,
    pageSize = PageSize,
    filterPlaceholder = "Filter...",
    filterColumnId,
    handleLinkPageChange,
    handlePageChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    )
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const appendFiltersToUrl = (url: string | null): string | null => {
        if (!url) return null;

        const urlObj = new URL(url);
        const searchParams = urlObj.searchParams;

        // Add perPage parameter
        if (pageSize) {
            searchParams.set("perPage", pageSize.toString());
        }

        return urlObj.toString();
    };

    const table = useReactTable({
        data: dataset.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        rowCount: dataset.total,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    })

    return (
        <div className="space-y-4 text-foreground">
            {filterColumnId && (
                <div className="flex items-center p-4">
                    <Input
                        placeholder={filterPlaceholder}
                        value={
                            (table
                                .getColumn(filterColumnId)
                                ?.getFilterValue() as string) || ""
                        }
                        onChange={(event) =>{
                            table
                                .getColumn(filterColumnId)
                                ?.setFilterValue(event.target.value);
                        }}
                        className="max-w-sm bg-background text-foreground"
                        disabled={fetching}
                    />
                </div>
            )}
            <div className="relative rounded-md border">
                {fetching && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="h-8 w-8" />
                            <p className="text-sm text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-card rounded-b-2xl border-t p-4" data-slot="pagination-footer">
                <div className="flex items-center justify-between gap-2" data-slot="pagination-controls">
                    <div className="text-muted-foreground flex-1 text-sm" data-slot="pagination-info">
                    </div>
                    <div className="flex items-center gap-2" data-slot="pagination-buttons">
                        <div className="flex items-center gap-1" data-slot="page-buttons">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (handleLinkPageChange) {
                                        handleLinkPageChange(appendFiltersToUrl(dataset.prevPageUrl));
                                    }
                                    table.previousPage();
                                }}
                                disabled={!table.getCanPreviousPage() || fetching}
                            >
                                Previous
                            </Button>

                            {/* Page number buttons */}
                            {(() => {
                                const currentPage = table.getState().pagination.pageIndex + 1;
                                const totalPages = table.getPageCount();
                                const pages = [];

                                // Show first page
                                if (currentPage > 3) {
                                    pages.push(1);
                                    if (currentPage > 4) {
                                        pages.push("...");
                                    }
                                }

                                // Show pages around current page
                                for (
                                    let i = Math.max(1, currentPage - 1);
                                    i <= Math.min(totalPages, currentPage + 1);
                                    i++
                                ) {
                                    pages.push(i);
                                }

                                // Show last page
                                if (currentPage < totalPages - 2) {
                                    if (currentPage < totalPages - 3) {
                                        pages.push("...");
                                    }
                                    pages.push(totalPages);
                                }

                                return pages.map((page, index) => {
                                    if (page === "...") {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="text-muted-foreground px-2 text-sm"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    const pageNumber = page as number;
                                    const isCurrentPage = pageNumber === currentPage;

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={isCurrentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                if (handlePageChange) {
                                                    handlePageChange(pageNumber);
                                                }

                                                table.setPageIndex(pageNumber - 1);
                                            }}
                                            className="min-w-[32px]"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                });
                            })()}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (handleLinkPageChange) {
                                        handleLinkPageChange(appendFiltersToUrl(dataset.nextPageUrl));
                                    }
                                    table.nextPage();
                                }}
                                disabled={!table.getCanNextPage() || fetching}
                            >
                                Next
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-sm" data-slot="page-info">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
