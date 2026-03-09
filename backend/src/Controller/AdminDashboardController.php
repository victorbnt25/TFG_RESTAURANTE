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
}
