CREATE SCHEMA `dummydb` DEFAULT CHARACTER SET utf8 ;
USE dummydb;

CREATE TABLE `branch` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL
);

CREATE TABLE `seller` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `branch_id` INT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`) ON DELETE SET NULL
);

CREATE TABLE `customer` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL
);

CREATE TABLE `invoice` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `seller_id` INT NULL,
  `customer_id` INT NULL,
  `created_at` DATETIME NULL,
  `branch_id` INT NULL,
  `total` DECIMAL(6, 2) NOT NULL,
  `customer_feedback` VARCHAR(200) NULL,
  FOREIGN KEY (`seller_id`) REFERENCES `seller` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`) ON DELETE SET NULL
);

CREATE TABLE `product` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` decimal(5,2) NOT NULL
);

CREATE TABLE `invoice_item` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `invoice_id` INT NOT NULL,
  `product_id` INT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE SET NULL
);


INSERT INTO branch (name, address)
VALUES
    ('Downtown', '123 Main St'),
    ('Uptown', '456 Broadway');

INSERT INTO seller (name, branch_id)
VALUES
    ('John Smith', 1),
    ('Mary Johnson', 2),
    ('David Brown', 1);

INSERT INTO customer (id, name)
VALUES
    (1, 'Emily Johnson'),
    (2, 'Daniel Lee');

INSERT INTO product (name, price)
VALUES
    ('Electric Guitar', 500.00),
    ('Acoustic Drums', 700.00),
    ('Electronic Keyboard', 400.00),
    ('Electric Bass', 550.00),
    ('Guitar Amplifier', 300.00);

INSERT INTO invoice (created_at, seller_id, customer_id, branch_id, total, customer_feedback)
VALUES
    ('2022-01-01 10:00:00', 1, 1, 1, '1200', 'The seller was very friendly and knowledgeable about the products.'),
    ('2022-01-02 11:00:00', 2, 1, 2, '400', 'The instrument I bought sounded a bit off, but the seller offered to adjust it for me free of charge.'),
    ('2022-01-03 12:00:00', 3, 1, 1, '850', 'It was a wonderful shopping experience, the seller helped me choose the best instrument for me.'),
    ('2022-01-04 13:00:00', 1, 2, 1, '500', 'I bought an instrument that turned out to be harder to play than I expected, but the seller gave me some helpful tips.'),
    ('2022-01-05 14:00:00', 2, 2, 2, '700', 'The seller gave me a good deal on a used instrument that I was looking for.'),
    ('2022-01-06 15:00:00', 3, 2, 1, '400', 'The instrument I bought arrived with some marks, but the seller offered me an additional discount.'),
    ('2022-01-07 16:00:00', 1, 1, 1, '550', 'The seller let me try out several instruments and gave me their expert opinion.'),
    ('2022-01-08 17:00:00', 2, 1, 2, '300', 'I bought a case for my instrument that turned out to be too small, but the seller allowed me to exchange it for a larger one.'),
    ('2022-01-09 18:00:00', 3, 2, 1, '500', 'The seller was very attentive and helped me choose the right accessories for my instrument.'),
    ('2022-01-10 19:00:00', 1, 2, 1, '700', 'The seller gave me a good discount on a display instrument that I was looking for.');

INSERT INTO invoice_item (invoice_id, product_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (3, 5),
    (4, 1),
    (5, 2),
    (6, 3),
    (7, 4),
    (8, 5),
    (9, 1),
    (10, 2);