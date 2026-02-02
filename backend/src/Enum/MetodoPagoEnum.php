<?php

namespace App\Enum;

enum MetodoPagoEnum: string
{
    case EFECTIVO = 'EFECTIVO';
    case TARJETA = 'TARJETA';
    case BIZUM = 'BIZUM';
    case ONLINE = 'ONLINE';
}
