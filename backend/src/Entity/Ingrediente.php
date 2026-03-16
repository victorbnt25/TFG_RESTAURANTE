<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\IngredienteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: IngredienteRepository::class)]
#[ORM\Table(name: 'ingredientes')]
#[ORM\HasLifecycleCallbacks]
class Ingrediente
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private string $nombre;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private bool $activo = true;

    /** @var Collection<int, Plato> */
    #[ORM\ManyToMany(targetEntity: Plato::class, inversedBy: 'ingredientes')]
    #[ORM\JoinTable(name: 'platos_ingredientes')]
    private Collection $platos;

    /** @var Collection<int, Alergeno> */
    #[ORM\ManyToMany(targetEntity: Alergeno::class, inversedBy: 'ingredientes')]
    #[ORM\JoinTable(name: 'ingredientes_alergenos')]
    private Collection $alergenos;

    public function __construct()
    {
        $this->platos = new ArrayCollection();
        $this->alergenos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): static
    {
        $this->activo = $activo;

        return $this;
    }

    /**
     * @return Collection<int, Plato>
     */
    public function getPlatos(): Collection
    {
        return $this->platos;
    }

    public function addPlato(Plato $plato): static
    {
        if (!$this->platos->contains($plato)) {
            $this->platos->add($plato);
        }

        return $this;
    }

    public function removePlato(Plato $plato): static
    {
        $this->platos->removeElement($plato);

        return $this;
    }

    /**
     * @return Collection<int, Alergeno>
     */
    public function getAlergenos(): Collection
    {
        return $this->alergenos;
    }

    public function addAlergeno(Alergeno $alergeno): static
    {
        if (!$this->alergenos->contains($alergeno)) {
            $this->alergenos->add($alergeno);
        }

        return $this;
    }

    public function removeAlergeno(Alergeno $alergeno): static
    {
        $this->alergenos->removeElement($alergeno);

        return $this;
    }
}