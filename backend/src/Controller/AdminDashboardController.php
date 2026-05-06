<?php

namespace App\Controller;

use App\Enum\EstadoPedidoEnum;
use App\Repository\ReservaRepository;
use App\Entity\Pedido;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/dashboard')]
class AdminDashboardController extends AbstractController
{
    #[Route('/reservas', name: 'api_admin_dashboard_reservas', methods: ['GET'])]
    public function obtenerKpisReservas(ReservaRepository $reservaRepository): JsonResponse
    {
        $kpis = $reservaRepository->getKpisDashboard();
        return $this->json($kpis);
    }

    #[Route('/pedidos', name: 'admin_dashboard_pedidos', methods: ['GET'])]
    public function kpisPedidos(EntityManagerInterface $em): JsonResponse
    {
        $pedidos = $em->getRepository(Pedido::class)->findAll();

        $hoy = new \DateTime('today');

        $totalPedidos = count($pedidos);
        $pendientes   = 0;
        $pagados      = 0;
        $entregados   = 0;
        $cancelados   = 0;
        $ingresosHoy   = 0.0;
        $ingresosTotal = 0.0;

        foreach ($pedidos as $pedido) {
            $estado = $pedido->getEstado()->value;
            $total  = (float) $pedido->getTotal();

            if ($estado === EstadoPedidoEnum::PENDIENTE->value)  $pendientes++;
            if ($estado === EstadoPedidoEnum::PAGADO->value)     $pagados++;
            if ($estado === EstadoPedidoEnum::ENTREGADO->value)  $entregados++;
            if ($estado === EstadoPedidoEnum::CANCELADO->value)  $cancelados++;

            // Los ingresos solo cuentan si el pedido está PAGADO o ENTREGADO
            if ($estado === EstadoPedidoEnum::PAGADO->value || $estado === EstadoPedidoEnum::ENTREGADO->value) {
                $ingresosTotal += $total;

                $fecha = $pedido->getCreadoEn();
                if ($fecha && $fecha >= $hoy) {
                    $ingresosHoy += $total;
                }
            }
        }

        return $this->json([
            'totalPedidos'  => $totalPedidos,
            'pendientes'    => $pendientes,
            'pagados'       => $pagados,
            'entregados'    => $entregados,
            'cancelados'    => $cancelados,
            'ingresosHoy'   => number_format($ingresosHoy, 2, '.', ''),
            'ingresosTotal' => number_format($ingresosTotal, 2, '.', ''),
        ]);
    }
}
