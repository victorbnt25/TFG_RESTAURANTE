<?php

namespace App\Controller;

use App\Enum\EstadoReservaEnum;
use App\Repository\ReservaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/dashboard')]
class AdminDashboardController extends AbstractController
{
    #[Route('/reservas', name: 'api_admin_dashboard_reservas', methods: ['GET'])]
    public function obtenerKpisReservas(ReservaRepository $reservaRepository): JsonResponse
    {
        // Usar los KPIs optimizados directo desde la base de datos (evita N+1 y cargar miles de objetos en memoria)
        $kpis = $reservaRepository->getKpisDashboard();

        return $this->json($kpis);
    }
    #[Route('/api/admin/dashboard/pedidos', name: 'admin_dashboard_pedidos', methods: ['GET'])]
public function kpisPedidos(EntityManagerInterface $em): JsonResponse
{
    $pedidos = $em->getRepository(Pedido::class)->findAll();

    $hoy = new \DateTime('today');

    $totalPedidos = count($pedidos);
    $abiertos = 0;
    $preparando = 0;
    $servidos = 0;
    $cancelados = 0;

    $ingresosHoy = 0;
    $ingresosTotal = 0;

    foreach ($pedidos as $pedido) {
        $estado = $pedido->getEstado()->value;
        $total = (float) $pedido->getTotal();

        // Estados
        if ($estado === 'ABIERTO') $abiertos++;
        if ($estado === 'EN_PREPARACION') $preparando++;
        if ($estado === 'SERVIDO') $servidos++;
        if ($estado === 'CANCELADO') $cancelados++;

        // Ingresos total
        $ingresosTotal += $total;

        // Ingresos hoy
        $fecha = $pedido->getCreadoEn();

        if ($fecha && $fecha >= $hoy) {
            $ingresosHoy += $total;
        }
    }

    return $this->json([
        'totalPedidos' => $totalPedidos,
        'abiertos' => $abiertos,
        'preparando' => $preparando,
        'servidos' => $servidos,
        'cancelados' => $cancelados,
        'ingresosHoy' => number_format($ingresosHoy, 2, '.', ''),
        'ingresosTotal' => number_format($ingresosTotal, 2, '.', ''),
    ]);
}
}
