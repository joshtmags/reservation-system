<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupExpiredReservation extends Command
{
    protected $signature = "cleanup-reservation";

    protected $description = "Cleanup/archived expired reservation";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}
