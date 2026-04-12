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
     * @return array Returns an array of Reserva data
     */
    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('r')
            ->select('r.id', 'r.fechaHoraReserva', 'r.numeroPersonas', 'r.estado', 'r.turno', 'r.canal', 'r.observaciones')
            ->leftJoin('r.usuario', 'u')
            ->addSelect('u.nombre as userName', 'u.email as userEmail', 'u.telefono as userPhone')
            ->leftJoin('r.mesas', 'm')
            ->addSelect('m.codigo as mesaCodigo', 'm.id as mesaId', 'm.zona as mesaZona')
            ->orderBy('r.fechaHoraReserva', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }

    /**
     * @param \App\Entity\Usuario $usuario
     * @return array
     */
    public function findByUsuarioWithRelations($usuario): array
    {
        return $this->createQueryBuilder('r')
            ->select('r.id', 'r.fechaHoraReserva', 'r.numeroPersonas', 'r.estado')
            ->leftJoin('r.mesas', 'm')
            ->addSelect('m.codigo as mesaCodigo')
            ->where('r.usuario = :usuario')
            ->setParameter('usuario', $usuario)
            ->orderBy('r.fechaHoraReserva', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }

    /**
     * Busca reservas que se solapen en el tiempo para unas mesas específicas
     * @param \DateTimeInterface $fechaHora
     * @param int[] $mesaIds
     * @param int|null $excludeReservaId
     * @return Reserva[]
     */
    public function findOverlappingReservations(\DateTimeInterface $fechaHora, array $mesaIds, ?int $excludeReservaId = null): array
    {
        $interval = new \DateInterval('PT89M59S'); // Casi 90 minutos
        $start = \DateTimeImmutable::createFromInterface($fechaHora)->sub($interval);
        $end = \DateTimeImmutable::createFromInterface($fechaHora)->add($interval);

        $qb = $this->createQueryBuilder('r')
            ->join('r.mesas', 'm')
            ->where('m.id IN (:mesaIds)')
            ->andWhere('r.fechaHoraReserva > :start')
            ->andWhere('r.fechaHoraReserva < :end')
            ->andWhere('r.estado != :cancelada')
            ->setParameter('mesaIds', $mesaIds)
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setParameter('cancelada', \App\Enum\EstadoReservaEnum::CANCELADA);

        if ($excludeReservaId) {
            $qb->andWhere('r.id != :excludeId')
               ->setParameter('excludeId', $excludeReservaId);
        }

        return $qb->getQuery()->getResult();
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
