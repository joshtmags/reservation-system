import { Head, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { debounce, get } from "lodash";
import Countdown from "react-countdown";
import ReservationController from "@/actions/App/Http/Controllers/ReservationController";
import ConfirmPinForm from "@/components/reservation/confirm-pin";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/datatable";
import useAsyncDataFetch from "@/hooks/use-fetch";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";
dayjs.extend(utc);

const ReservationStatus = Object.freeze({
    InActive: "inactive",
    Active: "active",
    Extended: "extended",
    Expired: "expired",
    Confirmed: "confirmed",
});

interface Reservation {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    reservationTime: string;
    confirmedAt?: string | null;
    createdAt: string;
    status?: string;
    pinActiveUntil?: string | null;
}

const statusLabels = {
    inactive: "Inactive",
    active: "Active",
    extended: "Extended",
    expired: "Expired",
    confirmed: "Confirmed",
};

const statusColorVariants: Record<string, string> = {
    inactive: "text-gray-800 bg-gray-50 dark:text-gray-300 dark:bg-gray-900",
    active: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900",
    extended:
        "text-yellow-800 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-900",
    expired: "text-gray-900 bg-gray-200 dark:text-gray-200 dark:bg-gray-800",
    confirmed:
        "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900",
};

const ListReservation = () => {
    const {
        dataset,
        handleLinkPageChange,
        handlePageChange,
        refresh,
        fetching,
    } = useAsyncDataFetch({
        apiRoute: (params = {}) =>
            axios.get(ReservationController.fetchReservationList.url(), {
                params,
            }),
    });

    const columns: ColumnDef<Reservation>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "reservationTime",
            header: "Reservation Time",
            cell: ({ row }) => {
                const date = new Date(row.getValue("reservationTime"));

                return date.toLocaleString();
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = get(row, "original.status", "");
                const isExtended = get(row, "original.extendedAt");

                return (
                    <>
                        <span
                            className={
                                get(
                                    statusColorVariants,
                                    status,
                                    "bg-gray-100 text-gray-200",
                                ) +
                                " mr-2 rounded px-2 py-1 text-xs font-semibold"
                            }
                        >
                            {get(statusLabels, status, status?.toUpperCase())}
                        </span>

                        {isExtended && status !== ReservationStatus.Expired && (
                            <span
                                className={
                                    "rounded bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                }
                            >
                                Extended
                            </span>
                        )}
                    </>
                );
            },
        },
        {
            accessorKey: "pinActiveUntil",
            header: "PIN Validity",
            cell: ({ row }) => {
                const until = row.original.pinActiveUntil;
                const confirmed = row.original.confirmedAt;
                if (!until) {
                    return <span className="text-muted-foreground">N/A</span>;
                }

                const unTouched =
                    !confirmed &&
                    row.original.status !== ReservationStatus.Expired;

                return (
                    unTouched && (
                        <Countdown
                            date={new Date(until)}
                            onComplete={() => {
                                debounce(refresh, 1000);
                            }}
                            renderer={({
                                hours,
                                minutes,
                                seconds,
                                completed,
                            }) =>
                                !completed && (
                                    <span className="text-gray-200">
                                        {hours > 0 && `${hours}:`}
                                        {minutes.toString().padStart(2, "0")}:
                                        {seconds.toString().padStart(2, "0")}
                                    </span>
                                )
                            }
                        />
                    )
                );
            },
        },
    ];

    return (
        <AppSidebarLayout
            breadcrumbs={[
                {
                    title: "Reservations",
                    href: ReservationController.index.url(),
                },
            ]}
        >
            <Head title="Reservations" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Reservations</h2>
                    <Button
                        onClick={() =>
                            router.visit(ReservationController.create.url())
                        }
                    >
                        Create Reservation
                    </Button>
                </div>

                <ConfirmPinForm submitCb={refresh} />

                <div className="rounded-lg border bg-card">
                    <DataTable
                        columns={columns}
                        dataset={dataset}
                        fetching={fetching}
                        pageSize={10}
                        filterPlaceholder="Filter by name..."
                        filterColumnId={"firstName"}
                        handleLinkPageChange={handleLinkPageChange}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default ListReservation;
