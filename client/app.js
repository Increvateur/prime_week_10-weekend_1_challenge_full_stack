var employeeData = {};
var employeeArray = [];

$(document).ready(function() {

  // Gets the initial list of users, if any, from the database
  $.ajax({
  type: 'GET',
  url: '/employees',
  success: function(data) {
    employeeArray = data;
    salaryCalc();
    initialDisplay();
  }

  });

  // Listens for when the user clicks the "Submit" button
  $("#salaryForm").on("submit", function(event){
    event.preventDefault();

    // Adds the input fields into an object
    var formArray = $('form').serializeArray();
    formArray.forEach(function(element){
      employeeData[element.name] = element.value;
    });

    // Sets the newly added employee status to "Active"
    employeeData.status = "active";

    // Clears out the form.
    $('#salaryForm').find('input[type=text]').val('');
    $('#salaryForm').find('input[type=number]').val('');

    // Starts the process of posting employee data to the database
    postData(employeeData);

  });
});

// Communicates with the database and posts employee data
function postData(input) {
  $.ajax({
  type: 'POST',
  url: '/employees',
  data: input,
  success: postResponse(input)
  });
}

// Processes the response from the database server
function postResponse(response) {
  employeeArray.push(response);
  salaryCalc();
  console.log(employeeArray);
  console.log(response);
  displayInfo(response);
}

// This calculates the amount paid monthly in salaries.
function salaryCalc(){
  var finalSalary = 0
  for (var i = 0; i < employeeArray.length; i++){
    var employee = employeeArray[i];
    finalSalary += parseInt(employee.salary) / 12;
  };

  $('.total-monthly').text('Money Spent Monthly on Employee Salaries: $' + Math.round(finalSalary));

}

// Sets the initial display of users, if any, when the page loads
function initialDisplay(){

  for (var i = 0; i < employeeArray.length; i++) {
    $(".employee-display").append('<div class="employee-' + (i + 1) + ' person"></div>');
    var $el = $(".employee-display").children().last();
    $el.append("<li>" + employeeArray[i].firstname + " " + employeeArray[i].lastname + "</li>");
    $el.append("<li>Employee ID: " + employeeArray[i].employeeid + "</li>");
    $el.append("<li>Job Title: " + employeeArray[i].jobtitle + "</li>");
    $el.append("<li>Yearly Salary: $" + employeeArray[i].salary + "</li>");

  }

};

// This displays the employee information that was entered
function displayInfo(employee){

  $(".employee-display").append('<div class="employee-' + employeeArray.length + ' person"></div>');
  var $el = $(".employee-display").children().last();

  $el.append("<li>" + employee.firstname + " " + employee.lastname + "</li>");
  $el.append("<li>Employee ID: " + employee.employeeid + "</li>");
  $el.append("<li>Job Title: " + employee.jobtitle + "</li>");
  $el.append("<li>Yearly Salary: $" + employee.salary + "</li>");

};
