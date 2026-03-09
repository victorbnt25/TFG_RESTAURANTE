<?php

namespace App\Repository;

use App\Entity\Reserva;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ReservaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reserva::class);
    }

    /**
     * Devuelve todas las reservas uniendo las tablas relacionadas para evitar el problema N+1
     * @return Reserva[] Returns an array of Reserva objects
     */
    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('r')
            ->leftJoin('r.usuario', 'u')
            ->addSelect('u')
            ->leftJoin('r.mesa', 'm')
            ->addSelect('m')
            ->orderBy('r.fechaHoraReserva', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Calcula los KPIs directamente en la base de datos usando COUNT
     * @return array
     */
    public function getKpisDashboard(): array
    {
        $inicioHoy = (new \DateTimeImmutable('today'))->setTime(0, 0, 0);
        $finHoy = (new \DateTimeImmutable('today'))->setTime(23, 59, 59);
        
        $inicioSemana = (new \DateTimeImmutable('monday this week'))->setTime(0, 0, 0);
        $finSemana = (new \DateTimeImmutable('sunday this week'))->setTime(23, 59, 59);

        // 1. Reservas de hoy (estado PENDIENTE o CONFIRMADA)
        $reservasHoy = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.fechaHoraReserva BETWEEN :inicio AND :fin')
            ->andWhere('r.estado IN (:estadosActivos)')
            ->setParameter('inicio', $inicioHoy)
            ->setParameter('fin', $finHoy)
            ->setParameter('estadosActivos', [\App\Enum\EstadoReservaEnum::PENDIENTE, \App\Enum\EstadoReservaEnum::CONFIRMADA])
            ->getQuery()
            ->getSingleScalarResult();

        // 2. Reservas de la semana (estado PENDIENTE o CONFIRMADA)
        $reservasSemana = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.fechaHoraReserva BETWEEN :inicioSemana AND :finSemana')
            ->andWhere('r.estado IN (:estadosActivos)')
            ->setParameter('inicioSemana', $inicioSemana)
            ->setParameter('finSemana', $finSemana)
            ->setParameter('estadosActivos', [\App\Enum\EstadoReservaEnum::PENDIENTE, \App\Enum\EstadoReservaEnum::CONFIRMADA])
            ->getQuery()
            ->getSingleScalarResult();

        // 3. Reservas canceladas hoy
        $canceladasHoy = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.fechaHoraReserva BETWEEN :inicio AND :fin')
            ->andWhere('r.estado = :estadoCancelada')
            ->setParameter('inicio', $inicioHoy)
            ->setParameter('fin', $finHoy)
            ->setParameter('estadoCancelada', \App\Enum\EstadoReservaEnum::CANCELADA)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'reservas_hoy' => (int) $reservasHoy,
            'reservas_semana' => (int) $reservasSemana,
            'canceladas_hoy' => (int) $canceladasHoy,
        ];
    }
}
