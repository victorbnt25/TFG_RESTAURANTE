<?php

namespace App\Controller;

use App\Repository\CategoriaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categorias')]
final class CategoriaController extends AbstractController
{
    #[Route('', name: 'api_categorias_listar', methods: ['GET'])]
    public function listar(CategoriaRepository $categoriaRepository): JsonResponse
    {
        $categorias = $categoriaRepository->findBy(
            ['activa' => true],
            ['nombre' => 'ASC']
        );

        $datos = array_map(function ($categoria) {
            return [
                'id' => $categoria->getId(),
                'nombre' => $categoria->getNombre(),
                'descripcion' => $categoria->getDescripcion(),
                'activa' => $categoria->isActiva(),
            ];
        }, $categorias);

        return $this->json($datos);
    }
}