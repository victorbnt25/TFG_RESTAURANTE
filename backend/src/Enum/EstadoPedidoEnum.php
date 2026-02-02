<?php

namespace App\Enum;

enum EstadoPedidoEnum: string
{
    case ABIERTO = 'ABIERTO';
    case EN_PREPARACION = 'EN_PREPARACION';
    case SERVIDO = 'SERVIDO';
    case CERRADO = 'CERRADO';
    case CANCELADO = 'CANCELADO';
}
