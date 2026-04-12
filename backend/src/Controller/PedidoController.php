<?php

namespace App\Controller;

use App\Entity\LineaPedido;
use App\Entity\Pedido;
use App\Enum\EstadoPedidoEnum;
use App\Repository\PlatoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/pedidos')]
class PedidoController extends AbstractController
{
    #[Route('', name: 'api_pedidos_crear', methods: ['POST'])]
    public function crear(
        Request $request,
        PlatoRepository $platoRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $datos = json_decode($request->getContent(), true);

        if (
            !$datos ||
            !isset($datos['productos']) ||
            !is_array($datos['productos']) ||
            count($datos['productos']) === 0
        ) {
            return $this->json([
                'error' => 'No se han recibido productos válidos.'
            ], 400);
        }

        $pedido = new Pedido();

        $usuario = $this->getUser();
        if ($usuario) {
            $pedido->setUsuario($usuario);
        }

        $pedido->setEstado(EstadoPedidoEnum::ABIERTO);

        $totalPedido = 0;

        foreach ($datos['productos'] as $producto) {
            if (
                !isset($producto['id']) ||
                !isset($producto['cantidad']) ||
                (int) $producto['cantidad'] <= 0
            ) {
                return $this->json([
                    'error' => 'Formato de producto inválido.'
                ], 400);
            }

            $plato = $platoRepository->find($producto['id']);

            if (!$plato) {
                return $this->json([
                    'error' => 'Uno de los platos no existe.'
                ], 404);
            }

            $cantidad = (int) $producto['cantidad'];
            $precioUnitario = (float) $plato->getPrecio();
            $subtotal = $precioUnitario * $cantidad;

            $linea = new LineaPedido();
            $linea->setPlato($plato);
            $linea->setCantidad($cantidad);
            $linea->setPrecioUnitario(number_format($precioUnitario, 2, '.', ''));

            $pedido->addLinea($linea);

            $totalPedido += $subtotal;
        }

        $pedido->setTotal(number_format($totalPedido, 2, '.', ''));

        $entityManager->persist($pedido);
        $entityManager->flush();

        return $this->json([
            'mensaje' => 'Pedido creado correctamente.',
            'pedido' => [
                'id' => $pedido->getId(),
                'estado' => $pedido->getEstado()->value,
                'total' => $pedido->getTotal(),
            ]
        ], 201);
    }
    #[Route('', name: 'api_pedidos_listar', methods: ['GET'])]
public function listar(EntityManagerInterface $em): JsonResponse
{
    $pedidos = $em->getRepository(Pedido::class)->findAllWithRelations();

    $resultado = [];

    $pedidosAgrupados = [];
    foreach ($pedidos as $p) {
        $id = $p['id'];
        if (!isset($pedidosAgrupados[$id])) {
            $pedidosAgrupados[$id] = [
                'id' => $id,
                'estado' => $p['estado'] instanceof \UnitEnum ? $p['estado']->value : $p['estado'],
                'total' => $p['total'],
                'fecha' => $p['creadoEn']?->format('Y-m-d H:i'),
                'lineas' => [],
            ];
        }

        if ($p['platoNombre']) {
            $pedidosAgrupados[$id]['lineas'][] = [
                'plato' => $p['platoNombre'],
                'cantidad' => $p['cantidad'],
                'precio' => $p['precioUnitario'],
            ];
        }
    }

    foreach ($pedidosAgrupados as $pa) {
        $resultado[] = $pa;
    }

    return $this->json($resultado);
}
 
#[Route('/{id}/estado', name: 'api_pedido_estado', methods: ['PUT'])]
public function cambiarEstado(
    int $id,
    Request $request,
    EntityManagerInterface $em
): JsonResponse {
    $pedido = $em->getRepository(Pedido::class)->find($id);

    if (!$pedido) {
        return $this->json(['error' => 'Pedido no encontrado'], 404);
    }

    $datos = json_decode($request->getContent(), true);

    try {
        $nuevoEstado = \App\Enum\EstadoPedidoEnum::from($datos['estado']);
    } catch (\Exception $e) {
        return $this->json(['error' => 'Estado inválido'], 400);
    }

    $pedido->setEstado($nuevoEstado);

    $em->flush();

    return $this->json(['mensaje' => 'Estado actualizado']);
}
}