<?php

namespace App\Repository;

use App\Entity\Plato;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PlatoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Plato::class);
    }

    /**
     * @param array $criterios
     * @return array
     */
    public function findAllWithCategoria(array $criterios = []): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p.id', 'p.nombre', 'p.precio', 'p.descripcion', 'p.tipo', 'p.disponibilidad', 'p.activo', 'p.imagenUrl')
            ->leftJoin('p.categoria', 'c')
            ->addSelect('c.id as catId', 'c.nombre as catNombre')
            ->orderBy('p.nombre', 'ASC');

        if (isset($criterios['activo'])) {
            $qb->andWhere('p.activo = :activo')
               ->setParameter('activo', $criterios['activo']);
        }

        if (isset($criterios['categoria'])) {
            $qb->andWhere('p.categoria = :catId')
               ->setParameter('catId', $criterios['categoria']);
        }

        return $qb->getQuery()->getArrayResult();
    }
}
