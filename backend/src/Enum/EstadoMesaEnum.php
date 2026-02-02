<?php

namespace App\Enum;

enum EstadoMesaEnum: string
{
    case DISPONIBLE = 'DISPONIBLE';
    case RESERVADA = 'RESERVADA';
    case OCUPADA = 'OCUPADA';
    case FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO';
}
