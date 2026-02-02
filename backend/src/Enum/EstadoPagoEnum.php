<?php

namespace App\Enum;

enum EstadoPagoEnum: string
{
    case PENDIENTE = 'PENDIENTE';
    case PAGADO = 'PAGADO';
    case RECHAZADO = 'RECHAZADO';
    case DEVUELTO = 'DEVUELTO';
}
