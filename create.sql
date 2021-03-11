/*数据库*/
drop database if exists courseselection;
create database courseSelection;
use courseselection;

/*课程表*/
drop table if exists courses;
create table courses
(
    id            int(11) auto_increment primary key not null,
    name          varchar(20)                        not null,
    teacherId     int(11)                            not null,
    classroom     varchar(20)                        not null,
    selectedCount int(5)                             not null,
    maxCount      int(5)                             not null,
    classTime     date                               not null,
    createdBy     varchar(20)                        not null,
    updatedBy     varchar(20)                        not null default '--',
    createdAt     timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt     timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create index idx_name on courses (name);

/*教师表*/
drop table if exists teachers;
create table teachers
(
    id        int(11) auto_increment primary key not null,
    name      varchar(20)                        not null,
    sex       varchar(2)                         not null,
    username  varchar(20)                        not null,
    phone     varchar(20)                        not null,
    email     varchar(30)                        not null,
    password  varchar(20)                        not null,
    status    int(1)                             not null default 1,
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create index idx_name on teachers (name);
create index idx_username on teachers (username);
create index idx_email on teachers (email);

/*学生表*/
drop table if exists students;
create table students
(
    id        int(11) auto_increment primary key not null,
    name      varchar(20)                        not null,
    sex       varchar(2)                         not null,
    phone     varchar(20)                        not null,
    email     varchar(30)                        not null,
    username  varchar(20)                        not null,
    password  varchar(20)                        not null,
    status    int(1)                             not null default 1,
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create index idx_name on students (name);
create index idx_username on students (username);
create index idx_email on students (email);

/*成绩表*/
drop table if exists scores;
create table scores
(
    id        int(11) auto_increment primary key not null,
    studentId int(11)                            not null,
    courseId  int(11)                            not null,
    score     decimal(4, 1)                      not null,
    createdBy varchar(20)                        not null,
    updatedBy varchar(20)                        not null default '--',
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create index idx_score on scores (score);

/*管理员*/
drop table if exists admins;
create table admins
(
    id        int(11) auto_increment primary key not null,
    name      varchar(20)                        not null,
    sex       varchar(2)                         not null,
    username  varchar(20)                        not null,
    phone     varchar(20)                        not null,
    email     varchar(30)                        not null,
    password  varchar(20)                        not null,
    status    int(1)                             not null default 1,
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);
create index idx_username on admins (username);
create index idx_email on admins (email);

/*材料表*/
drop table if exists materials;
create table materials
(
    id        int(11) auto_increment primary key not null,
    filename  varchar(50)                        not null,
    url       varchar(100)                       not null,
    size      varchar(20)                        not null,
    scoreId   int(11)                            not null,
    createdBy varchar(20)                        not null,
    updatedBy varchar(20)                        not null default '--',
    createdAt timestamp                          not null default current_timestamp comment '创建时间',
    updatedAt timestamp                          not null default current_timestamp on update current_timestamp comment '修改时间'
);

insert courses(name, teacherId, classroom, selectedCount, maxCount, classTime, createdBy)
values ('生物科学', 1, '6教学楼', 1, 100, '2021-6-30', '李杰1');

insert teachers(name, sex, username, phone, email, password)
values ('李杰', '男', 'teacher', '18945948394', '231396236@qq.com', '123456');

insert students(name, sex, phone, username, email, password)
values ('孙无', '男', '15593749832', 'student', '231396236@qq.com', '123456');

insert scores(studentId, courseId, score, createdBy)
values (1, 1, 90, '李杰1');

insert admins(name, sex, username, phone, email, password)
values ('管理员', '男', 'admin', '18948394839', '231396236@qq.com', '123456');

insert materials(fileName, url, size, scoreId, createdBy)
values ('成绩详情', 'http://localhost:3000/bk-assets/upload/1.png', 14599, 1, '李杰1');
