<?php

namespace App\DataFixtures;

use App\Entity\Categoria;
use App\Entity\Plato;
use App\Enum\DisponibilidadPlatoEnum;
use App\Enum\TipoPlatoEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // CATEGORÍAS
        $categoriaEntrantes = (new Categoria())
            ->setNombre('Entrantes')
            ->setDescripcion('Para empezar')
            ->setActiva(true);

        $categoriaHamburguesas = (new Categoria())
            ->setNombre('Hamburguesas')
            ->setDescripcion('Nuestras burgers')
            ->setActiva(true);

        $categoriaPostres = (new Categoria())
            ->setNombre('Postres')
            ->setDescripcion('El final perfecto')
            ->setActiva(true);

        $categoriaBebidas = (new Categoria())
            ->setNombre('Bebidas')
            ->setDescripcion('Para acompañar')
            ->setActiva(true);

        $manager->persist($categoriaEntrantes);
        $manager->persist($categoriaHamburguesas);
        $manager->persist($categoriaPostres);
        $manager->persist($categoriaBebidas);

        // PLATOS
        $plato1 = (new Plato())
            ->setNombre('Nachos completos')
            ->setDescripcion('Nachos con queso, guacamole y salsa especial')
            ->setPrecio('8.50')
            ->setTipo(TipoPlatoEnum::ENTRANTE)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/nachos.jpg')
            ->setCategoria($categoriaEntrantes);

        $plato2 = (new Plato())
            ->setNombre('Tequeños')
            ->setDescripcion('Tequeños crujientes con salsa')
            ->setPrecio('7.00')
            ->setTipo(TipoPlatoEnum::ENTRANTE)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/tequenos.jpg')
            ->setCategoria($categoriaEntrantes);

        $plato3 = (new Plato())
            ->setNombre('Burger clásica')
            ->setDescripcion('Carne, queso, lechuga y salsa de la casa')
            ->setPrecio('11.90')
            ->setTipo(TipoPlatoEnum::PRINCIPAL)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/burger-clasica.jpg')
            ->setCategoria($categoriaHamburguesas);

        $plato4 = (new Plato())
            ->setNombre('Burger bacon')
            ->setDescripcion('Hamburguesa con bacon crujiente y cheddar')
            ->setPrecio('13.50')
            ->setTipo(TipoPlatoEnum::PRINCIPAL)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/burger-bacon.jpg')
            ->setCategoria($categoriaHamburguesas);

        $plato5 = (new Plato())
            ->setNombre('Tarta de queso')
            ->setDescripcion('Tarta cremosa con base de galleta')
            ->setPrecio('5.90')
            ->setTipo(TipoPlatoEnum::POSTRE)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/tarta-queso.jpg')
            ->setCategoria($categoriaPostres);

        $plato6 = (new Plato())
            ->setNombre('Coca-Cola')
            ->setDescripcion('Refresco frío')
            ->setPrecio('2.80')
            ->setTipo(TipoPlatoEnum::BEBIDA)
            ->setDisponibilidad(DisponibilidadPlatoEnum::DISPONIBLE)
            ->setActivo(true)
            ->setImagenUrl('/fotos/cocacola.jpg')
            ->setCategoria($categoriaBebidas);

        $manager->persist($plato1);
        $manager->persist($plato2);
        $manager->persist($plato3);
        $manager->persist($plato4);
        $manager->persist($plato5);
        $manager->persist($plato6);

        $manager->flush();
    }
}
