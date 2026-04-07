<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\KernelInterface;

class ConfiguracionController extends AbstractController
{
    private string $dataDir;

    public function __construct(KernelInterface $kernel)
    {
        // Apuntar a la carpeta backend/data que acabamos de crear
        $this->dataDir = $kernel->getProjectDir() . '/data';
    }

    #[Route('/api/public/politica', name: 'api_public_politica_get', methods: ['GET'])]
    public function getPolitica(): JsonResponse
    {
        $filePath = $this->dataDir . '/politica.txt';
        $contenido = '';

        if (file_exists($filePath)) {
            $contenido = file_get_contents($filePath);
        }

        return $this->json([
            'politica' => $contenido
        ]);
    }

    #[Route('/api/admin/politica', name: 'api_admin_politica_save', methods: ['POST', 'PUT'])]
    public function savePolitica(Request $request): JsonResponse
    {
        $data = $request->toArray();

        if (!isset($data['politica'])) {
            return $this->json(['error' => 'Falta el contenido de la política'], 400);
        }

        $filePath = $this->dataDir . '/politica.txt';
        
        // Escribe el texto en el archivo
        file_put_contents($filePath, $data['politica']);

        return $this->json([
            'ok' => true,
            'mensaje' => 'Política guardada correctamente.'
        ]);
    }
}
