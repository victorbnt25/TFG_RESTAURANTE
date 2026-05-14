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
    public function obtenerKpisReservas(\Symfony\Component\HttpFoundation\Request $request, ReservaRepository $reservaRepository): JsonResponse
    {
        $periodo = $request->query->get('periodo', 'todo');
        $kpis = $reservaRepository->getKpisDashboard($periodo);
        return $this->json($kpis);
    }

    #[Route('/pedidos', name: 'admin_dashboard_pedidos', methods: ['GET'])]
    public function kpisPedidos(\Symfony\Component\HttpFoundation\Request $request, \App\Repository\PedidoRepository $pedidoRepository): JsonResponse
    {
        $periodo = $request->query->get('periodo', 'todo');
        $kpis = $pedidoRepository->getKpisDashboard($periodo);
        return $this->json($kpis);
    }
}
