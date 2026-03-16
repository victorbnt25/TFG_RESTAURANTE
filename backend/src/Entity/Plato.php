<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\DisponibilidadPlatoEnum;
use App\Enum\TipoPlatoEnum;
use App\Repository\PlatoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlatoRepository::class)]
#[ORM\Table(name: 'platos')]
#[ORM\HasLifecycleCallbacks]
class Plato
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 160)]
    private string $nombre;

    #[ORM\Column(type: 'string', length: 800, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $precio;

    #[ORM\Column(type: 'string', enumType: TipoPlatoEnum::class)]
    private TipoPlatoEnum $tipo;

    #[ORM\Column(type: 'string', enumType: DisponibilidadPlatoEnum::class)]
    private DisponibilidadPlatoEnum $disponibilidad;

    #[ORM\Column(type: 'boolean')]
    private bool $activo = true;

    #[ORM\Column(name: 'imagen_url', type: 'string', length: 500, nullable: true)]
    private ?string $imagenUrl = null;

    #[ORM\ManyToOne(targetEntity: Categoria::class, inversedBy: 'platos')]
    #[ORM\JoinColumn(nullable: false)]
    private Categoria $categoria;

    /** @var Collection<int, Alergeno> */
    #[ORM\ManyToMany(targetEntity: Alergeno::class, inversedBy: 'platos')]
    #[ORM\JoinTable(name: 'platos_alergenos')]
    #[ORM\JoinColumn(name: 'plato_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\InverseJoinColumn(name: 'alergeno_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private Collection $alergenos;

    /** @var Collection<int, Ingrediente> */
    #[ORM\ManyToMany(targetEntity: Ingrediente::class, mappedBy: 'platos')]
    private Collection $ingredientes;

    /** @var Collection<int, LineaPedido> */
    #[ORM\OneToMany(mappedBy: 'plato', targetEntity: LineaPedido::class)]
    private Collection $lineasPedido;

    public function __construct()
    {
        $this->alergenos = new ArrayCollection();
        $this->lineasPedido = new ArrayCollection();
        $this->ingredientes = new ArrayCollection();
        $this->tipo = TipoPlatoEnum::PRINCIPAL;
        $this->disponibilidad = DisponibilidadPlatoEnum::DISPONIBLE;
    }

    public function getId(): ?int { return $this->id; }

    public function getNombre(): string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }

    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): self { $this->descripcion = $descripcion; return $this; }

    public function getPrecio(): string { return $this->precio; }
    public function setPrecio(string $precio): self { $this->precio = $precio; return $this; }

    public function getTipo(): TipoPlatoEnum { return $this->tipo; }
    public function setTipo(TipoPlatoEnum $tipo): self { $this->tipo = $tipo; return $this; }

    public function getDisponibilidad(): DisponibilidadPlatoEnum { return $this->disponibilidad; }
    public function setDisponibilidad(DisponibilidadPlatoEnum $d): self { $this->disponibilidad = $d; return $this; }

    public function isActivo(): bool { return $this->activo; }
    public function setActivo(bool $activo): self { $this->activo = $activo; return $this; }

    public function getImagenUrl(): ?string { return $this->imagenUrl; }
    public function setImagenUrl(?string $url): self { $this->imagenUrl = $url; return $this; }

    public function getCategoria(): Categoria { return $this->categoria; }
    public function setCategoria(Categoria $categoria): self { $this->categoria = $categoria; return $this; }

    /** @return Collection<int, Alergeno> */
    public function getAlergenos(): Collection { return $this->alergenos; }

    public function addAlergeno(Alergeno $alergeno): self
    {
        if (!$this->alergenos->contains($alergeno)) {
            $this->alergenos->add($alergeno);
        }
        return $this;
    }

    public function removeAlergeno(Alergeno $alergeno): self
    {
        $this->alergenos->removeElement($alergeno);
        return $this;
    }

    /** @return Collection<int, Ingrediente> */
    public function getIngredientes(): Collection { return $this->ingredientes; }

    public function addIngrediente(Ingrediente $ingrediente): self
    {
        if (!$this->ingredientes->contains($ingrediente)) {
            $this->ingredientes->add($ingrediente);
            $ingrediente->addPlato($this);
        }
        return $this;
    }

    public function removeIngrediente(Ingrediente $ingrediente): self
    {
        if ($this->ingredientes->removeElement($ingrediente)) {
            $ingrediente->removePlato($this);
        }
        return $this;
    }
}
