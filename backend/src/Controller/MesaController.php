<?php

namespace App\Controller;

use App\Entity\Mesa;
use App\Enum\EstadoMesaEnum;
use App\Enum\ZonaMesaEnum;
use App\Repository\MesaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/mesas')]
class MesaController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(MesaRepository $repo): JsonResponse
    {
        $mesas = $repo->findAll();
        $data = [];
        
        foreach ($mesas as $mesa) {
            $data[] = [
                'id' => $mesa->getId(),
                'codigo' => $mesa->getCodigo(),
                'capacidad' => $mesa->getCapacidad(),
                'zona' => $mesa->getZona()->value,
                'estado' => $mesa->getEstado()->value,
                'activo' => $mesa->isActivo(),
            ];
        }
        
        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->toArray();
        if (!isset($data['codigo'], $data['capacidad'], $data['zona'])) {
            return $this->json(['error' => 'Código, capacidad y zona son obligatorios'], 400);
        }

        $mesa = new Mesa();
        $mesa->setCodigo($data['codigo']);
        $mesa->setCapacidad((int)$data['capacidad']);
        $mesa->setZona(ZonaMesaEnum::from($data['zona']));
        $mesa->setActivo(true);
        $mesa->setEstado(EstadoMesaEnum::DISPONIBLE);

        $em->persist($mesa);
        $em->flush();

        return $this->json(['id' => $mesa->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, MesaRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $mesa = $repo->find($id);
        if (!$mesa) {
            return $this->json(['error' => 'Mesa no encontrada'], 404);
        }

        $data = $request->toArray();

        if (isset($data['codigo'])) {
            $mesa->setCodigo($data['codigo']);
        }
        if (isset($data['capacidad'])) {
            $mesa->setCapacidad((int)$data['capacidad']);
        }
        if (isset($data['zona'])) {
            $mesa->setZona(ZonaMesaEnum::from($data['zona']));
        }
        if (isset($data['activo'])) {
            $mesa->setActivo((bool)$data['activo']);
        }
        if (isset($data['estado'])) {
            $mesa->setEstado(EstadoMesaEnum::from($data['estado']));
        }

        $em->flush();

        return $this->json(['ok' => true, 'mensaje' => 'Mesa actualizada']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, MesaRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $mesa = $repo->find($id);
        if (!$mesa) {
            return $this->json(['error' => 'Mesa no encontrada'], 404);
        }

        // Verificar si tiene reservas (Impedimos el borrado si hay historial para no romper registros)
        if ($mesa->getReservas()->count() > 0) {
            return $this->json([
                'error' => 'No se puede borrar la mesa porque tiene reservas registradas. Puedes desactivarla (marcar como no activa) en lugar de borrarla.'
            ], 400);
        }

        $em->remove($mesa);
        // El primer flush asegura que la mesa ya no ocupe su código ('M-X') en la base de datos
        $em->flush();

        // ------------------------------------------------------------
        // RE-INDEXAR AUTOMÁTICAMENTE (Requisito TFG)
        // Al borrar M-1, la M-2 pasa a ser M-1, etc.
        // ------------------------------------------------------------
        $mesasRestantes = $repo->findBy([], ['id' => 'ASC']);
        $contador = 1;
        
        foreach ($mesasRestantes as $m) {
            // Solo reindexamos las que siguen el patrón "M-"
            if (str_starts_with($m->getCodigo(), 'M-')) {
                $nuevoCodigo = 'M-' . $contador;
                $m->setCodigo($nuevoCodigo);
                $contador++;
            }
        }
        
        $em->flush();

        return $this->json(['ok' => true]);
    }
}
