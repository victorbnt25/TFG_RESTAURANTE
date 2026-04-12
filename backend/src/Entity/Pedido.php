<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\EstadoPedidoEnum;
use App\Repository\PedidoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PedidoRepository::class)]
#[ORM\Table(name: 'pedidos')]
#[ORM\Index(name: 'idx_pedidos_estado', columns: ['estado'])]
#[ORM\HasLifecycleCallbacks]
class Pedido
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'pedidos')]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Usuario $usuario = null;

    #[ORM\OneToOne(inversedBy: 'pedido', targetEntity: Reserva::class)]
    #[ORM\JoinColumn(name: 'reserva_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Reserva $reserva = null;

    #[ORM\Column(type: 'string', enumType: EstadoPedidoEnum::class)]
    private EstadoPedidoEnum $estado;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $total = '0.00';

    /** @var Collection<int, LineaPedido> */
    #[ORM\OneToMany(mappedBy: 'pedido', targetEntity: LineaPedido::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $lineas;

    /** @var Collection<int, Pago> */
    #[ORM\OneToMany(mappedBy: 'pedido', targetEntity: Pago::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $pagos;

    public function __construct()
    {
        $this->estado = EstadoPedidoEnum::ABIERTO;
        $this->lineas = new ArrayCollection();
        $this->pagos = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): self { $this->usuario = $usuario; return $this; }

    public function getReserva(): ?Reserva { return $this->reserva; }
    public function setReserva(?Reserva $reserva): self { $this->reserva = $reserva; return $this; }

    public function getEstado(): EstadoPedidoEnum { return $this->estado; }
    public function setEstado(EstadoPedidoEnum $estado): self { $this->estado = $estado; return $this; }

    public function getTotal(): string { return $this->total; }
    public function setTotal(string $total): self { $this->total = $total; return $this; }

    /** @return Collection<int, LineaPedido> */
    public function getLineas(): Collection { return $this->lineas; }

    public function addLinea(LineaPedido $linea): self
    {
        if (!$this->lineas->contains($linea)) {
            $this->lineas->add($linea);
            $linea->setPedido($this);
        }
        return $this;
    }

    public function removeLinea(LineaPedido $linea): self
    {
        if ($this->lineas->removeElement($linea)) {
            if ($linea->getPedido() === $this) {
                $linea->setPedido(null);
            }
        }
        return $this;
    }

    /** @return Collection<int, Pago> */
    public function getPagos(): Collection { return $this->pagos; }

    public function addPago(Pago $pago): self
    {
        if (!$this->pagos->contains($pago)) {
            $this->pagos->add($pago);
            $pago->setPedido($this);
        }
        return $this;
    }
}
