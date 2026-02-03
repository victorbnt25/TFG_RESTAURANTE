<?php

namespace App\Controller;

use App\Entity\Plato;
use App\Enum\TipoPlatoEnum;
use App\Enum\DisponibilidadPlatoEnum;
use App\Repository\PlatoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/platos')]
class PlatoController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(PlatoRepository $repo): JsonResponse
    {
        $data = [];
        foreach ($repo->findAll() as $plato) {
            $data[] = [
                'id' => $plato->getId(),
                'nombre' => $plato->getNombre(),
                'precio' => $plato->getPrecio(),
                'tipo' => $plato->getTipo()->value, // Enviamos el valor del Enum
                'activo' => $plato->isActivo(),
                'foto_url' => $plato->getImagenUrl(),
            ];
        }
        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->toArray();
        
        if (!isset($data['nombre'], $data['precio'])) {
            return $this->json(['error' => 'Nombre y precio son obligatorios'], 400);
        }

        $plato = new Plato();
        $plato->setNombre($data['nombre']);
        $plato->setPrecio((string)$data['precio']);
        $plato->setDescripcion($data['descripcion'] ?? null);
        $plato->setActivo(true);

        // Mapeo del Enum Tipo
        if (isset($data['tipo'])) {
            $plato->setTipo(TipoPlatoEnum::from($data['tipo']));
        }

        $em->persist($plato);
        $em->flush();

        return $this->json([
            'id' => $plato->getId(),
            'nombre' => $plato->getNombre(),
            'mensaje' => 'Plato creado con éxito'
        ], 201);
    }

    #[Route('/{id}/foto', methods: ['POST'])]
    public function subirFoto(
        Plato $plato,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $archivo = $request->files->get('foto');

        if (!$archivo) {
            return $this->json(['error' => 'No se ha enviado imagen'], 400);
        }

        $rutaCarpeta = $this->getParameter('kernel.project_dir') . '/public/uploads';

        // Borrar foto anterior
        if ($plato->getImagenUrl()) {
            $archivoAntiguo = $this->getParameter('kernel.project_dir') . '/public' . $plato->getImagenUrl();
            if (file_exists($archivoAntiguo)) {
                unlink($archivoAntiguo);
            }
        }

        $extension = $archivo->getClientOriginalExtension() ?: 'jpg';
        $nombreArchivo = uniqid('plato_') . '.' . $extension;

        if (!is_dir($rutaCarpeta)) {
            mkdir($rutaCarpeta, 0777, true);
        }

        $archivo->move($rutaCarpeta, $nombreArchivo);

        $plato->setImagenUrl('/uploads/' . $nombreArchivo);
        $em->flush();

        return $this->json([
            'ok' => true,
            'foto_url' => $plato->getImagenUrl(),
        ]);
    }
}