<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Enum\RolUsuarioEnum;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = $request->toArray();

        if (
            empty($data['nombre']) ||
            empty($data['email']) ||
            empty($data['contrasena'])
        ) {
            return $this->json([
                'error' => 'Faltan campos obligatorios'
            ], 400);
        }

        $nombre = trim((string) $data['nombre']);
        $email = mb_strtolower(trim((string) $data['email']));
        $contrasena = (string) $data['contrasena'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json([
                'error' => 'El email no es válido'
            ], 400);
        }

        if (mb_strlen($contrasena) < 6) {
            return $this->json([
                'error' => 'La contraseña debe tener al menos 6 caracteres'
            ], 400);
        }

        $usuarioExistente = $usuarioRepository->findOneBy(['email' => $email]);

        if ($usuarioExistente) {
            return $this->json([
                'error' => 'Ya existe un usuario con ese email'
            ], 409);
        }

        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setEmail($email);

        // IMPORTANTE:
        // El rol SIEMPRE será CLIENTE en el registro público.
        // No se acepta ningún rol enviado desde frontend.
        $usuario->setRol(RolUsuarioEnum::CLIENTE);

        $hash = $passwordHasher->hashPassword($usuario, $contrasena);
        $usuario->setContrasena($hash);

        $em->persist($usuario);
        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Usuario registrado correctamente',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail(),
                'rol' => $usuario->getRol()?->value,
            ]
        ], 201);
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = $request->toArray();

        if (
            empty($data['email']) ||
            empty($data['contrasena'])
        ) {
            return $this->json([
                'error' => 'Email y contraseña son obligatorios'
            ], 400);
        }

        $email = mb_strtolower(trim((string) $data['email']));
        $contrasena = (string) $data['contrasena'];

        $usuario = $usuarioRepository->findOneBy(['email' => $email]);

        if (!$usuario) {
            return $this->json([
                'error' => 'Credenciales incorrectas'
            ], 401);
        }

        if (!$passwordHasher->isPasswordValid($usuario, $contrasena)) {
            return $this->json([
                'error' => 'Credenciales incorrectas'
            ], 401);
        }

        return $this->json([
            'ok' => true,
            'mensaje' => 'Login correcto',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail(),
                'rol' => $usuario->getRol()?->value,
                'estado' => $usuario->getEstado()?->value,
            ]
        ]);
    }
}
