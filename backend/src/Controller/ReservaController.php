<?php

namespace App\Controller;

use App\Entity\Reserva;
use App\Entity\Usuario;
use App\Enum\EstadoMesaEnum;
use App\Enum\EstadoReservaEnum;
use App\Enum\ZonaMesaEnum;
use App\Repository\MesaRepository;
use App\Repository\ReservaRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/reservas')]
class ReservaController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(ReservaRepository $repo): JsonResponse
    {
        $reservas = $repo->findBy([], ['fechaHoraReserva' => 'ASC']);
        $data = [];

        foreach ($reservas as $reserva) {
            $data[] = [
                'id' => $reserva->getId(),
                'nombre' => $reserva->getUsuario()?->getNombre(),
                'email' => $reserva->getUsuario()?->getEmail(),
                'fechaHoraReserva' => $reserva->getFechaHoraReserva()?->format('Y-m-d H:i:s'),
                'numeroPersonas' => $reserva->getNumeroPersonas(),
                'estado' => $reserva->getEstado()?->value,
                'turno' => $reserva->getTurno()?->value,
                'canal' => $reserva->getCanal()?->value,
                'zona' => $reserva->getMesa()?->getZona()?->value,
                'mesa' => $reserva->getMesa()?->getCodigo(),
                'observaciones' => $reserva->getObservaciones(),
            ];
        }

        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        MesaRepository $mesaRepository,
        ReservaRepository $reservaRepository,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = $request->toArray();

        if (
            empty($data['nombre']) ||
            empty($data['email']) ||
            empty($data['fecha']) ||
            empty($data['hora']) ||
            empty($data['numero_personas'])
        ) {
            return $this->json([
                'error' => 'Faltan campos obligatorios'
            ], 400);
        }

        $nombre = trim((string) $data['nombre']);
        $email = mb_strtolower(trim((string) $data['email']));
        $fecha = trim((string) $data['fecha']);
        $hora = trim((string) $data['hora']);
        $numeroPersonas = (int) $data['numero_personas'];
        $observaciones = isset($data['observaciones']) && trim((string) $data['observaciones']) !== ''
            ? trim((string) $data['observaciones'])
            : null;

        $zonaTexto = isset($data['zona']) && trim((string) $data['zona']) !== ''
            ? trim((string) $data['zona'])
            : null;

        if ($numeroPersonas <= 0) {
            return $this->json([
                'error' => 'El número de personas debe ser mayor que 0'
            ], 400);
        }

        $fechaHora = \DateTimeImmutable::createFromFormat('Y-m-d H:i', $fecha . ' ' . $hora);

        if (!$fechaHora) {
            return $this->json([
                'error' => 'Fecha u hora no válidas'
            ], 400);
        }

        $zonaEnum = null;
        if ($zonaTexto) {
            try {
                $zonaEnum = ZonaMesaEnum::from($zonaTexto);
            } catch (\ValueError $e) {
                return $this->json([
                    'error' => 'La zona indicada no es válida'
                ], 400);
            }
        }

        // Buscar o crear usuario automáticamente
        $usuario = $usuarioRepository->findOneBy(['email' => $email]);

        if (!$usuario) {
            $usuario = new Usuario();
            $usuario->setNombre($nombre);
            $usuario->setEmail($email);

            $contrasenaTemporal = bin2hex(random_bytes(12));
            $hash = $passwordHasher->hashPassword($usuario, $contrasenaTemporal);
            $usuario->setContrasena($hash);

            $em->persist($usuario);
        }

        $criteriosMesa = [
            'activo' => true,
            'estado' => EstadoMesaEnum::DISPONIBLE,
        ];

        if ($zonaEnum) {
            $criteriosMesa['zona'] = $zonaEnum;
        }

        $mesas = $mesaRepository->findBy($criteriosMesa, ['capacidad' => 'ASC']);

        if (!$mesas) {
            return $this->json([
                'error' => 'No hay mesas activas disponibles para esa zona'
            ], 404);
        }

        $mesaAsignada = null;

        foreach ($mesas as $mesa) {
            if ($mesa->getCapacidad() < $numeroPersonas) {
                continue;
            }

            $hayConflicto = false;
            $reservasMesa = $reservaRepository->findBy(['mesa' => $mesa]);

            foreach ($reservasMesa as $reservaExistente) {
                if ($reservaExistente->getEstado() === EstadoReservaEnum::CANCELADA) {
                    continue;
                }

                $fechaExistente = $reservaExistente->getFechaHoraReserva();
                $diferenciaSegundos = abs($fechaExistente->getTimestamp() - $fechaHora->getTimestamp());

                // Ventana aproximada de 2 horas
                if ($diferenciaSegundos < 7200) {
                    $hayConflicto = true;
                    break;
                }
            }

            if (!$hayConflicto) {
                $mesaAsignada = $mesa;
                break;
            }
        }

        if (!$mesaAsignada) {
            return $this->json([
                'error' => 'No hay mesas disponibles para esa fecha, hora y zona'
            ], 409);
        }

        $reserva = new Reserva();
        $reserva->setUsuario($usuario);
        $reserva->setMesa($mesaAsignada);
        $reserva->setFechaHoraReserva($fechaHora);
        $reserva->setNumeroPersonas($numeroPersonas);
        $reserva->setObservaciones($observaciones);
        $reserva->setEstado(EstadoReservaEnum::PENDIENTE);

        $em->persist($reserva);
        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Reserva creada correctamente',
            'reserva' => [
                'id' => $reserva->getId(),
                'nombre' => $reserva->getUsuario()?->getNombre(),
                'email' => $reserva->getUsuario()?->getEmail(),
                'fechaHoraReserva' => $reserva->getFechaHoraReserva()?->format('Y-m-d H:i:s'),
                'numeroPersonas' => $reserva->getNumeroPersonas(),
                'estado' => $reserva->getEstado()?->value,
                'canal' => $reserva->getCanal()?->value,
                'zona' => $reserva->getMesa()?->getZona()?->value,
                'mesa' => $reserva->getMesa()?->getCodigo(),
                'observaciones' => $reserva->getObservaciones(),
            ]
        ], 201);
    }

    #[Route('/{id}/cancelar', methods: ['PUT'])]
    public function cancelar(
        int $id,
        ReservaRepository $repo,
        EntityManagerInterface $em
    ): JsonResponse {
        $reserva = $repo->find($id);

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        $reserva->setEstado(EstadoReservaEnum::CANCELADA);
        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Reserva cancelada correctamente'
        ]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        int $id,
        ReservaRepository $repo,
        EntityManagerInterface $em
    ): JsonResponse {
        $reserva = $repo->find($id);

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        $em->remove($reserva);
        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Reserva eliminada correctamente'
        ]);
    }
}

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se adapta el controller a las entidades reales del proyecto.
2. La reserva usa obligatoriamente un Usuario, por lo que:
   - si el email ya existe, se reutiliza ese usuario
   - si no existe, se crea un usuario automáticamente
3. Se usa getFechaHoraReserva() y setFechaHoraReserva() en lugar de getFechaHora().
4. Se usa getCodigo() de Mesa en lugar de getNumero().
5. Se filtran mesas activas y en estado DISPONIBLE.
6. Si el usuario elige zona, se filtran las mesas por esa zona.
7. Se asigna la mesa válida con menor capacidad suficiente.
8. Se evita conflicto de reservas usando una ventana aproximada de 2 horas.
9. Se mantienen los endpoints para listar, cancelar y eliminar reservas.
10. Con este cambio el backend de reservas queda alineado con el modelo real de datos.
*/