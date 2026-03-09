<?php

namespace App\Controller;

// Importamos lo que necesitamos
use App\Entity\Reserva;                    // La entidad Reserva (la tabla 'reservas')
use App\Entity\Usuario;                    // La entidad Usuario (la tabla 'usuarios')
use App\Enum\CanalReservaEnum;             // Enum: WEB, TELEFONO, PRESENCIAL
use App\Enum\EstadoReservaEnum;            // Enum: PENDIENTE, CONFIRMADA, CANCELADA...
use App\Enum\TurnoServicioEnum;            // Enum: COMIDA, CENA
use App\Enum\ZonaMesaEnum;                 // Enum: SALA, TERRAZA, BARRA, PRIVADO
use App\Repository\ReservaRepository;      // Para buscar reservas en la BBDD
use App\Repository\MesaRepository;         // Para buscar mesas en la BBDD
use App\Repository\UsuarioRepository;      // Para buscar usuarios en la BBDD
use Doctrine\ORM\EntityManagerInterface;   // Para guardar cosas en la BBDD
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// Todas las rutas de este controller empiezan por /api/reservas
#[Route('/api/reservas')]
final class ReservaController extends AbstractController
{
    // ============================================================
    // LISTAR TODAS LAS RESERVAS
    // URL: GET /api/reservas
    // ============================================================
    #[Route('', methods: ['GET'])]
    public function list(ReservaRepository $repo): JsonResponse
    {
        // Traemos todas las reservas usando JOIN para evitar cargar mesas/usuarios de uno en uno
        $reservas = $repo->findAllWithRelations();

        // Las convertimos a array para devolverlas como JSON
        $data = [];
        foreach ($reservas as $r) {
            $data[] = [
                'id'              => $r->getId(),
                'nombre_cliente'  => $r->getUsuario()->getNombre(),
                'mesa'            => $r->getMesa()->getCodigo(),
                'zona'            => $r->getMesa()->getZona()->value,
                'fecha_hora'      => $r->getFechaHoraReserva()->format('Y-m-d H:i'),
                'numero_personas' => $r->getNumeroPersonas(),
                'estado'          => $r->getEstado()->value,
            ];
        }

        return $this->json($data);
    }

    // ============================================================
    // CREAR UNA RESERVA
    // URL: POST /api/reservas
    // El frontend envía un JSON con: fecha, hora, numero_personas,
    // nombre, email, y opcionalmente zona y observaciones
    // ============================================================
    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        MesaRepository $mesaRepo,
        UsuarioRepository $usuarioRepo
    ): JsonResponse {

        // Leemos el JSON que envía el frontend
        $data = $request->toArray();

        // Comprobamos que vienen los campos obligatorios
        if (!isset($data['fecha'], $data['hora'], $data['numero_personas'], $data['nombre'], $data['email'])) {
            return $this->json(['error' => 'Faltan campos obligatorios'], 400);
        }

        // Juntamos fecha + hora en un objeto DateTime
        $fechaHora   = new \DateTimeImmutable($data['fecha'] . ' ' . $data['hora']);
        $numPersonas = (int) $data['numero_personas'];

        // Límite de personas configurado (1-6 para reservas online)
        if ($numPersonas > 6) {
            return $this->json(['error' => 'Para reservas de más de 6 personas, por favor llame directamente al restaurante.'], 400);
        }

        // Buscamos una mesa que tenga capacidad suficiente
        $mesa = $mesaRepo->findOneBy(['activo' => true], ['capacidad' => 'ASC']);
        if (!$mesa) {
            return $this->json(['error' => 'No hay mesas disponibles'], 409);
        }

        // Buscamos si el usuario ya existe por su email
        $usuario = $usuarioRepo->findOneBy(['email' => $data['email']]);

        // Si no existe, creamos uno nuevo
        if (!$usuario) {
            $usuario = new Usuario();
            $usuario->setNombre($data['nombre']);
            $usuario->setEmail($data['email']);
            $usuario->setContrasena(password_hash('temporal', PASSWORD_BCRYPT));
            $em->persist($usuario);
        }

        // Creamos la reserva
        $reserva = new Reserva();
        $reserva->setUsuario($usuario);
        $reserva->setMesa($mesa);
        $reserva->setFechaHoraReserva($fechaHora);
        $reserva->setNumeroPersonas($numPersonas);
        $reserva->setEstado(EstadoReservaEnum::CONFIRMADA);
        $reserva->setCanal(CanalReservaEnum::WEB);

        // Si envió observaciones, las guardamos
        if (isset($data['observaciones'])) {
            $reserva->setObservaciones($data['observaciones']);
        }

        // Guardamos en la base de datos
        $em->persist($reserva);
        $em->flush();

        // Respondemos al frontend
        return $this->json([
            'ok'      => true,
            'mensaje' => 'Reserva creada',
            'id'      => $reserva->getId(),
        ], 201);
    }

    // ============================================================
    // CANCELAR UNA RESERVA
    // URL: PUT /api/reservas/5/cancelar
    // ============================================================
    #[Route('/{id}/cancelar', methods: ['PUT'])]
    public function cancelar(int $id, ReservaRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        // Buscamos la reserva por ID
        $reserva = $repo->find($id);
        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        // Cambiamos el estado a CANCELADA y guardamos
        $reserva->setEstado(EstadoReservaEnum::CANCELADA);
        $em->flush();

        return $this->json(['ok' => true, 'mensaje' => 'Reserva cancelada']);
    }

    // ============================================================
    // ELIMINAR UNA RESERVA
    // URL: DELETE /api/reservas/5
    // ============================================================
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, ReservaRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        // Buscamos la reserva por ID
        $reserva = $repo->find($id);
        if (!$reserva) {
            return $this->json(['error' => 'Reserva no encontrada'], 404);
        }

        // La eliminamos de la base de datos
        $em->remove($reserva);
        $em->flush();

        return $this->json(['ok' => true, 'mensaje' => 'Reserva eliminada']);
    }
}
