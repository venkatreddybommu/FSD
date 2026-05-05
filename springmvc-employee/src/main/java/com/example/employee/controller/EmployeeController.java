package com.example.employee.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.employee.model.Employee;

@Controller
public class EmployeeController {

    @GetMapping("/employee")
    public String showEmployee(Model model) {

        Employee emp = new Employee();
        emp.setId(101);
        emp.setName("Venkat");
        emp.setDepartment("IT");

        model.addAttribute("emp", emp);

        return "employee";
    }

}