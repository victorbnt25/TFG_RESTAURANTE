<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/contacto')]
class ContactoController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function enviar(Request $request): JsonResponse
    {
        $data = $request->toArray();

        if (
            empty($data['nombre']) ||
            empty($data['email']) ||
            empty($data['mensaje'])
        ) {
            return $this->json([
                'error' => 'Faltan campos obligatorios'
            ], 400);
        }

        $nombre = trim((string) $data['nombre']);
        $email = mb_strtolower(trim((string) $data['email']));
        $mensaje = trim((string) $data['mensaje']);
        $telefono = isset($data['telefono']) && trim((string) $data['telefono']) !== ''
            ? trim((string) $data['telefono'])
            : null;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json([
                'error' => 'El email no es válido'
            ], 400);
        }

        if (mb_strlen($mensaje) < 10) {
            return $this->json([
                'error' => 'El mensaje debe tener al menos 10 caracteres'
            ], 400);
        }

        return $this->json([
            'ok' => true,
            'mensaje' => 'Mensaje de contacto recibido correctamente',
            'contacto' => [
                'nombre' => $nombre,
                'email' => $email,
                'telefono' => $telefono,
                'mensaje' => $mensaje,
            ]
        ], 201);
    }
}

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se crea el endpoint POST /api/contacto.
2. Se validan los campos obligatorios:
   - nombre
   - email
   - mensaje
3. El teléfono queda como campo opcional.
4. Se valida el formato del email.
5. Se valida una longitud mínima del mensaje.
6. De momento el endpoint devuelve una confirmación en JSON.
7. Este controller deja preparada la base para integrar más adelante
   el envío real de correos con Symfony Mailer o con n8n.
*/