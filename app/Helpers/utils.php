<?php

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

if (!function_exists("convertDimensionKeyToCamel")) {
    function convertDimensionKeyToCamel(array|Collection|EloquentCollection $parameters): array
    {
        $new_payload = [];

        if (!empty($parameters)) {
            foreach ($parameters as $key => $value) {
                $new_payload[Str::camel($key)] = is_array($value)
                    || is_a($value, "Illuminate\Support\Collection")
                    ? convertDimensionKeyToCamel($value)
                    : $value;
            }
        }

        return $new_payload;
    }
}
