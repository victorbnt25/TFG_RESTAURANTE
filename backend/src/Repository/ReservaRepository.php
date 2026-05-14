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
     * @param string $periodo Filtro de periodo (todo, semana, mes, ano)
     * @return array
     */
    public function getKpisDashboard(string $periodo = 'todo'): array
    {
        $inicioHoy = (new \DateTimeImmutable('today'))->setTime(0, 0, 0);
        $finHoy    = (new \DateTimeImmutable('today'))->setTime(23, 59, 59);

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

        // Helper para crear el query builder base con el filtro de fecha opcional
        $createBaseQb = function() use ($fechaInicio) {
            $qb = $this->createQueryBuilder('r')->select('COUNT(r.id)');
            if ($fechaInicio) {
                $qb->andWhere('r.fechaHoraReserva >= :inicioFiltro')
                   ->setParameter('inicioFiltro', $fechaInicio);
            }
            return $qb;
        };

        // Total de reservas (filtrado por periodo)
        $total = $createBaseQb()->getQuery()->getSingleScalarResult();

        // Reservas de hoy (activas)
        $hoy = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->where('r.fechaHoraReserva BETWEEN :inicio AND :fin')
            ->andWhere('r.estado IN (:estadosActivos)')
            ->setParameter('inicio', $inicioHoy)
            ->setParameter('fin', $finHoy)
            ->setParameter('estadosActivos', [\App\Enum\EstadoReservaEnum::PENDIENTE, \App\Enum\EstadoReservaEnum::CONFIRMADA])
            ->getQuery()
            ->getSingleScalarResult();

        // Pendientes (filtradas)
        $pendientes = $createBaseQb()
            ->andWhere('r.estado = :estado')
            ->setParameter('estado', \App\Enum\EstadoReservaEnum::PENDIENTE)
            ->getQuery()
            ->getSingleScalarResult();

        // Confirmadas (filtradas)
        $confirmadas = $createBaseQb()
            ->andWhere('r.estado = :estado')
            ->setParameter('estado', \App\Enum\EstadoReservaEnum::CONFIRMADA)
            ->getQuery()
            ->getSingleScalarResult();

        // Canceladas (filtradas)
        $canceladas = $createBaseQb()
            ->andWhere('r.estado = :estado')
            ->setParameter('estado', \App\Enum\EstadoReservaEnum::CANCELADA)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total'       => (int) $total,
            'hoy'         => (int) $hoy,
            'pendientes'  => (int) $pendientes,
            'confirmadas' => (int) $confirmadas,
            'canceladas'  => (int) $canceladas,
        ];
    }
}
