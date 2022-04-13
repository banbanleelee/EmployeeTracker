-- View All Departments
SELECT department_name AS Department
    FROM departments
    ORDER BY id;

-- View All Roles
SELECT title AS Title, salary AS Salary
    FROM roles
    ORDER BY id;

-- View All Employees
SELECT employees.id AS ID, employees.first_name AS FirstName, employees.last_name AS LastName, departments.department_name AS Department, roles.title AS Title, roles.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employees
    LEFT JOIN employees m 
    ON employees.manager_id = m.id OR employees.manager_id = NULL
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN departments 
    ON roles.department_id = departments.id
    ORDER BY employees.id;

