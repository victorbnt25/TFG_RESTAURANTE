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

/*
CAMBIOS REALIZADOS EN ESTE ARCHIVO

1. Se crea un fixture específico para los usuarios administradores del proyecto.
2. Se insertan dos cuentas fijas:
   - Victor
   - Ruben
3. Ambos usuarios se guardan con rol ADMIN.
4. La contraseña se guarda hasheada usando el password hasher de Symfony.
5. Se comprueba si el email ya existe para no duplicar usuarios.
6. Este fixture permite disponer siempre de cuentas administradoras para acceder al panel.
7. Los datos se guardan en la base de datos igual que el resto de fixtures del proyecto.



Lo que haría yo

Crearía una cuenta tipo:

sonsofburger.tfg@gmail.com

o sonsofburger.reservas@gmail.com

Y esa cuenta la usaría para:

confirmaciones de reserva

avisos internos

recordatorios

pruebas de n8n
*/