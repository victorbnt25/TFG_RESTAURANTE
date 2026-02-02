<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\EstadoPagoEnum;
use App\Enum\MetodoPagoEnum;
use App\Repository\PagoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PagoRepository::class)]
#[ORM\Table(name: 'pagos')]
#[ORM\HasLifecycleCallbacks]
class Pago
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'pagos')]
    #[ORM\JoinColumn(name: 'pedido_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Pedido $pedido = null;

    #[ORM\Column(type: 'string', enumType: MetodoPagoEnum::class)]
    private MetodoPagoEnum $metodo;

    #[ORM\Column(type: 'string', enumType: EstadoPagoEnum::class)]
    private EstadoPagoEnum $estado;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $importe = '0.00';

    #[ORM\Column(type: 'string', length: 120, nullable: true)]
    private ?string $referencia = null;

    public function __construct()
    {
        $this->metodo = MetodoPagoEnum::TARJETA;
        $this->estado = EstadoPagoEnum::PENDIENTE;
    }

    public function getId(): ?int { return $this->id; }

    public function getPedido(): ?Pedido { return $this->pedido; }
    public function setPedido(?Pedido $pedido): self { $this->pedido = $pedido; return $this; }

    public function getMetodo(): MetodoPagoEnum { return $this->metodo; }
    public function setMetodo(MetodoPagoEnum $metodo): self { $this->metodo = $metodo; return $this; }

    public function getEstado(): EstadoPagoEnum { return $this->estado; }
    public function setEstado(EstadoPagoEnum $estado): self { $this->estado = $estado; return $this; }

    public function getImporte(): string { return $this->importe; }
    public function setImporte(string $importe): self { $this->importe = $importe; return $this; }

    public function getReferencia(): ?string { return $this->referencia; }
    public function setReferencia(?string $ref): self { $this->referencia = $ref; return $this; }
}
