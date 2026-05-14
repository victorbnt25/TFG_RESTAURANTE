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
            ->addSelect('l', 'pl', 'm')
            ->leftJoin('p.lineas', 'l')
            ->leftJoin('l.plato', 'pl')
            ->leftJoin('p.mesa', 'm')
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByUsuarioWithRelations($usuario): array
    {
        return $this->createQueryBuilder('p')
            ->addSelect('l', 'pl', 'm')
            ->leftJoin('p.lineas', 'l')
            ->leftJoin('l.plato', 'pl')
            ->leftJoin('p.mesa', 'm')
            ->where('p.usuario = :usuario')
            ->setParameter('usuario', $usuario)
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult();
    }
    public function getKpisDashboard(string $periodo = 'todo'): array
    {
        $fechaInicio = null;
        if ($periodo === 'hoy') {
            $fechaInicio = new \DateTimeImmutable('today 00:00:00');
        } elseif ($periodo === 'semana') {
            $fechaInicio = new \DateTimeImmutable('monday this week 00:00:00');
        } elseif ($periodo === 'mes') {
            $fechaInicio = new \DateTimeImmutable('first day of this month 00:00:00');
        } elseif ($periodo === 'ano') {
            $fechaInicio = new \DateTimeImmutable('first day of january this year 00:00:00');
        }

        $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id) as total')
            ->addSelect("SUM(CASE WHEN p.estado = 'PENDIENTE' THEN 1 ELSE 0 END) as pendientes")
            ->addSelect("SUM(CASE WHEN p.estado = 'PAGADO' THEN 1 ELSE 0 END) as pagados")
            ->addSelect("SUM(CASE WHEN p.estado = 'ENTREGADO' THEN 1 ELSE 0 END) as entregados")
            ->addSelect("SUM(CASE WHEN p.estado = 'CANCELADO' THEN 1 ELSE 0 END) as cancelados")
            ->addSelect("SUM(CASE WHEN p.estado IN ('PAGADO', 'ENTREGADO') THEN p.total ELSE 0 END) as ingresosTotal");

        if ($fechaInicio) {
            $qb->where('p.creadoEn >= :inicio')
               ->setParameter('inicio', $fechaInicio);
        }

        $res = $qb->getQuery()->getSingleResult();

        // Ingresos hoy (siempre fijo)
        $hoyInicio = new \DateTimeImmutable('today 00:00:00');
        $ingresosHoy = $this->createQueryBuilder('p')
            ->select("SUM(CASE WHEN p.estado IN ('PAGADO', 'ENTREGADO') THEN p.total ELSE 0 END)")
            ->where('p.creadoEn >= :hoy')
            ->setParameter('hoy', $hoyInicio)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;

        return [
            'totalPedidos'  => (int)$res['total'],
            'pendientes'    => (int)$res['pendientes'],
            'pagados'       => (int)$res['pagados'],
            'entregados'    => (int)$res['entregados'],
            'cancelados'    => (int)$res['cancelados'],
            'ingresosTotal' => number_format((float)$res['ingresosTotal'], 2, '.', ''),
            'ingresosHoy'   => number_format((float)$ingresosHoy, 2, '.', ''),
        ];
    }
}
