<?php

namespace App\Enum;

enum TipoPlatoEnum: string
{
    case ENTRANTE = 'ENTRANTE';
    case PRINCIPAL = 'PRINCIPAL';
    case POSTRE = 'POSTRE';
    case BEBIDA = 'BEBIDA';
    case MENU = 'MENU';
    case EXTRA = 'EXTRA';
    case GUARNICION = 'GUARNICION';
}
