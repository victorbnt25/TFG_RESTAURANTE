<?php

namespace App\Repository;

use App\Entity\Pedido;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PedidoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pedido::class);
    }

    /**
     * @return array
     */
    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('p')
            ->select('p.id', 'p.estado', 'p.total', 'p.creadoEn')
            ->leftJoin('p.lineas', 'l')
            ->addSelect('l.cantidad', 'l.precioUnitario')
            ->leftJoin('l.plato', 'pl')
            ->addSelect('pl.nombre as platoNombre')
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }
}
