let students = [
    { name: "Arun", department: "CSE", date: "2023-01-15" },
    { name: "Bala", department: "ECE", date: "2022-11-10" },
    { name: "Charan", department: "MECH", date: "2023-02-20" },
    { name: "Divya", department: "CSE", date: "2022-12-05" },
    { name: "Esha", department: "ECE", date: "2023-03-01" }
];

// DISPLAY TABLE
function displayStudents(data) {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    data.forEach(student => {
        let row = `
            <tr>
                <td>${student.name}</td>
                <td>${student.department}</td>
                <td>${student.date}</td>
            </tr>
        `;
        table.innerHTML += row;
    });

    countDepartments(data);
}

// SORT BY NAME
function sortByName() {
    students.sort((a, b) => a.name.localeCompare(b.name));
    displayStudents(students);
}

// SORT BY DATE
function sortByDate() {
    students.sort((a, b) => new Date(a.date) - new Date(b.date));
    displayStudents(students);
}

// FILTER BY DEPARTMENT
document.getElementById("departmentFilter").addEventListener("change", function () {
    let selectedDept = this.value;

    if (selectedDept === "All") {
        displayStudents(students);
    } else {
        let filtered = students.filter(student => student.department === selectedDept);
        displayStudents(filtered);
    }
});

// COUNT STUDENTS PER DEPARTMENT
function countDepartments(data) {
    let counts = {};

    data.forEach(student => {
        if (counts[student.department]) {
            counts[student.department]++;
        } else {
            counts[student.department] = 1;
        }
    });

    let countSection = document.getElementById("countSection");
    countSection.innerHTML = "";

    for (let dept in counts) {
        countSection.innerHTML += `${dept}: ${counts[dept]} students <br>`;
    }
}

// INITIAL LOAD
displayStudents(students);