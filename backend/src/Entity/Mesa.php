<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\EstadoMesaEnum;
use App\Enum\ZonaMesaEnum;
use App\Repository\MesaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MesaRepository::class)]
#[ORM\Table(name: 'mesas')]
#[ORM\UniqueConstraint(name: 'uniq_mesas_codigo', columns: ['codigo'])]
#[ORM\HasLifecycleCallbacks]
class Mesa
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 10)]
    private string $codigo;

    #[ORM\Column(type: 'smallint')]
    private int $capacidad;

    #[ORM\Column(type: 'string', enumType: ZonaMesaEnum::class)]
    private ZonaMesaEnum $zona;

    #[ORM\Column(type: 'string', enumType: EstadoMesaEnum::class)]
    private EstadoMesaEnum $estado;

    #[ORM\Column(type: 'boolean')]
    private bool $activo = true;

    /** @var Collection<int, Reserva> */
    #[ORM\OneToMany(mappedBy: 'mesa', targetEntity: Reserva::class)]
    private Collection $reservas;

    public function __construct()
    {
        $this->reservas = new ArrayCollection();
        $this->zona = ZonaMesaEnum::SALA;
        $this->estado = EstadoMesaEnum::DISPONIBLE;
    }

    public function getId(): ?int { return $this->id; }

    public function getCodigo(): string { return $this->codigo; }
    public function setCodigo(string $codigo): self { $this->codigo = strtoupper(trim($codigo)); return $this; }

    public function getCapacidad(): int { return $this->capacidad; }
    public function setCapacidad(int $capacidad): self { $this->capacidad = $capacidad; return $this; }

    public function getZona(): ZonaMesaEnum { return $this->zona; }
    public function setZona(ZonaMesaEnum $zona): self { $this->zona = $zona; return $this; }

    public function getEstado(): EstadoMesaEnum { return $this->estado; }
    public function setEstado(EstadoMesaEnum $estado): self { $this->estado = $estado; return $this; }

    public function isActivo(): bool { return $this->activo; }
    public function setActivo(bool $activo): self { $this->activo = $activo; return $this; }

    /** @return Collection<int, Reserva> */
    public function getReservas(): Collection { return $this->reservas; }
}
