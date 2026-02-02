<?php

namespace App\Enum;

enum RolUsuarioEnum: string
{
    case CLIENTE = 'CLIENTE';
    case PERSONAL = 'PERSONAL';
    case ADMIN = 'ADMIN';
}
