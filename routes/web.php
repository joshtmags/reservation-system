<?php

use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::prefix("/")->group(function () {
    Route::get("/", [ReservationController::class, "index"])->name("reservations");
    Route::get("/list", [ReservationController::class, "fetchReservationList"])->name("reservations.list");

    Route::get("/create", [ReservationController::class, "create"])->name("reservations.create");
    Route::post("/", [ReservationController::class, "store"])->name("reservations.store");

    Route::post("/confirm", [ReservationController::class, "confirmPin"])->name("reservations.pin-confirm");
});

require __DIR__ . "/settings.php";
