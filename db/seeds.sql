INSERT INTO departments (department_name)
VALUES ("Accounting"),
       ("Finance"),
       ("Human Resources"),
       ("Management"),
       ("Marketing"),
       ("Technology");

INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 30000, 1),
       ("Marketer", 25000, 5),
       ("Senior Accountant", 40000, 1),
       ("Senior Marketer", 45000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Williams", 1, 2),
       ("Jane", "Doe", 3, NULL),
       ("Sally", "Zhang", 2, 4),
       ("Annie", "White", 4, Null);
       
