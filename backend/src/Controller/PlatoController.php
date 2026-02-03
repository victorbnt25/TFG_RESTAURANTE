<?php

namespace App\Controller;

use App\Entity\Plato;
use App\Enum\TipoPlatoEnum;
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
        $platos = $repo->findAll();
        $data = [];
        
        foreach ($platos as $plato) {
            $data[] = [
                'id' => $plato->getId(),
                'nombre' => $plato->getNombre(),
                'precio' => $plato->getPrecio(),
                'descripcion' => $plato->getDescripcion(), // Añadido para que el edit lo reciba
                'tipo' => $plato->getTipo()->value,
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
            return $this->json(['error' => 'Nombre y precio obligatorios'], 400);
        }

        $plato = new Plato();
        $plato->setNombre($data['nombre']);
        $plato->setPrecio((string)$data['precio']);
        $plato->setDescripcion($data['descripcion'] ?? null);
        $plato->setActivo(true);

        if (isset($data['tipo'])) {
            $plato->setTipo(TipoPlatoEnum::from($data['tipo']));
        }

        $em->persist($plato);
        $em->flush();

        return $this->json(['id' => $plato->getId()], 201);
    }

    // --- NUEVO MÉTODO PARA EDITAR ---
    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, PlatoRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $plato = $repo->find($id);
        if (!$plato) {
            return $this->json(['error' => 'Plato no encontrado'], 404);
        }

        $data = $request->toArray();

        // Actualizamos solo los campos que vienen en el JSON
        if (isset($data['nombre'])) {
            $plato->setNombre($data['nombre']);
        }
        if (isset($data['precio'])) {
            $plato->setPrecio((string)$data['precio']);
        }
        if (isset($data['descripcion'])) {
            $plato->setDescripcion($data['descripcion']);
        }
        if (isset($data['tipo'])) {
            $plato->setTipo(TipoPlatoEnum::from($data['tipo']));
        }

        $em->flush();

        return $this->json(['ok' => true, 'mensaje' => 'Plato actualizado']);
    }

    #[Route('/{id}/foto', methods: ['POST'])]
    public function subirFoto(Plato $plato, Request $request, EntityManagerInterface $em): JsonResponse 
    {
        $archivo = $request->files->get('foto');
        if (!$archivo) return $this->json(['error' => 'No hay archivo'], 400);

        $rutaCarpeta = $this->getParameter('kernel.project_dir') . '/public/uploads';

        if ($plato->getImagenUrl()) {
            $vieja = $this->getParameter('kernel.project_dir') . '/public' . $plato->getImagenUrl();
            if (file_exists($vieja)) unlink($vieja);
        }

        $nombreArchivo = uniqid('plato_') . '.webp';
        $archivo->move($rutaCarpeta, $nombreArchivo);

        $plato->setImagenUrl('/uploads/' . $nombreArchivo);
        $em->flush();

        return $this->json(['ok' => true, 'foto_url' => $plato->getImagenUrl()]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, PlatoRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $plato = $repo->find($id);
        if (!$plato) return $this->json(['error' => 'No encontrado'], 404);

        if ($plato->getImagenUrl()) {
            $ruta = $this->getParameter('kernel.project_dir') . '/public' . $plato->getImagenUrl();
            if (file_exists($ruta)) unlink($ruta);
        }

        $em->remove($plato);
        $em->flush();

        return $this->json(['ok' => true]);
    }
}