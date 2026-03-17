<?php
namespace App\DataFixtures;
use App\Entity\Usuario;
use App\Enum\RolUsuarioEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsuarioAdminFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $usuariosAdmin = [
            [
                'nombre' => 'Victor',
                'email' => 'victor@sonsofburger.com',
                'contrasena' => 'Victor1234',
            ],
            [
                'nombre' => 'Ruben',
                'email' => 'ruben@sonsofburger.com',
                'contrasena' => 'Ruben1234',
            ],
        ];

        foreach ($usuariosAdmin as $datos) {
            $usuarioExistente = $manager
                ->getRepository(Usuario::class)
                ->findOneBy(['email' => mb_strtolower($datos['email'])]);

            if ($usuarioExistente) {
                continue;
            }

            $usuario = new Usuario();
            $usuario->setNombre($datos['nombre']);
            $usuario->setEmail(mb_strtolower($datos['email']));
            $usuario->setRol(RolUsuarioEnum::ADMIN);

            $hash = $this->passwordHasher->hashPassword($usuario, $datos['contrasena']);
            $usuario->setContrasena($hash);

            $manager->persist($usuario);
        }

        $manager->flush();
    }
}
