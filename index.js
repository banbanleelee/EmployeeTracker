const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Jiaduobao00..',
      database: 'employees_db'
    }
);

const initDb = () => {
    db.connect((err) => {
      if (err) throw err;
      console.log("connected to the database");
      console.log("Welcome to the employee management system");
    });
  };
  
initDb();

const options = [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit'
        ],
    }
];

const departmentCreation = [
    {
        type: 'input',
        name: 'department_name',
        message: 'What is the name of the department?',
    },
];

showOptions = () => {
    inquirer
        .prompt(options)
        .then((data) => {
                if (data.options === 'View all departments') {
                    viewDepartments();
                } else if (data.options === 'View all roles') {
                    viewRoles();
                } else if (data.options === 'View all employees') {
                    viewEmployees();
                } else if (data.options === 'Add a department') {
                    addDepartment();
                } else if (data.options === 'Add a role') {
                    addRole();
                } else if (data.options === 'Add an employee') {
                    addEmployee();
                } else if (data.options === 'Update an employee role') {
                    updateEmployee();
                } else if (data.options === 'Quit') {
                    closeApp();
                }
        });
};

viewDepartments = async () => {
    await db.connect(function(err) {
        if (err) throw err;
    db.query(`SELECT department_name AS Department
    FROM departments
    ORDER BY id;`, function (err, result) {
        if (err) throw err;
        console.log(cTable.getTable(result));
    })
    });
    showOptions();
};

viewRoles = () => {
    db.connect(function(err) {
        if (err) throw err;
    db.query(`SELECT title AS Title, salary AS Salary
    FROM roles
    ORDER BY id;`, function (err, result) {
        if (err) throw err;
        console.log(cTable.getTable(result));
    })
    });
    showOptions();
};

viewEmployees = () => {
    db.connect(function(err) {
        if (err) throw err;
        db.query(`SELECT employees.id AS ID, employees.first_name AS FirstName, employees.last_name AS LastName, departments.department_name AS Department, roles.title AS Title, roles.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager
        FROM employees
        LEFT JOIN employees m 
        ON employees.manager_id = m.id OR employees.manager_id = NULL
        LEFT JOIN roles
        ON employees.role_id = roles.id
        LEFT JOIN departments 
        ON roles.department_id = departments.id
        ORDER BY employees.id;`, function (err, result) {
            if (err) throw err;
            console.log(cTable.getTable(result));
        })
    });
    showOptions();
};

addDepartment = () => {
    inquirer
    .prompt(departmentCreation)
    .then((data) => {
        db.connect(function(err) {
            if (err) throw err;
            db.query(`INSERT INTO departments (department_name)
            VALUES ("${data.department_name}");`, function (err, result) {
                if (err) throw err;
                console.log(`The new department ${data.department_name} is successfully added!`);
                viewDepartments();
            })
        });
    });
};

addRole = () => {
    db.connect(function(err) {
        if (err) throw err;
        db.query(`SELECT department_name from departments`, function (err, result) {
            if (err) throw err;
            const departments = [];
            result.forEach(function(obj) {
                departments.push(obj.department_name);
            });
            const roleCreation = [
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does the role belong to?',
                    choices: departments,
                },
            ];
            inquirer
            .prompt(roleCreation)
            .then((data) => {
                const departmentId = departments.indexOf(`${data.department}`)+1;
                db.query(`INSERT INTO roles (title, salary, department_id)
                VALUES ("${data.title}", ${data.salary}, ${departmentId});`, function (err, result) {
                if (err) throw err;
                console.log(`The new role of ${data.title} in the ${data.department} department is successfully added!`);
                viewRoles();
            })
            });
        })
    });
};

addEmployee = () => {
    db.connect(function(err) {
        if (err) throw err;
        db.query(`SELECT title AS Title FROM roles;`, function (err, rolesResult) {
            if (err) throw err;
            const roles = [];
            rolesResult.forEach(function(obj) {
                roles.push(obj.Title)
            });
            console.log('roles', roles);

            db.query(`SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Name FROM employees`, function (err, employeesResult) {
                if (err) throw err;
                const employees = [];
                employeesResult.forEach(function(obj) {
                    employees.push(obj.Name);
                });
                console.log('employees', employees);

                const employeeCreation = [
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the employee\'s first name?',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the employee\'s last name?',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employee\'s manager?',
                        choices: employees.concat('NULL'),
                    },
                ];

                inquirer
                    .prompt(employeeCreation)
                    .then((data) => {
                        const roleId = roles.indexOf(`${data.role}`)+1;
                        const managerId = employees.indexOf(`${data.manager}`)+1;
                        console.log('roleid', roleId, 'managerid', managerId);
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES ("${data.first_name}", "${data.last_name}", ${roleId}, ${managerId});`, function (err, result) {
                        if (err) throw err;
                        console.log(`The new employee ${data.first_name} ${data.last_name} is successfully added!`);
                        viewEmployees();
                    })
                });
            })
        })
    });
};

updateEmployee = () => {
    db.connect(function(err) {
        if (err) throw err;
        db.query(`SELECT title AS Title FROM roles;`, function (err, rolesResult) {
            if (err) throw err;
            const roles = [];
            rolesResult.forEach(function(obj) {
                roles.push(obj.Title)
            });
            console.log('roles', roles);

            db.query(`SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Name FROM employees`, function (err, employeesResult) {
                if (err) throw err;
                const employees = [];
                employeesResult.forEach(function(obj) {
                    employees.push(obj.Name);
                });
                console.log('employees', employees);

                const employeeCreation = [
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee do you want to update?',
                        choices: employees,
                    },
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the employee\'s first name?',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the employee\'s last name?',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employee\'s manager?',
                        choices: employees.concat('NULL'),
                    },
                ];

                inquirer
                    .prompt(employeeCreation)
                    .then((data) => {
                        const roleId = roles.indexOf(`${data.role}`)+1;
                        const managerId = employees.indexOf(`${data.manager}`)+1;
                        const employeeId = employees.indexOf(`${data.employee}`)+1;
                        console.log('roleid', roleId, 'managerid', managerId, 'employeeId', employeeId);
                        db.query(`UPDATE employees
                        SET first_name = "${data.first_name}", last_name = "${data.last_name}", role_id = ${roleId}, manager_id = ${managerId}
                        WHERE id = ${employeeId};`, function (err, result) {
                        if (err) throw err;
                        console.log(`The new employee ${data.first_name} ${data.last_name} is successfully added!`);
                        viewEmployees();
                    })
                });
            })
        })
    });
};

closeApp = () => {
    console.log("Thank you, goodbye.");
  };
  
showOptions();
