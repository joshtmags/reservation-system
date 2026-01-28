<?php

namespace App\Traits;

trait GeneratesPinCode
{
    /**
     * Generate a 4 digit unique PIN code
     * Increases length until unique
     * 
     * @return string
     */
    public static function generateUniquePinCode($model): string
    {
        $min_length = 4;
        $max_length = 8;

        for ($length = $min_length; $length <= $max_length; $length++) {
            $pin = self::generatePinOfLength($length);

            if (!$model::where("pin_code", $pin)->exists()) {
                return $pin;
            }
        }

        return (string) substr(str_shuffle(strval(time())), 0, $max_length);
    }

    /**
     * Generate a random PIN of specific length
     * 
     * @param int $length
     * @return string
     */
    private static function generatePinOfLength(int $length): string
    {
        $min = (int) str_pad("1", $length, "0");
        $max = (int) str_pad("9", $length, "9");

        return str_pad((string) random_int($min, $max), $length, "0", STR_PAD_LEFT);
    }
}
