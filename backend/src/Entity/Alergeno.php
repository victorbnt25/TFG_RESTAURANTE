<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\AlergenoEnum;
use App\Repository\AlergenoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlergenoRepository::class)]
#[ORM\Table(name: 'alergenos')]
#[ORM\UniqueConstraint(name: 'uniq_alergenos_nombre', columns: ['nombre'])]
#[ORM\HasLifecycleCallbacks]
class Alergeno
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', enumType: AlergenoEnum::class)]
    private AlergenoEnum $nombre;

    /** @var Collection<int, Plato> */
    #[ORM\ManyToMany(targetEntity: Plato::class, mappedBy: 'alergenos')]
    private Collection $platos;

    public function __construct()
    {
        $this->platos = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getNombre(): AlergenoEnum { return $this->nombre; }
    public function setNombre(AlergenoEnum $nombre): self { $this->nombre = $nombre; return $this; }

    /** @return Collection<int, Plato> */
    public function getPlatos(): Collection { return $this->platos; }
}
