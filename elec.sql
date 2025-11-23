create table if not exists users (
    id varchar(255) NOT NULL PRIMARY KEY,
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    kind enum('employee', 'supervisor', 'admin') default 'employee',
    is_active boolean default false,
    is_active_code int default null,
    is_active_code_token varchar(255),
    is_active_code_token_expire timestamp null default null,
    password_change_at timestamp null default null,
    password_reset_token varchar(255) null default null,
    password_reset_token_expire timestamp null default null,
    create_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp
);