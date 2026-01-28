<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmPinRequest;
use App\Http\Requests\StoreReservationRequest;
use App\Models\Reservation;
use App\Services\PinService;
use App\Services\ReservationService;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;

class ReservationController extends Controller
{
    public function __construct(private PinService $pinService, private ReservationService $reservationService) {}

    public function index(): InertiaResponse
    {
        return inertia("reservations/index", collect([
            "message" => session("message")
        ])
            ->keyToCamel());
    }

    public function fetchReservationList(Request $req): Paginator
    {
        return Reservation::orderBy("reservation_time")
            ->orderBy("id")
            ->paginate($req->per_page);
    }

    public function create(): InertiaResponse
    {
        return inertia("reservations/create", collect([
            "pin" => session("pin")
        ])
            ->keyToCamel());
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $reservation = $this->reservationService->createReservation(
            $request->first_name,
            $request->last_name,
            $request->phone,
            $request->reservation_time
        );

        return back()->with(["pin" => $reservation->pin_code]);
    }

    public function confirmPin(ConfirmPinRequest $request): RedirectResponse
    {
        try {
            $this->pinService->confirmPin($request->reservation);

            return back()->with("message", "Reservation confirmed.");
        } catch (Exception $e) {
            return back()->withErrors($e->getMessage());
        }
    }
}
