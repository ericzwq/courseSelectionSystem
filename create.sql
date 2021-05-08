/*课程表*/
-- create table courses (courseId int(11) auto_increment primary key not null,courseName varchar(20),
-- teacherId int(11),classroom varchar(20),selectedCount int(5),maxCount int(5),
-- created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
-- updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间');
insert courses(courseName, teacherId, classroom, selectedCount, maxCount)
values ('生物科学', 1, '6教学楼', 0, 100);

/*教师表*/
-- create table teachers (id int(11) auto_increment primary key not null,name varchar(20),username varchar(20),
-- phone varchar(20),password varchar(50),created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
-- CURRENT_TIMESTAMP COMMENT '创建时间',updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间');
insert teachers(name, username, phone, password)
values ('李杰', 'teacher', '18945948394', '123456');

/*学生表*/
-- create table students (id int(11) auto_increment primary key not null,name varchar(20),phone varchar(20),
-- username varchar(20),password varchar(50),selectedCourseId varchar(100),created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
-- CURRENT_TIMESTAMP COMMENT '创建时间',updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间');
insert students(name, phone, username, password, selectedCourseId)
values ('孙无', '15593749832', 'student', '123456', NULL);

/*成绩表*/
-- create table scores (stuId int(11) not null,courseId int(11) not null,score int(3) not null,
-- created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
-- updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间');
insert scores(stuId, courseId, score)
values (1, 1, 90);

/*管理员*/
-- create table admins (id int(11) auto_increment primary key not null,name varchar(20),username varchar(20),phone varchar(20),
-- password varchar(50),created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
-- updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间');
insert admins(name, username, phone, password)
values ('管理员', 'admin', '18948394839', '123456');