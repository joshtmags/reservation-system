import { Head, useForm } from "@inertiajs/react";
import { get } from "lodash";
import { useState } from "react";
import ReservationController from "@/actions/App/Http/Controllers/ReservationController";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useClipboard } from "@/hooks/use-clipboard";
import AppSidebarLayout from "@/layouts/app/app-sidebar-layout";

const CreateReservation = () => {
    const [pin, setPin] = useState<string | null>(null);
    const [copiedText, copy] = useClipboard();

    const form = useForm({
        firstName: "",
        lastName: "",
        phone: "",
        reservationTime: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(ReservationController.store.url(), {
            onSuccess: (res) => {
                const generatedPin = get(res, "props.pin") as string;
                setPin(generatedPin);
                form.reset();
            },
            onError: () => {
                //
            },
        });
    };

    const handleCopyPin = async () => {
        if (pin) {
            await copy(pin);
        }
    };

    return (
        <AppSidebarLayout
            breadcrumbs={[
                {
                    title: "Reservations",
                    href: ReservationController.index.url(),
                },
                { title: "Create", href: ReservationController.create.url() },
            ]}
        >
            <Head title="Create Reservation" />

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground">
                        Create Reservation
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Fill in your details to make a new reservation
                    </p>
                </div>

                {pin ? (
                    <div className="space-y-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-8 shadow-lg dark:border-green-900 dark:from-green-950 dark:to-green-900/30">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/40">
                                <svg
                                    className="size-6 text-green-600 dark:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                                    Reservation Created!
                                </h3>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-200">
                                    Your reservation has been successfully
                                    created
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-green-200 pt-6 dark:border-green-900">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Save your PIN code below. You'll need it to
                                confirm your reservation at the scheduled time.
                            </p>

                            <div className="mt-6 space-y-3">
                                <label className="block text-sm font-semibold text-green-900 dark:text-green-100">
                                    Your PIN Code
                                </label>
                                <div className="flex gap-3">
                                    <div className="flex-1 rounded-xl border-2 border-dashed border-green-400 bg-white px-6 py-4 font-mono text-4xl font-bold tracking-widest text-green-600 shadow-sm dark:border-green-600 dark:bg-black dark:text-green-400">
                                        {pin}
                                    </div>
                                    <Button
                                        onClick={handleCopyPin}
                                        variant="default"
                                        className="shrink-0"
                                        size="lg"
                                    >
                                        {copiedText ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="size-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Copied
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="size-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v1h2V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v1H6a1 1 0 000 2h.05l1.403 12.894a2 2 0 001.984 1.788h5.134a2 2 0 001.984-1.788L17.95 7H18a1 1 0 000-2h-2V4zm4 2v1H8V5h4z" />
                                                </svg>
                                                Copy
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => setPin(null)}
                            variant="outline"
                            className="w-full border-green-300 dark:border-green-700"
                            size="lg"
                        >
                            Create Another Reservation
                        </Button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-xl border border-input bg-card p-8 shadow-md"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="firstName"
                                    className="text-sm font-semibold"
                                >
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    placeholder="John"
                                    value={form.data.firstName}
                                    onChange={(e) =>
                                        form.setData(
                                            "firstName",
                                            e.currentTarget.value,
                                        )
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={form.errors.firstName} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="lastName"
                                    className="text-sm font-semibold"
                                >
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    placeholder="Doe"
                                    value={form.data.lastName}
                                    onChange={(e) =>
                                        form.setData(
                                            "lastName",
                                            e.currentTarget.value,
                                        )
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={form.errors.lastName} />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-sm font-semibold"
                                >
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="+1 (555) 555-5555"
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData(
                                            "phone",
                                            e.currentTarget.value,
                                        )
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={form.errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="reservationTime"
                                    className="text-sm font-semibold"
                                >
                                    Reservation Time
                                </Label>
                                <Input
                                    id="reservationTime"
                                    name="reservationTime"
                                    type="datetime-local"
                                    required
                                    min={new Date().toISOString().slice(0, 16)}
                                    value={form.data.reservationTime}
                                    onChange={(e) =>
                                        form.setData(
                                            "reservationTime",
                                            e.currentTarget.value,
                                        )
                                    }
                                    className="rounded-lg"
                                />
                                <InputError
                                    message={form.errors.reservationTime}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={form.processing}
                        >
                            {form.processing && <Spinner />}
                            {form.processing
                                ? "Creating Reservation..."
                                : "Create Reservation"}
                        </Button>
                    </form>
                )}
            </div>
        </AppSidebarLayout>
    );
};

export default CreateReservation;
