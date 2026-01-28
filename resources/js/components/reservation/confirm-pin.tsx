import { useForm } from "@inertiajs/react";
import { get, isArray, isFunction } from "lodash";
import React from "react";
import ReservationController from "@/actions/App/Http/Controllers/ReservationController";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface ConfirmPinFormProps {
    submitCb: () => void;
}

const ConfirmPinForm = ({ submitCb }: ConfirmPinFormProps) => {
    const [successMessage, setSuccessMessage] = React.useState("");
    const pinForm = useForm({
        pinCode: "",
    });

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        pinForm.post(ReservationController.confirmPin.url(), {
            onSuccess: () => {
                setSuccessMessage("Reservation confirmed successfully!");
                pinForm.reset();

                setTimeout(() => setSuccessMessage(""), 3000);

                if (isFunction(submitCb)) {
                    submitCb();
                }
            },
            onError: (errors) => {
                if (isArray(errors)) {
                    pinForm.setError("pinCode", get(errors, "0"));
                }
            },
        });
    };

    return (
        <div className="rounded-lg border bg-card p-4">
            {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {successMessage}
                </div>
            )}
            <h3 className="mb-4 text-sm font-medium text-card-foreground">
                Confirm Reservation with PIN
            </h3>
            <form onSubmit={handlePinSubmit} className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="pin" className="sr-only">
                        PIN Code
                    </Label>
                    <Input
                        id="pin"
                        type="text"
                        placeholder="Enter PIN code"
                        value={pinForm.data.pinCode}
                        onChange={(e) =>
                            pinForm.setData("pinCode", e.target.value)
                        }
                        disabled={pinForm.processing}
                        maxLength={6}
                    />
                    <InputError message={pinForm.errors.pinCode} />
                </div>
                <Button
                    type="submit"
                    disabled={pinForm.processing || !pinForm.data.pinCode}
                >
                    {pinForm.processing ? (
                        <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Confirming...
                        </>
                    ) : (
                        "Confirm"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ConfirmPinForm;
