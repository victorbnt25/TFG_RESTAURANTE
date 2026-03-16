<?php

namespace App\Controller;

use App\Entity\Plato;
use App\Enum\DisponibilidadPlatoEnum;
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
    public function list(Request $request, PlatoRepository $repo): JsonResponse
    {
        $idCategoria = $request->query->get('categoria');

        $criterios = [
            'activo' => true,
        ];

        if ($idCategoria) {
            $criterios['categoria'] = $idCategoria;
        }

        $platos = $repo->findBy($criterios, ['nombre' => 'ASC']);
        $data = [];

        foreach ($platos as $plato) {
            $data[] = [
                'id' => $plato->getId(),
                'nombre' => $plato->getNombre(),
                'precio' => $plato->getPrecio(),
                'descripcion' => $plato->getDescripcion(),
                'tipo' => $plato->getTipo()?->value,
                'disponibilidad' => $plato->getDisponibilidad()?->value,
                'activo' => $plato->isActivo(),
                'imagen_url' => $plato->getImagenUrl(),
                'categoria' => [
                    'id' => $plato->getCategoria()?->getId(),
                    'nombre' => $plato->getCategoria()?->getNombre(),
                ],
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function detail(int $id, PlatoRepository $repo): JsonResponse
    {
        $plato = $repo->find($id);

        if (!$plato) {
            return $this->json(['error' => 'Plato no encontrado'], 404);
        }

        $ingredientes = [];
        $alergenosUnicos = [];

        foreach ($plato->getIngredientes() as $ingrediente) {
            if ($ingrediente->isActivo()) {
                $ingredientes[] = [
                    'id' => $ingrediente->getId(),
                    'nombre' => $ingrediente->getNombre(),
                    'descripcion' => $ingrediente->getDescripcion(),
                ];

                foreach ($ingrediente->getAlergenos() as $alergeno) {
                    $alergenosUnicos[$alergeno->getId()] = [
                        'id' => $alergeno->getId(),
                        'nombre' => $alergeno->getNombre(),
                    ];
                }
            }
        }

        $data = [
            'id' => $plato->getId(),
            'nombre' => $plato->getNombre(),
            'precio' => $plato->getPrecio(),
            'descripcion' => $plato->getDescripcion(),
            'tipo' => $plato->getTipo()?->value,
            'disponibilidad' => $plato->getDisponibilidad()?->value,
            'activo' => $plato->isActivo(),
            'imagen_url' => $plato->getImagenUrl(),
            'categoria' => [
                'id' => $plato->getCategoria()?->getId(),
                'nombre' => $plato->getCategoria()?->getNombre(),
                'descripcion' => $plato->getCategoria()?->getDescripcion(),
            ],
            'ingredientes' => $ingredientes,
            'alergenos' => array_values($alergenosUnicos),
        ];

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

        if (isset($data['disponibilidad'])) {
            $plato->setDisponibilidad(DisponibilidadPlatoEnum::from($data['disponibilidad']));
        }

        $em->persist($plato);
        $em->flush();

        return $this->json(['id' => $plato->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, PlatoRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $plato = $repo->find($id);
        if (!$plato) {
            return $this->json(['error' => 'Plato no encontrado'], 404);
        }

        $data = $request->toArray();

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
        if (isset($data['disponibilidad'])) {
            $plato->setDisponibilidad(DisponibilidadPlatoEnum::from($data['disponibilidad']));
        }
        if (isset($data['activo'])) {
            $plato->setActivo((bool)$data['activo']);
        }

        $em->flush();

        return $this->json(['ok' => true, 'mensaje' => 'Plato actualizado']);
    }

    #[Route('/{id}/foto', methods: ['POST'])]
    public function subirFoto(Plato $plato, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $archivo = $request->files->get('foto');
        if (!$archivo) {
            return $this->json(['error' => 'No hay archivo'], 400);
        }

        $rutaCarpeta = $this->getParameter('kernel.project_dir') . '/public/uploads';

        if ($plato->getImagenUrl()) {
            $vieja = $this->getParameter('kernel.project_dir') . '/public' . $plato->getImagenUrl();
            if (file_exists($vieja)) {
                unlink($vieja);
            }
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
        if (!$plato) {
            return $this->json(['error' => 'No encontrado'], 404);
        }

        if ($plato->getImagenUrl()) {
            $ruta = $this->getParameter('kernel.project_dir') . '/public' . $plato->getImagenUrl();
            if (file_exists($ruta)) {
                unlink($ruta);
            }
        }

        $em->remove($plato);
        $em->flush();

        return $this->json(['ok' => true]);
    }
}


/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se mejora el endpoint GET /api/platos para devolver información más completa.
2. Se añade filtro opcional por categoría mediante:
   /api/platos?categoria=ID
3. Se incluye en la respuesta de cada plato:
   - id
   - nombre
   - descripción
   - precio
   - tipo
   - disponibilidad
   - imagen
   - categoría
4. Se añade el endpoint GET /api/platos/{id} para obtener el detalle de un plato.
5. En el detalle se devuelve también:
   - ingredientes
   - alérgenos
6. Los alérgenos se obtienen a partir de los ingredientes activos del plato.
7. Se mantiene el resto de funcionalidades ya existentes del CRUD de platos
   para no romper la parte de administración.
8. Con este cambio la página Carta del frontend ya puede trabajar con datos reales
   y mostrar tanto el listado como el detalle de cada plato.
*/