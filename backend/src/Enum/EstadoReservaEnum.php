<?php

namespace App\Enum;

enum EstadoReservaEnum: string
{
    case PENDIENTE = 'PENDIENTE';
    case CONFIRMADA = 'CONFIRMADA';
    case CANCELADA = 'CANCELADA';
    case COMPLETADA = 'COMPLETADA';
    case NO_SHOW = 'NO_SHOW';
}
