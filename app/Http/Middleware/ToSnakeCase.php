<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ToSnakeCase
{
    public function handle(Request $request, Closure $next)
    {
        $request->replace($this->convertDimensionKeyToSnake($request->all()));

        return $next($request);
    }

    private function convertDimensionKeyToSnake(array $parameters): array
    {
        $new_payload = [];

        foreach ($parameters as $key => $value) {
            $new_payload[Str::snake($key)] = is_array($value)
                ? $this->convertDimensionKeyToSnake($value)
                : $value;
        }

        return $new_payload;
    }
}
