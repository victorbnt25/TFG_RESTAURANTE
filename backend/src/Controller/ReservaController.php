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
        // Pillamos todas las reservas de la base de datos y las ordenamos por fecha
        $reservas = $repo->findBy([], ['fechaHoraReserva' => 'ASC']);
        $data = [];

        // Recorremos cada reserva para prepararla para el JSON
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
                'telefono' => $reserva->getUsuario()?->getTelefono(),
                'observaciones' => $reserva->getObservaciones(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/usuario/{email}', methods: ['GET'], requirements: ['email' => '.+'])]
    public function getByUsuario(string $email, ReservaRepository $repo, UsuarioRepository $userRepo): JsonResponse
    {
        $usuario = $userRepo->findOneBy(['email' => $email]);
        if (!$usuario) {
            return $this->json([]);
        }

        $reservas = $repo->findBy(['usuario' => $usuario], ['fechaHoraReserva' => 'DESC']);
        $data = [];

        foreach ($reservas as $reserva) {
            $data[] = [
                'id' => $reserva->getId(),
                'fechaHoraReserva' => $reserva->getFechaHoraReserva()?->format('Y-m-d H:i:s'),
                'numeroPersonas' => $reserva->getNumeroPersonas(),
                'estado' => $reserva->getEstado()?->value,
                'mesa' => $reserva->getMesa()?->getCodigo(),
                'telefono' => $usuario->getTelefono(),
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
        // Transformamos lo que nos llega del frontend en un array
        $data = $request->toArray();

        if (
            empty($data['nombre']) ||
            empty($data['email']) ||
            empty($data['fecha']) ||
            empty($data['hora']) ||
            empty($data['numero_personas'])
        ) {
            // Si falta algo básico, paramos y avisamos al usuario
            return $this->json([
                'error' => 'Pilla todos los campos, que falta alguno'
            ], 400);
        }

        // Limpiamos los textos y convertimos lo que haga falta
        $nombre = trim((string) $data['nombre']);
        $email = mb_strtolower(trim((string) $data['email']));
        $telefono = isset($data['telefono']) ? trim((string) $data['telefono']) : null;
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

        // Juntamos fecha y hora en un solo objeto para poder guardarlo
        $fechaHora = \DateTimeImmutable::createFromFormat('Y-m-d H:i', $fecha . ' ' . $hora);

        // Si el formato que nos han mandado está mal, saltamos aquí
        if (!$fechaHora) {
            return $this->json([
                'error' => 'Fecha u hora no válidas'
            ], 400);
        }

        // VALIDACIONES DE NEGOCIO (TFG)
        $diaSemana = (int) $fechaHora->format('N'); // 1 (Lunes) a 7 (Domingo)
        $horaFmt = $fechaHora->format('H:i');

        // 1. Lunes cerrado
        if ($diaSemana === 1) {
            return $this->json(['error' => 'El restaurante permanece cerrado los lunes.'], 403);
        }

        // 2. Horario general (12:00 a 00:00)
        if ($horaFmt < '12:00' || $horaFmt > '23:59') {
            return $this->json(['error' => 'Nuestro horario es de 12:00 a 00:00.'], 403);
        }

        // 3. Cierre de cocina (23:30)
        if ($horaFmt > '23:30') {
            return $this->json(['error' => 'No se aceptan reservas después de las 23:30 por cierre de cocina.'], 403);
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

        // Aquí miramos si el cliente ya existe por el email
        // Si no está, lo creamos del tirón para que pueda reservar
        $usuario = $usuarioRepository->findOneBy(['email' => $email]);

        if (!$usuario) {
            $usuario = new Usuario();
            $usuario->setNombre($nombre);
            $usuario->setEmail($email);
            $usuario->setTelefono($telefono);

            // Si es nuevo, le generamos una contraseña al azar para cumplir con la entidad
            $contrasenaTemporal = bin2hex(random_bytes(12));
            $hash = $passwordHasher->hashPassword($usuario, $contrasenaTemporal);
            $usuario->setContrasena($hash);

            // Lo metemos en el EntityManager para guardarlo luego
            $em->persist($usuario);
        } else {
            // Si el usuario ya existe, actualizamos su teléfono si nos pasan uno nuevo
            if ($telefono) {
                $usuario->setTelefono($telefono);
            }
        }

        // Filtramos solo mesas que estén activas y que no tengan averías o algo así
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

        // Ahora toca buscar una mesa libre que sirva para este grupo
        $mesaAsignada = null;

        foreach ($mesas as $mesa) {
            // Si la mesa es pequeña para el grupo, pasamos a la siguiente
            if ($mesa->getCapacidad() < $numeroPersonas) {
                continue;
            }

            // Miramos si esta mesa ya tiene dueño en ese horario
            $hayConflicto = false;
            $reservasMesa = $reservaRepository->findBy(['mesa' => $mesa]);

            foreach ($reservasMesa as $reservaExistente) {
                if ($reservaExistente->getEstado() === EstadoReservaEnum::CANCELADA) {
                    continue;
                }

                $fechaExistente = $reservaExistente->getFechaHoraReserva();
                $diferenciaSegundos = abs($fechaExistente->getTimestamp() - $fechaHora->getTimestamp());

                // Ventana aproximada de 90 minutos (5400 seg)
                if ($diferenciaSegundos < 5400) {
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
            error_log("CONFLICTO RESERVA: No hay mesas disponibles para " . $numeroPersonas . " personas en la fecha " . $fechaHora->format('Y-m-d H:i'));
            return $this->json([
                'error' => 'No tenemos mesas disponibles a la hora seleccionada'
            ], 409);
        }

        $reserva = new Reserva();
        $reserva->setUsuario($usuario);
        $reserva->setMesa($mesaAsignada);
        $reserva->setFechaHoraReserva($fechaHora);
        $reserva->setNumeroPersonas($numeroPersonas);
        $reserva->setObservaciones($observaciones);
        $reserva->setEstado(EstadoReservaEnum::PENDIENTE);

        // Guardamos todo de golpe con el flush
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
                'telefono' => $reserva->getUsuario()?->getTelefono(),
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
    #[Route('/{id}', methods: ['PUT', 'PATCH'])]
    public function update(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        MesaRepository $mesaRepository,
        ReservaRepository $reservaRepository
    ): JsonResponse {
        $reserva = $reservaRepository->find($id);

        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        $data = $request->toArray();
        
        // Si la reserva ya está cancelada, no dejamos editarla por seguridad
        if ($reserva->getEstado() === EstadoReservaEnum::CANCELADA) {
            return $this->json(['error' => 'No se puede editar una reserva cancelada'], 400);
        }

        // Pillamos los datos opcionales
        $fecha = $data['fecha'] ?? null;
        $hora = $data['hora'] ?? null;
        $numeroPersonas = isset($data['numero_personas']) ? (int) $data['numero_personas'] : null;
        $telefono = $data['telefono'] ?? null;
        $observaciones = $data['observaciones'] ?? null;

        $cambiaAlgoCritico = ($fecha || $hora || $numeroPersonas);

        // Si cambian fecha/hora/personas, tenemos que validar disponibilidad
        if ($cambiaAlgoCritico) {
            $nuevaFecha = $fecha ?: $reserva->getFechaHoraReserva()->format('Y-m-d');
            $nuevaHora = $hora ?: $reserva->getFechaHoraReserva()->format('H:i');
            $nuevoNumPersonas = $numeroPersonas ?: $reserva->getNumeroPersonas();

            $nuevaFechaHora = \DateTimeImmutable::createFromFormat('Y-m-d H:i', $nuevaFecha . ' ' . $nuevaHora);
            if (!$nuevaFechaHora) {
                return $this->json(['error' => 'Formato de fecha u hora inválido'], 400);
            }

            // VALIDACIONES DE NEGOCIO (TFG) - También en Update para que no se salten las reglas
            $diaSemana = (int) $nuevaFechaHora->format('N');
            $horaFmt = $nuevaFechaHora->format('H:i');

            if ($diaSemana === 1) {
                return $this->json(['error' => 'El restaurante permanece cerrado los lunes.'], 403);
            }

            if ($horaFmt < '12:00' || $horaFmt > '23:59') {
                return $this->json(['error' => 'Nuestro horario es de 12:00 a 00:00.'], 403);
            }

            if ($horaFmt > '23:30') {
                return $this->json(['error' => 'No se aceptan reservas después de las 23:30 por cierre de cocina.'], 403);
            }

            // Buscamos mesas disponibles
            $mesas = $mesaRepository->findBy([
                'activo' => true,
                'estado' => EstadoMesaEnum::DISPONIBLE
            ], ['capacidad' => 'ASC']);

            $mesaAsignada = null;
            foreach ($mesas as $mesa) {
                if ($mesa->getCapacidad() < $nuevoNumPersonas) continue;

                $hayConflicto = false;
                $reservasMesa = $reservaRepository->findBy(['mesa' => $mesa]);

                foreach ($reservasMesa as $resExistente) {
                    if ($resExistente->getId() === $reserva->getId() || $resExistente->getEstado() === EstadoReservaEnum::CANCELADA) {
                        continue;
                    }

                $diferencia = abs($resExistente->getFechaHoraReserva()->getTimestamp() - $nuevaFechaHora->getTimestamp());
                // Ventana aproximada de 90 minutos (5400 seg)
                if ($diferencia < 5400) { 
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
                return $this->json(['error' => 'No tenemos mesas disponibles a la hora seleccionada'], 409);
            }

            $reserva->setFechaHoraReserva($nuevaFechaHora);
            $reserva->setNumeroPersonas($nuevoNumPersonas);
            $reserva->setMesa($mesaAsignada);
        }

        if ($observaciones !== null) {
            $reserva->setObservaciones($observaciones);
        }

        if ($telefono !== null) {
            $reserva->getUsuario()?->setTelefono($telefono);
        }

        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Reserva actualizada correctamente',
            'reserva' => [
                'id' => $reserva->getId(),
                'fechaHoraReserva' => $reserva->getFechaHoraReserva()->format('Y-m-d H:i:s'),
                'numeroPersonas' => $reserva->getNumeroPersonas(),
                'mesa' => $reserva->getMesa()?->getCodigo(),
                'observaciones' => $reserva->getObservaciones()
            ]
        ]);
    }
}
