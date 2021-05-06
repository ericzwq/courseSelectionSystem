//0.47
`SELECT SQL_CALC_FOUND_ROWS co.id courseId,
        co.name courseName,
        te.name teacherName,
        co.classroom,
        co.selectedCount,
        co.maxCount,
        co.classTime,
        te.id   teacherId,
        co.updatedBy,
        co.createdAt,
        co.updatedAt
 FROM courses co
          INNER JOIN teachers te ON co.teacherId = te.id AND co.name like '%'
     AND te.name like '%' AND classroom like '%'
 ORDER BY co.updatedAt DESC LIMIT 0,10;`

  // 0.45
  `SELECT SQL_CALC_FOUND_ROWS co.id courseId,
          co.name courseName,
          te.name teacherName,
          co.classroom,
          co.selectedCount,
          co.maxCount,
          co.classTime,
          te.id   teacherId,
          co.updatedBy,
          co.createdAt,
          co.updatedAt
   FROM courses co
            INNER JOIN teachers te ON co.teacherId = te.id
   WHERE classroom LIKE '%'
     AND co.name LIKE '%'
     AND te.name LIKE '%'
   ORDER BY co.updatedAt DESC LIMIT 0,10;`

  // 0.41
  `SELECT SQL_CALC_FOUND_ROWS co.id courseId,
          co.name courseName,
          te.name teacherName,
          co.classroom,
          co.selectedCount,
          co.maxCount,
          co.classTime,
          te.id   teacherId,
          co.updatedBy,
          co.createdAt,
          co.updatedAt
   FROM courses co
            INNER JOIN teachers te ON co.teacherId = te.id
   where te.id > ''
   ORDER BY co.updatedAt DESC LIMIT 0,10;`
