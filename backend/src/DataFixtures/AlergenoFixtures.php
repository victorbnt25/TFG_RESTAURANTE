<?php

namespace App\DataFixtures;

use App\Entity\Alergeno;
use App\Enum\AlergenoEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AlergenoFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        foreach (AlergenoEnum::cases() as $alergenoEnum) {
            $alergeno = new Alergeno();
            $alergeno->setNombre($alergenoEnum->value);
            $manager->persist($alergeno);
        }

        $manager->flush();
    }
}
