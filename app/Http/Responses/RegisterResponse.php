<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): mixed
    {
        $user = $request->user();

        $route = match (true) {
            $user->hasRole('admin') => route('admin.dashboard'),
            $user->hasRole('hotel manager') => route('hotel-manager.dashboard'),
            $user->hasRole('ferry operator') => route('ferry-operator.dashboard'),
            default => route('visitor.dashboard'),
        };

        return redirect($route);
    }
}
