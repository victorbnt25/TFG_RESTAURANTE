<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260412163438 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE INDEX idx_mesas_activo ON mesas (activo)');
        $this->addSql('CREATE INDEX idx_mesas_estado ON mesas (estado)');
        $this->addSql('CREATE INDEX idx_mesas_zona ON mesas (zona)');
        $this->addSql('CREATE INDEX idx_pedidos_estado ON pedidos (estado)');
        $this->addSql('CREATE INDEX idx_platos_activo ON platos (activo)');
        $this->addSql('CREATE INDEX idx_platos_tipo ON platos (tipo)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX idx_mesas_activo ON mesas');
        $this->addSql('DROP INDEX idx_mesas_estado ON mesas');
        $this->addSql('DROP INDEX idx_mesas_zona ON mesas');
        $this->addSql('DROP INDEX idx_pedidos_estado ON pedidos');
        $this->addSql('DROP INDEX idx_platos_activo ON platos');
        $this->addSql('DROP INDEX idx_platos_tipo ON platos');
    }
}
