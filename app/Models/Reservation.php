<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        "first_name",
        "last_name",
        "phone",
        "reservation_time",
        "pin_code",
        "pin_active_from",
        "pin_active_until",
        "confirmed_at",
        "extended_at",
        "processed_at",
    ];

    protected $casts = [
        "reservation_time" => "datetime",
        "pin_active_from" => "datetime",
        "pin_active_until" => "datetime",
        "confirmed_at" => "datetime",
        "extended_at" => "datetime",
        "processed_at" => "datetime",
    ];

    protected $appends = [
        "status",
    ];

    public function getStatusAttribute(): ReservationStatus
    {
        return match (true) {
            !is_null($this->confirmed_at) => ReservationStatus::Confirmed,
            $this->isActive() => ReservationStatus::Active,
            $this->isExpired() => ReservationStatus::Expired,
            default => ReservationStatus::InActive,
        };
    }

    public function isActive(): bool
    {
        $now = now();

        return is_null($this->confirmed_at)
            && $now->between($this->pin_active_from, $this->pin_active_until);
    }

    public function isConfirmed(): bool
    {
        return !!$this->confirmed_at;
    }

    public function isExpired(): bool
    {
        return !$this->isConfirmed() && now()->greaterThan($this->pin_active_until);
    }
}
