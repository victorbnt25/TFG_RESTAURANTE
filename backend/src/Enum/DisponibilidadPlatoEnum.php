<?php

namespace App\Enum;

enum DisponibilidadPlatoEnum: string
{
    case DISPONIBLE = 'DISPONIBLE';
    case AGOTADO = 'AGOTADO';
    case OCULTO = 'OCULTO';
}
