CREATE TABLE webshop.users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  password varchar(60) NOT NULL,
  name varchar(50) NOT NULL,
  role int NOT NULL DEFAULT 0,
  phone varchar(255) DEFAULT NULL,
  created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  lastlogin datetime DEFAULT NULL,
  profileimage varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 16,
AVG_ROW_LENGTH = 3276,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci;

ALTER TABLE webshop.users
ADD UNIQUE INDEX email (email);