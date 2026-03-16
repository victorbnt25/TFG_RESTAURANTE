<?php

namespace App\Entity;

use App\Repository\CategoriaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoriaRepository::class)]
class Categoria
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column]
    private ?bool $activa = true;

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: Plato::class)]
    private Collection $platos;

    public function __construct()
    {
        $this->platos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
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

    public function isActiva(): ?bool
    {
        return $this->activa;
    }

    public function setActiva(bool $activa): static
    {
        $this->activa = $activa;

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
            $plato->setCategoria($this);
        }

        return $this;
    }

    public function removePlato(Plato $plato): static
    {
        $this->platos->removeElement($plato);

        return $this;
    }
}