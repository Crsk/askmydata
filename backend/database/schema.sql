CREATE SCHEMA `dummydb` DEFAULT CHARACTER SET utf8 ;
USE dummydb;

CREATE TABLE `dummydb`.`branch` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL
);

CREATE TABLE `dummydb`.`seller` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `branch_id` INT NOT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `dummydb`.`branch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `dummydb`.`product` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` decimal(5,2) NOT NULL
);

CREATE TABLE `dummydb`.`customer` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL
);

CREATE TABLE `dummydb`.`invoice` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `seller_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `amount` DECIMAL(5,2) NOT NULL,
  `created_at` DATETIME NULL,
  FOREIGN KEY (`seller_id`) REFERENCES `dummydb`.`seller` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `dummydb`.`customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `dummydb`.`product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO branch (name, address) VALUES
('Branch 1', '123 Main St'),
('Branch 2', '456 Elm St');

INSERT INTO seller (name, branch_id) VALUES
('John Smith', 1),
('Jane Doe', 1),
('Bob Johnson', 2);

-- 5 products random prices
INSERT INTO product (name, price) VALUES
  ('Headphones', ROUND(RAND()*100, 2)),
  ('Jam', ROUND(RAND()*100, 2)),
  ('Peanut Butter', ROUND(RAND()*100, 2)),
  ('iPhone', ROUND(RAND()*100, 2)),
  ('Umbrella', ROUND(RAND()*100, 2));

INSERT INTO customer (name) VALUES
  ('Graciela'),
  ('Alan');

-- Note that John Smith (Branch 1), Graciela and Peanut Butter have more records
INSERT INTO invoice (seller_id, customer_id, product_id, amount, created_at) VALUES
  (1, 1, 1, 23.50, '2023-01-01'),
  (1, 1, 2, 9.75, '2023-01-10'),
  (1, 1, 2, 16.99, '2023-01-20'),
  (1, 1, 3, 11.25, '2023-02-15'),
  (2, 1, 3, 27.00, '2023-02-18'),
  (2, 2, 3, 7.49, '2023-02-27'),
  (3, 2, 4, 12.50, '2023-03-02'),
  (3, 2, 5, 5.99, '2023-03-06');