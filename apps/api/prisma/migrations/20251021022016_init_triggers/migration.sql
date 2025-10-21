-- Triggers do MiForge (idempotentes)

DROP TRIGGER IF EXISTS `oncreate_accounts`;

CREATE TRIGGER `oncreate_accounts`
AFTER INSERT ON `accounts`
FOR EACH ROW
  INSERT INTO `account_vipgroups` (`account_id`, `name`, `customizable`)
  VALUES
    (NEW.`id`, 'Enemies', 0),
    (NEW.`id`, 'Friends', 0),
    (NEW.`id`, 'Trading Partner', 0);

DROP TRIGGER IF EXISTS `oncreate_guilds`;

CREATE TRIGGER `oncreate_guilds`
AFTER INSERT ON `guilds`
FOR EACH ROW
  INSERT INTO `guild_ranks` (`name`, `level`, `guild_id`)
  VALUES
    ('The Leader', 3, NEW.`id`),
    ('Vice-Leader', 2, NEW.`id`),
    ('Member', 1, NEW.`id`);

DROP TRIGGER IF EXISTS `ondelete_players`;

CREATE TRIGGER `ondelete_players`
BEFORE DELETE ON `players`
FOR EACH ROW
  UPDATE `houses` SET `owner` = 0 WHERE `owner` = OLD.`id`;