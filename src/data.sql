CREATE DATABASE nodeAPI DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
--if doesn't work, try "use nodeAPI" in this line to select created database
CREATE TABLE tasks (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
description VARCHAR(64) NOT NULL,
completed TINYINT(1) NOT NULL DEFAULT 0,
created DATETIME NOT NULL DEFAULT NOW(),
last_updated DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW()
);
