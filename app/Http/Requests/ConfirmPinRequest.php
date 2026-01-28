<?php

namespace App\Http\Requests;

use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;

class ConfirmPinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "pin_code" => [
                "bail",
                "required",
                "string",
                function ($attr, $val, $fail) {
                    $now = now();
                    $reservation = Reservation::where("pin_code", $val)
                        ->first();

                    if (!$reservation) {
                        $fail("PIN not found.");
                    }

                    if ($reservation && $reservation->isConfirmed()) {
                        $fail("PIN is already confirmed.");
                    }

                    if ($reservation && $now->gt($reservation->pin_active_until)) {
                        $fail("PIN is already expired.");
                    }

                    $this->merge([
                        "reservation" => $reservation,
                    ]);
                },
            ],
        ];
    }
}
