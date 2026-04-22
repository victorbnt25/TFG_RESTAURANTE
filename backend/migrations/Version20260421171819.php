<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260421171819 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE reserva_mesa (reserva_id INT NOT NULL, mesa_id INT NOT NULL, INDEX IDX_387CB3F9D67139E8 (reserva_id), INDEX IDX_387CB3F98BDC7AE9 (mesa_id), PRIMARY KEY (reserva_id, mesa_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE reserva_mesa ADD CONSTRAINT FK_387CB3F9D67139E8 FOREIGN KEY (reserva_id) REFERENCES reservas (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reserva_mesa ADD CONSTRAINT FK_387CB3F98BDC7AE9 FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE pedidos ADD mesa_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE pedidos ADD CONSTRAINT FK_6716CCAA8BDC7AE9 FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_6716CCAA8BDC7AE9 ON pedidos (mesa_id)');
        $this->addSql('ALTER TABLE reservas DROP FOREIGN KEY `FK_AA1DAB018BDC7AE9`');
        $this->addSql('DROP INDEX IDX_AA1DAB018BDC7AE9 ON reservas');
        $this->addSql('ALTER TABLE reservas DROP mesa_id');
        $this->addSql('ALTER TABLE usuarios ADD telefono VARCHAR(20) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reserva_mesa DROP FOREIGN KEY FK_387CB3F9D67139E8');
        $this->addSql('ALTER TABLE reserva_mesa DROP FOREIGN KEY FK_387CB3F98BDC7AE9');
        $this->addSql('DROP TABLE reserva_mesa');
        $this->addSql('ALTER TABLE pedidos DROP FOREIGN KEY FK_6716CCAA8BDC7AE9');
        $this->addSql('DROP INDEX IDX_6716CCAA8BDC7AE9 ON pedidos');
        $this->addSql('ALTER TABLE pedidos DROP mesa_id');
        $this->addSql('ALTER TABLE reservas ADD mesa_id INT NOT NULL');
        $this->addSql('ALTER TABLE reservas ADD CONSTRAINT `FK_AA1DAB018BDC7AE9` FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON UPDATE NO ACTION');
        $this->addSql('CREATE INDEX IDX_AA1DAB018BDC7AE9 ON reservas (mesa_id)');
        $this->addSql('ALTER TABLE usuarios DROP telefono');
    }
}
