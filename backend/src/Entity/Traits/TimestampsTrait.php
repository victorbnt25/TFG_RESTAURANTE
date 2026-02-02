<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait TimestampsTrait
{
    #[ORM\Column(name: 'creado_en', type: 'datetime_immutable')]
    private \DateTimeImmutable $creadoEn;

    #[ORM\Column(name: 'actualizado_en', type: 'datetime_immutable')]
    private \DateTimeImmutable $actualizadoEn;

    #[ORM\PrePersist]
    public function alCrear(): void
    {
        $ahora = new \DateTimeImmutable();
        $this->creadoEn = $ahora;
        $this->actualizadoEn = $ahora;
    }

    #[ORM\PreUpdate]
    public function alActualizar(): void
    {
        $this->actualizadoEn = new \DateTimeImmutable();
    }

    public function getCreadoEn(): \DateTimeImmutable
    {
        return $this->creadoEn;
    }

    public function getActualizadoEn(): \DateTimeImmutable
    {
        return $this->actualizadoEn;
    }
}
