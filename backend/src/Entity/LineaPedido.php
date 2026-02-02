<?php

namespace App\Entity;

use App\Repository\LineaPedidoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LineaPedidoRepository::class)]
#[ORM\Table(name: 'lineas_pedido')]
class LineaPedido
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'lineas')]
    #[ORM\JoinColumn(name: 'pedido_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Pedido $pedido = null;

    #[ORM\ManyToOne(inversedBy: 'lineasPedido')]
    #[ORM\JoinColumn(name: 'plato_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    private ?Plato $plato = null;

    #[ORM\Column(type: 'smallint')]
    private int $cantidad = 1;

    #[ORM\Column(name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2)]
    private string $precioUnitario = '0.00';

    public function getId(): ?int { return $this->id; }

    public function getPedido(): ?Pedido { return $this->pedido; }
    public function setPedido(?Pedido $pedido): self { $this->pedido = $pedido; return $this; }

    public function getPlato(): ?Plato { return $this->plato; }
    public function setPlato(?Plato $plato): self { $this->plato = $plato; return $this; }

    public function getCantidad(): int { return $this->cantidad; }
    public function setCantidad(int $cantidad): self { $this->cantidad = $cantidad; return $this; }

    public function getPrecioUnitario(): string { return $this->precioUnitario; }
    public function setPrecioUnitario(string $precio): self { $this->precioUnitario = $precio; return $this; }
}
