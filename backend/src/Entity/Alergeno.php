<?php

namespace App\Entity;

use App\Repository\AlergenoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlergenoRepository::class)]
class Alergeno
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\ManyToMany(targetEntity: Ingrediente::class, mappedBy: 'alergenos')]
    private Collection $ingredientes;

    public function __construct()
    {
        $this->ingredientes = new ArrayCollection();
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

    /**
     * @return Collection<int, Ingrediente>
     */
    public function getIngredientes(): Collection
    {
        return $this->ingredientes;
    }

    public function addIngrediente(Ingrediente $ingrediente): static
    {
        if (!$this->ingredientes->contains($ingrediente)) {
            $this->ingredientes->add($ingrediente);
            $ingrediente->addAlergeno($this);
        }

        return $this;
    }

    public function removeIngrediente(Ingrediente $ingrediente): static
    {
        if ($this->ingredientes->removeElement($ingrediente)) {
            $ingrediente->removeAlergeno($this);
        }

        return $this;
    }
}