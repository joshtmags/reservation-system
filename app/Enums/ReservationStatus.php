<?php

namespace App\Enums;

use App\Traits\EnumValues;

enum ReservationStatus: string
{
    use EnumValues;

    case InActive = "inactive";
    case Active = "active";
    case Extended = "extended";
    case Expired = "expired";
    case Confirmed = "confirmed";

    public function statusBag(): string
    {
        return match ($this) {
            self::InActive => "Pin is not yet active",
            self::Active => "Reservation is now active",
            self::Extended => "Reservation is extended.",
            self::Expired => "Reservation is expired.",
            self::Confirmed => "Reservation is confirmed.",
        };
    }
}
