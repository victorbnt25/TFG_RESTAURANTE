<?php

namespace App\Command;

use App\Entity\LineaPedido;
use App\Entity\Mesa;
use App\Entity\Pedido;
use App\Entity\Plato;
use App\Entity\Reserva;
use App\Entity\Usuario;
use App\Enum\EstadoPedidoEnum;
use App\Enum\EstadoReservaEnum;
use App\Enum\CanalReservaEnum;
use App\Enum\TurnoServicioEnum;
use App\Enum\RolUsuarioEnum;
use App\Enum\EstadoUsuarioEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed-defensa',
    description: 'Genera 10 usuarios con 3 reservas y 1 pedido cada uno para la defensa del TFG.',
)]
class SeedDefensaCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Iniciando seed de defensa...');

        $mesas = $this->em->getRepository(Mesa::class)->findAll();
        if (empty($mesas)) {
            $output->writeln('Error: No hay mesas en la base de datos.');
            return Command::FAILURE;
        }

        $bebidas = $this->em->createQuery("SELECT p FROM App\Entity\Plato p JOIN p.categoria c WHERE c.nombre LIKE '%Bebida%'")->getResult();
        $hamburguesas = $this->em->createQuery("SELECT p FROM App\Entity\Plato p JOIN p.categoria c WHERE c.nombre LIKE '%Hamburguesa%' OR c.nombre LIKE '%Carne%'")->getResult();
        $entrantes = $this->em->createQuery("SELECT p FROM App\Entity\Plato p JOIN p.categoria c WHERE c.nombre LIKE '%Entrante%'")->getResult();
        $postres = $this->em->createQuery("SELECT p FROM App\Entity\Plato p JOIN p.categoria c WHERE c.nombre LIKE '%Postre%'")->getResult();

        if (empty($bebidas) || empty($hamburguesas) || empty($entrantes) || empty($postres)) {
            $output->writeln('Error: Faltan platos en alguna de las categorías necesarias.');
            return Command::FAILURE;
        }

        $nombres = ['Carlos Perez', 'Ana Gomez', 'Luis Fernandez', 'Maria Martinez', 'Jorge Sanchez', 'Lucia Diaz', 'Miguel Torres', 'Elena Ruiz', 'David Romero', 'Carmen Alonso'];

        // Generar las 3 fechas. Una es hoy (14 de mayo de 2026), otras dos en días futuros que no sean lunes
        // La consigna dice que los 10 tienen una reserva "hoy"
        $fechas = [
            new \DateTimeImmutable('2026-05-14 14:00'), // Hoy
            new \DateTimeImmutable('2026-05-15 21:00'), // Mañana (Viernes)
            new \DateTimeImmutable('2026-05-16 14:30')  // Pasado (Sábado)
        ];

        for ($i = 0; $i < 10; $i++) {
            $usuario = new Usuario();
            $usuario->setNombre($nombres[$i]);
            $usuario->setEmail('defensa' . $i . '@tfg.es');
            $usuario->setTelefono('60000000' . $i);
            $usuario->setRol(RolUsuarioEnum::CLIENTE);
            $usuario->setEstado(EstadoUsuarioEnum::ACTIVO);
            $hashed = $this->hasher->hashPassword($usuario, 'defensa123');
            $usuario->setContrasena($hashed);

            $this->em->persist($usuario);

            // Crear 3 reservas
            foreach ($fechas as $index => $fecha) {
                $reserva = new Reserva();
                $reserva->setUsuario($usuario);
                $reserva->setFechaHoraReserva($fecha);
                $reserva->setNumeroPersonas(2);
                $reserva->setEstado(EstadoReservaEnum::CONFIRMADA);
                $reserva->setCanal(CanalReservaEnum::WEB);
                $reserva->addMesa($mesas[$index % count($mesas)]); // Asignar una mesa
                
                $this->em->persist($reserva);
            }

            // Crear 1 pedido
            $pedido = new Pedido();
            $pedido->setUsuario($usuario);
            $pedido->setEstado(EstadoPedidoEnum::ENTREGADO);
            $pedido->setMesa($mesas[$i % count($mesas)]);
            
            // Random items sin repetir combinación total.
            // Para asegurar aleatoriedad en cada usuario:
            $bebida = $bebidas[$i % count($bebidas)];
            $hamburguesa = $hamburguesas[$i % count($hamburguesas)];
            $entrante = $entrantes[$i % count($entrantes)];
            $postre = $postres[$i % count($postres)];

            $platosElegidos = [$bebida, $hamburguesa, $entrante, $postre];
            $total = 0;

            foreach ($platosElegidos as $plato) {
                $linea = new LineaPedido();
                $linea->setPlato($plato);
                $linea->setCantidad(1);
                $linea->setPrecioUnitario($plato->getPrecio());
                $pedido->addLinea($linea);

                $total += $plato->getPrecio();
            }

            $pedido->setTotal((string)$total);
            $this->em->persist($pedido);
        }

        $this->em->flush();

        $output->writeln('¡Seed de defensa completado con éxito! Se han creado 10 usuarios, 30 reservas y 10 pedidos.');

        return Command::SUCCESS;
    }
}
