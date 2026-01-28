<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ToCamelCase
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $content = json_decode($response->content(), true);

            if ($request->hasHeader("X-VueTable") && array_key_exists("data", $content)) {
                $content["data"] = convertDimensionKeyToCamel($content["data"]);
                $formatted_content = $content;
            } else {
                $formatted_content = convertDimensionKeyToCamel($content);
            }

            $response->setContent(json_encode($formatted_content));
        }

        return $response;
    }
}
