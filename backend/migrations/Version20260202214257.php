<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260202214257 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE alergenos (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, UNIQUE INDEX uniq_alergenos_nombre (nombre), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE lineas_pedido (id INT AUTO_INCREMENT NOT NULL, cantidad SMALLINT NOT NULL, precio_unitario NUMERIC(10, 2) NOT NULL, pedido_id INT NOT NULL, plato_id INT NOT NULL, INDEX IDX_D2DE2C134854653A (pedido_id), INDEX IDX_D2DE2C13B0DB09EF (plato_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE mesas (id INT AUTO_INCREMENT NOT NULL, codigo VARCHAR(10) NOT NULL, capacidad SMALLINT NOT NULL, zona VARCHAR(255) NOT NULL, estado VARCHAR(255) NOT NULL, activo TINYINT NOT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, UNIQUE INDEX uniq_mesas_codigo (codigo), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE pagos (id INT AUTO_INCREMENT NOT NULL, metodo VARCHAR(255) NOT NULL, estado VARCHAR(255) NOT NULL, importe NUMERIC(10, 2) NOT NULL, referencia VARCHAR(120) DEFAULT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, pedido_id INT NOT NULL, INDEX IDX_DA9B0DFF4854653A (pedido_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE pedidos (id INT AUTO_INCREMENT NOT NULL, estado VARCHAR(255) NOT NULL, total NUMERIC(10, 2) NOT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, usuario_id INT DEFAULT NULL, reserva_id INT DEFAULT NULL, INDEX IDX_6716CCAADB38439E (usuario_id), UNIQUE INDEX UNIQ_6716CCAAD67139E8 (reserva_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE platos (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(160) NOT NULL, descripcion VARCHAR(800) DEFAULT NULL, precio NUMERIC(10, 2) NOT NULL, tipo VARCHAR(255) NOT NULL, disponibilidad VARCHAR(255) NOT NULL, activo TINYINT NOT NULL, imagen_url VARCHAR(500) DEFAULT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE platos_alergenos (plato_id INT NOT NULL, alergeno_id INT NOT NULL, INDEX IDX_3762847BB0DB09EF (plato_id), INDEX IDX_3762847B3E89035 (alergeno_id), PRIMARY KEY (plato_id, alergeno_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE reservas (id INT AUTO_INCREMENT NOT NULL, fecha_hora_reserva DATETIME NOT NULL, numero_personas SMALLINT NOT NULL, estado VARCHAR(255) NOT NULL, turno VARCHAR(255) DEFAULT NULL, canal VARCHAR(255) NOT NULL, observaciones VARCHAR(500) DEFAULT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, usuario_id INT NOT NULL, mesa_id INT NOT NULL, INDEX IDX_AA1DAB01DB38439E (usuario_id), INDEX IDX_AA1DAB018BDC7AE9 (mesa_id), INDEX idx_reservas_fecha (fecha_hora_reserva), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE usuarios (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(120) NOT NULL, email VARCHAR(180) NOT NULL, contrasena VARCHAR(255) NOT NULL, rol VARCHAR(255) NOT NULL, estado VARCHAR(255) NOT NULL, creado_en DATETIME NOT NULL, actualizado_en DATETIME NOT NULL, UNIQUE INDEX uniq_usuarios_email (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE lineas_pedido ADD CONSTRAINT FK_D2DE2C134854653A FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE lineas_pedido ADD CONSTRAINT FK_D2DE2C13B0DB09EF FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE pagos ADD CONSTRAINT FK_DA9B0DFF4854653A FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE pedidos ADD CONSTRAINT FK_6716CCAADB38439E FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE pedidos ADD CONSTRAINT FK_6716CCAAD67139E8 FOREIGN KEY (reserva_id) REFERENCES reservas (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE platos_alergenos ADD CONSTRAINT FK_3762847BB0DB09EF FOREIGN KEY (plato_id) REFERENCES platos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE platos_alergenos ADD CONSTRAINT FK_3762847B3E89035 FOREIGN KEY (alergeno_id) REFERENCES alergenos (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reservas ADD CONSTRAINT FK_AA1DAB01DB38439E FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reservas ADD CONSTRAINT FK_AA1DAB018BDC7AE9 FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON DELETE RESTRICT');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lineas_pedido DROP FOREIGN KEY FK_D2DE2C134854653A');
        $this->addSql('ALTER TABLE lineas_pedido DROP FOREIGN KEY FK_D2DE2C13B0DB09EF');
        $this->addSql('ALTER TABLE pagos DROP FOREIGN KEY FK_DA9B0DFF4854653A');
        $this->addSql('ALTER TABLE pedidos DROP FOREIGN KEY FK_6716CCAADB38439E');
        $this->addSql('ALTER TABLE pedidos DROP FOREIGN KEY FK_6716CCAAD67139E8');
        $this->addSql('ALTER TABLE platos_alergenos DROP FOREIGN KEY FK_3762847BB0DB09EF');
        $this->addSql('ALTER TABLE platos_alergenos DROP FOREIGN KEY FK_3762847B3E89035');
        $this->addSql('ALTER TABLE reservas DROP FOREIGN KEY FK_AA1DAB01DB38439E');
        $this->addSql('ALTER TABLE reservas DROP FOREIGN KEY FK_AA1DAB018BDC7AE9');
        $this->addSql('DROP TABLE alergenos');
        $this->addSql('DROP TABLE lineas_pedido');
        $this->addSql('DROP TABLE mesas');
        $this->addSql('DROP TABLE pagos');
        $this->addSql('DROP TABLE pedidos');
        $this->addSql('DROP TABLE platos');
        $this->addSql('DROP TABLE platos_alergenos');
        $this->addSql('DROP TABLE reservas');
        $this->addSql('DROP TABLE usuarios');
    }
}
