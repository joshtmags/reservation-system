<?php

namespace App\Services;

use App\Models\Reservation;
use Carbon\Carbon;

class ReservationService
{
    public function __construct(private PinService $pinService) {}

    /**
     * Create a reservation with validated data
     * 
     * @param string $first_name
     * @param string $last_name
     * @param string $phone
     * @param string $reservation_time datetime string
     * @return Reservation
     */
    public function createReservation(
        string $first_name,
        string $last_name,
        string $phone,
        string $reservation_time
    ): Reservation {
        $reservation_time = Carbon::parse($reservation_time);
        $pin = $this->pinService->generate();

        $pin_window = $this->pinService->calculateWindow($reservation_time);

        return Reservation::create([
            "first_name" => $first_name,
            "last_name" => $last_name,
            "phone" => $phone,
            "reservation_time" => $reservation_time,
            "pin_active_from" => $pin_window["from"],
            "pin_active_until" => $pin_window["until"],
            "extended_at" => $pin_window["is_extended"] ? now() : null,
            "pin_code" => $pin,
        ]);
    }
}
