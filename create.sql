/*数据库*/
drop
    database if exists courseselection;
create
    database courseSelection;
use
    courseselection;

# 修改列
# alter table students modify id bigint;
# ALTER TABLE students CHANGE COLUMN id id INT(8) NOT NULL AUTO_INCREMENT;
# ALTER TABLE materials modify COLUMN createdBy varchar(10) not null,modify COLUMN updatedBy varchar(10) not null default '--';
# 删除列
# alter table students drop username,drop c2;

/*课程表*/
drop table if exists courses;
create table courses
(
    id            int(11) auto_increment primary key not null,
    name          varchar(10)                        not null,
    teacherId     bigint                             not null,
    classroom     varchar(10)                        not null,
    selectedCount int(5)                             not null,
    maxCount      int(5)                             not null,
    classTime     date                               not null,
    createdBy     varchar(10)                        not null,
    updatedBy     varchar(10)                        not null default '--',
    createdAt     timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt     timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create
    index idx_name on courses (name);

/*教师表*/
drop table if exists teachers;
create table teachers
(
    id        bigint auto_increment primary key not null,
    name      varchar(10)                       not null,
    sex       varchar(2)                        not null,
    phone     varchar(11),
    email     varchar(18),
    password  varchar(18)                       not null,
    status    int(1)                            not null default 1,
    createdAt timestamp                         not null default current_timestamp comment '创建时间',
    updatedAt timestamp                         not null default current_timestamp on update current_timestamp comment '修改时间'
);
create
    index idx_name on teachers (name);
# create
#     index idx_username on teachers (username);
create
    index idx_email on teachers (email);

/*学生表*/
drop table if exists students;
create table students
(
    id        bigint auto_increment primary key not null,
    name      varchar(10)                       not null,
    sex       varchar(2)                        not null,
    phone     varchar(11),
    email     varchar(18),
    password  varchar(18)                       not null,
    status    int(1)                            not null default 1,
    createdAt timestamp                         not null default current_timestamp comment '创建时间',
    updatedAt timestamp                         not null default current_timestamp on update current_timestamp comment '修改时间'
);

create
    index idx_name on students (name);
# create
#     index idx_username on students (username);
create
    index idx_email on students (email);

/*成绩表*/
drop table if exists scores;
create table scores
(
    id        int(11) auto_increment primary key not null,
    studentId bigint                             not null,
    courseId  int(11)                            not null,
    score     decimal(4, 1)                      not null,
    createdBy varchar(10)                        not null,
    updatedBy varchar(10)                        not null default '--',
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create
    index idx_score on scores (score);

/*管理员*/
drop table if exists admins;
create table admins
(
    id        bigint auto_increment primary key not null,
    name      varchar(10)                       not null,
    sex       varchar(2)                        not null,
    phone     varchar(11),
    email     varchar(18),
    password  varchar(18)                       not null,
    status    int(1)                            not null default 1,
    createdAt timestamp                         not null default current_timestamp comment '创建时间',
    updatedAt timestamp                         not null default current_timestamp on update current_timestamp comment '修改时间'
);
# create
#     index idx_username on admins (username);
create
    index idx_email on admins (email);

/*材料表*/
drop table if exists materials;
create table materials
(
    id        int auto_increment primary key not null,
    filename  varchar(50)                    not null,
    url       varchar(100)                   not null,
    size      varchar(10)                    not null,
    scoreId   int(11)                        not null,
    createdBy varchar(10)                    not null,
    updatedBy varchar(10)                    not null default '--',
    createdAt timestamp                      not null default current_timestamp comment '创建时间',
    updatedAt timestamp                      not null default current_timestamp on update current_timestamp comment '修改时间'
);
set time_zone = '+8:00';
# 学生 200103030201 教师 990102030201 管理员 900102030201
insert courses(name, teacherId, classroom, selectedCount, maxCount, classTime, createdBy)
values ('生物科学', 990102030201, '6教学楼', 1, 100, '2021-6-30', '李杰1');

insert teachers(id, name, sex, password)
values (990102030201, '李杰', '男', '111111'),
(990102030202, '张琳', '女', '111111'),
(990102030203, '李妤', '女', '111111');

insert students(id, name, sex, password)
values (200102030201, '孙无', '男', '111111'),
(200102030202, '张三', '女', '111111'),
(200102030203, '赵中', '男', '111111');

insert scores(studentId, courseId, score, createdBy)
values (200102030201, 1, 90, '李杰1');

insert admins(id, name, sex, password)
values (900102030201, '管理员', '男', '111111');

insert materials(fileName, url, size, scoreId, createdBy)
values ('成绩详情', 'http://localhost:3000/bk-assets/upload/1.png', 14599, 1, '李杰1');
