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


show tables;
