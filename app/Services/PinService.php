<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Traits\GeneratesPinCode;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Exception;

class PinService
{
    use GeneratesPinCode;

    private ReservationStatus $reservation_status;

    /**
     * Generate a unique PIN code
     * Uses the Reservation model's trait for generating short, unique PINs
     */
    public function generate(): string
    {
        return self::generateUniquePinCode(Reservation::class);
    }

    /**
     * Calculate the PIN window (valid time range) for a reservation
     * 
     * @param Carbon|CarbonImmutable $reservation_time
     * @return array{from: Carbon, until: Carbon, is_extended: boolean | null}
     */
    public function calculateWindow(Carbon|CarbonImmutable $reservation_time): array
    {
        $base_from = $reservation_time->copy()->subMinutes(15);
        $base_until = $reservation_time->copy();

        $window_start = $reservation_time->copy()->subMinutes(15);

        $ahead_count = Reservation::where("reservation_time", "<=", $reservation_time)
            ->where("reservation_time", ">=", $window_start)
            ->count();

        $delay_minutes = $ahead_count  * 3;  //.. [3] minutes per head window extension

        return [
            "from" => $base_from,
            "until" => $base_until->addMinutes($delay_minutes),
            "is_extended" => $ahead_count > 0,
        ];
    }

    /**
     * Get the current status of a PIN for a reservation
     * 
     * @param Reservation $reservation
     * @return ReservationStatus
     */
    public function getStatus(Reservation $reservation): ReservationStatus
    {
        if ($reservation->confirmed_at) {
            return ReservationStatus::Confirmed;
        }

        $now = now();
        $is_active = $now->between($reservation->pin_active_from, $reservation->pin_active_until);

        return match (true) {
            $is_active => ReservationStatus::Active,
            $now->gt($reservation->pin_active_until) => ReservationStatus::Expired,
            default => ReservationStatus::InActive,
        };
    }

    /**
     * Check if a PIN is currently valid for use
     */
    public function isValid(Reservation $reservation): bool
    {
        $this->reservation_status = $this->getStatus($reservation);

        return $this->reservation_status->is(ReservationStatus::Active);
    }

    /**
     * Check if a PIN is expired
     */
    public function isExpired(Reservation $reservation): bool
    {
        return $this->getStatus($reservation)->is(ReservationStatus::Expired);
    }

    /**
     * Check if a PIN is confirmed
     */
    public function isConfirmed(Reservation $reservation): bool
    {
        return $this->getStatus($reservation)->is(ReservationStatus::Confirmed);
    }

    /**
     * Confirm pin validity and check validation
     */
    public function confirmPin(Reservation $reservation): void
    {
        throw_if(
            !$this->isValid($reservation),
            Exception::class,
            $this->reservation_status->statusBag()
        );

        $now = now();

        $reservation->update([
            "confirmed_at" => $now,
            "processed_at" => $now,
        ]);
    }
}
