<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\CanalReservaEnum;
use App\Enum\EstadoReservaEnum;
use App\Enum\TurnoServicioEnum;
use App\Repository\ReservaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReservaRepository::class)]
#[ORM\Table(name: 'reservas')]
#[ORM\Index(name: 'idx_reservas_fecha', columns: ['fecha_hora_reserva'])]
#[ORM\HasLifecycleCallbacks]
class Reserva
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'reservas')]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'reservas')]
    #[ORM\JoinColumn(name: 'mesa_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    private ?Mesa $mesa = null;

    #[ORM\Column(name: 'fecha_hora_reserva', type: 'datetime_immutable')]
    private \DateTimeImmutable $fechaHoraReserva;

    #[ORM\Column(name: 'numero_personas', type: 'smallint')]
    private int $numeroPersonas;

    #[ORM\Column(type: 'string', enumType: EstadoReservaEnum::class)]
    private EstadoReservaEnum $estado;

    #[ORM\Column(type: 'string', enumType: TurnoServicioEnum::class, nullable: true)]
    private ?TurnoServicioEnum $turno = null;

    #[ORM\Column(type: 'string', enumType: CanalReservaEnum::class)]
    private CanalReservaEnum $canal;

    #[ORM\Column(type: 'string', length: 500, nullable: true)]
    private ?string $observaciones = null;

    #[ORM\OneToOne(mappedBy: 'reserva', targetEntity: Pedido::class)]
    private ?Pedido $pedido = null;

    public function __construct()
    {
        $this->estado = EstadoReservaEnum::PENDIENTE;
        $this->canal = CanalReservaEnum::WEB;
    }

    public function getId(): ?int { return $this->id; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): self { $this->usuario = $usuario; return $this; }

    public function getMesa(): ?Mesa { return $this->mesa; }
    public function setMesa(?Mesa $mesa): self { $this->mesa = $mesa; return $this; }

    public function getFechaHoraReserva(): \DateTimeImmutable { return $this->fechaHoraReserva; }
    public function setFechaHoraReserva(\DateTimeImmutable $fechaHora): self { $this->fechaHoraReserva = $fechaHora; return $this; }

    public function getNumeroPersonas(): int { return $this->numeroPersonas; }
    public function setNumeroPersonas(int $n): self { $this->numeroPersonas = $n; return $this; }

    public function getEstado(): EstadoReservaEnum { return $this->estado; }
    public function setEstado(EstadoReservaEnum $estado): self { $this->estado = $estado; return $this; }

    public function getTurno(): ?TurnoServicioEnum { return $this->turno; }
    public function setTurno(?TurnoServicioEnum $turno): self { $this->turno = $turno; return $this; }

    public function getCanal(): CanalReservaEnum { return $this->canal; }
    public function setCanal(CanalReservaEnum $canal): self { $this->canal = $canal; return $this; }

    public function getObservaciones(): ?string { return $this->observaciones; }
    public function setObservaciones(?string $obs): self { $this->observaciones = $obs; return $this; }

    public function getPedido(): ?Pedido { return $this->pedido; }
}
