<?php

namespace App\Enum;

enum EstadoPedidoEnum: string
{
    case PENDIENTE = 'PENDIENTE';
    case PAGADO = 'PAGADO';
    case ENTREGADO = 'ENTREGADO';
    case CANCELADO = 'CANCELADO';
}