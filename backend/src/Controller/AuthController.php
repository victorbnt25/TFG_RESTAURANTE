<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em,
        UsuarioRepository $usuarioRepo
    ): JsonResponse {
        $data = $request->toArray();

        // 1. Validar campos obligatorios
        if (!isset($data['nombre'], $data['email'], $data['contrasena'])) {
            return $this->json(['error' => 'Faltan campos obligatorios'], 400);
        }

        // 2. Verificar si el email ya existe
        if ($usuarioRepo->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Este correo ya está registrado en el sistema'], 409);
        }

        // 3. Crear el nuevo usuario
        $usuario = new Usuario();
        $usuario->setNombre($data['nombre']);
        $usuario->setEmail($data['email']);
        
        // Hashear la contraseña de forma segura
        $hashedPassword = $hasher->hashPassword($usuario, $data['contrasena']);
        $usuario->setContrasena($hashedPassword);

        // 4. Guardar en la base de datos
        $em->persist($usuario);
        $em->flush();

        return $this->json([
            'ok' => true,
            'mensaje' => 'Usuario registrado correctamente',
            'usuario' => [
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail()
            ]
        ], 201);
    }
    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserPasswordHasherInterface $hasher,
        UsuarioRepository $usuarioRepo
    ): JsonResponse {
        $data = $request->toArray();

        if (!isset($data['email'], $data['contrasena'])) {
            return $this->json(['error' => 'Email y contraseña requeridos'], 400);
        }

        $usuario = $usuarioRepo->findOneBy(['email' => $data['email']]);

        if (!$usuario || !$hasher->isPasswordValid($usuario, $data['contrasena'])) {
            return $this->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->json([
            'ok' => true,
            'mensaje' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'email' => $usuario->getEmail(),
                'rol' => $usuario->getRol()->value
            ]
        ]);
    }
}
