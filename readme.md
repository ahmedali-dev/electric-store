create table if not exists blocks (
  id varchar(255) primary key,
  name varchar(100) not null unique,
  create_at timestamp default current_timestamp,
  update_at timestamp default current_timestamp 
);

--insert into blocks (id, name) values ('1', '1'),('2', '2'), ('3', '3');

create table if not exists zones(
id varchar(255) primary key,
  name varchar(100) not null unique,
block_id varchar(255) not null,
  create_at timestamp default current_timestamp,
  update_at timestamp default current_timestamp ,
foreign key(block_id) references blocks(id)
);

--insert into zones (id,name,block_id) values ('zone-1', 'zone-1', '1'), ('zone-2', 'zone-2','1'), ('zone-3','zone-3', '2');
--drop table builds;
--drop table buildTypes;
create table if not exists buildTypes(
id varchar(255) primary key,
  name varchar(100) not null unique,
valid_quantity int not null,
  create_at timestamp default current_timestamp,
  update_at timestamp default current_timestamp
);

--insert into buildTypes (id,name,valid_quantity) values ('type-1', 'type-1', 44), ('type-2','type-2', 4), ('type-3', 'type-3',100);
--drop table builds;
create table if not exists builds(
id varchar(255) primary key,
  name varchar(100) not null unique,
  zone_id varchar(255) not null,
  buildType_id varchar(255) not null,
block_id varchar(255) not null,
  create_at timestamp default current_timestamp,
  update_at timestamp default current_timestamp ,
  foreign key(zone_id) references zones(id),
  foreign key(buildType_id) references buildTypes(id),
foreign key(block_id) references blocks(id)

);

--insert into builds(id, name,zone_id, buildType_id, block_id) values ('build-3', 'build-3', 'zone-2', 'type-2', '2');



SELECT IIF(500<1000, "YES", "NO");

select b.name, z.name, l.name, t.name, t.valid_quantity, IIF(t.valid_quantity > 3, 'confirm', 'reject') as valid
from builds b
left join zones z on z.id = b.zone_id
left join blocks l on l.id = b.block_id
left join buildTypes t on t.id = b.buildType_id






