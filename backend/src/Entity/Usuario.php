<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\EstadoUsuarioEnum;
use App\Enum\RolUsuarioEnum;
use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
#[ORM\Table(name: 'usuarios')]
#[ORM\UniqueConstraint(name: 'uniq_usuarios_email', columns: ['email'])]
#[ORM\HasLifecycleCallbacks]
class Usuario implements UserInterface, PasswordAuthenticatedUserInterface
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 120)]
    private string $nombre;

    #[ORM\Column(type: 'string', length: 180)]
    private string $email;

    #[ORM\Column(type: 'string')]
    private string $contrasena;

    #[ORM\Column(type: 'string', enumType: RolUsuarioEnum::class)]
    private RolUsuarioEnum $rol;

    #[ORM\Column(type: 'string', enumType: EstadoUsuarioEnum::class)]
    private EstadoUsuarioEnum $estado;

    #[ORM\Column(type: 'string', length: 20, nullable: true)]
    private ?string $telefono = null;

    /** @var Collection<int, Reserva> */
    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Reserva::class, orphanRemoval: true)]
    private Collection $reservas;

    /** @var Collection<int, Pedido> */
    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Pedido::class)]
    private Collection $pedidos;

    public function __construct()
    {
        $this->reservas = new ArrayCollection();
        $this->pedidos = new ArrayCollection();
        $this->rol = RolUsuarioEnum::CLIENTE;
        $this->estado = EstadoUsuarioEnum::ACTIVO;
    }

    public function getId(): ?int { return $this->id; }

    public function getNombre(): string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): self { $this->email = mb_strtolower(trim($email)); return $this; }

    public function getRol(): RolUsuarioEnum { return $this->rol; }
    public function setRol(RolUsuarioEnum $rol): self { $this->rol = $rol; return $this; }

    public function getEstado(): EstadoUsuarioEnum { return $this->estado; }
    public function setEstado(EstadoUsuarioEnum $estado): self { $this->estado = $estado; return $this; }

    public function getTelefono(): ?string { return $this->telefono; }
    public function setTelefono(?string $tel): self { $this->telefono = $tel; return $this; }

    public function getPassword(): string { return $this->contrasena; }
    public function setContrasena(string $hash): self { $this->contrasena = $hash; return $this; }

    /** UserInterface */
    public function getUserIdentifier(): string { return $this->email; }

    public function getRoles(): array
    {
        // Symfony espera roles tipo ROLE_*
        return match ($this->rol) {
            RolUsuarioEnum::ADMIN => ['ROLE_ADMIN'],
            RolUsuarioEnum::PERSONAL => ['ROLE_PERSONAL'],
            default => ['ROLE_CLIENTE'],
        };
    }

    public function eraseCredentials(): void {}

    /** @return Collection<int, Reserva> */
    public function getReservas(): Collection { return $this->reservas; }

    public function addReserva(Reserva $reserva): self
    {
        if (!$this->reservas->contains($reserva)) {
            $this->reservas->add($reserva);
            $reserva->setUsuario($this);
        }
        return $this;
    }

    public function removeReserva(Reserva $reserva): self
    {
        if ($this->reservas->removeElement($reserva)) {
            if ($reserva->getUsuario() === $this) {
                $reserva->setUsuario(null);
            }
        }
        return $this;
    }

    /** @return Collection<int, Pedido> */
    public function getPedidos(): Collection { return $this->pedidos; }

    public function addPedido(Pedido $pedido): self
    {
        if (!$this->pedidos->contains($pedido)) {
            $this->pedidos->add($pedido);
            $pedido->setUsuario($this);
        }
        return $this;
    }

    public function removePedido(Pedido $pedido): self
    {
        if ($this->pedidos->removeElement($pedido)) {
            if ($pedido->getUsuario() === $this) {
                $pedido->setUsuario(null);
            }
        }
        return $this;
    }
}
