create table
    if not exists users (
        id varchar(255) NOT NULL PRIMARY KEY,
        username varchar(255) not null,
        email varchar(255) not null,
        password varchar(255) not null,
        kind enum (
            'employee',
            'store_manager',
            'supervisor',
            'admin'
        ) default 'employee',
        is_active boolean default false,
        is_active_code int default null,
        is_active_code_token varchar(255),
        is_active_code_token_expire timestamp null default null,
        password_change_at timestamp null default null,
        password_reset_token varchar(255) null default null,
        password_reset_token_expire timestamp null default null,
        create_at timestamp default current_timestamp,
        update_at timestamp default current_timestamp on update current_timestamp,
        index id_idx (id),
        index email_idx (email)
    );

create table
    if not exists categories (
        id varchar(255) not null primary key,
        name varchar(255) not null,
        create_at timestamp default current_timestamp,
        update_at timestamp default current_timestamp on update current_timestamp,
        index id_idx (id),
        index name_idx (name)
    );



create table 
    if not exists products (
        id varchar(255) not null primary key,
        name varchar(255) not null,
        quantity int default 0,
        category_id varchar(255) not null,
        create_at timestamp default current_timestamp,
        update_at timestamp default current_timestamp on update current_timestamp,
        foreign key(category_id) references categories(id) on delete cascade,
        index id_idx(id),
        index name_idx(name)
    );

create table
    if not exists orders (
        id varchar(255) not null primary key,
        productIds JSON default (JSON_ARRAY()),
        confirmed boolean default false,
        user_id varchar(255) not null,
        create_at timestamp default current_timestamp,
        update_at timestamp default current_timestamp on update current_timestamp,
        foreign key(user_id) references users(id) on delete cascade,
        index id_idx(id)
    );


-- insert order query
-- insert into orders (id, productIds, user_id) values ('id', JSON_ARRAY('id1', 'id2'), 'userId');

DELIMITER $$

CREATE TRIGGER validate_products_before_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE missing INT DEFAULT 0;
    DECLARE idx INT DEFAULT 0;
    DECLARE productId VARCHAR(255);

    -- Loop through each element in the JSON array
    WHILE idx < JSON_LENGTH(NEW.productIds) DO

        SET productId = JSON_VALUE(NEW.productIds, CONCAT('$[', idx, ']'));

        -- Check if product exists
        IF (SELECT COUNT(*) FROM products WHERE id = productId) = 0 THEN
            SET missing = 1;
        END IF;

        SET idx = idx + 1;
    END WHILE;

    IF missing = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'One or more product IDs do not exist';
    END IF;
END$$

DELIMITER ;


show tables;
