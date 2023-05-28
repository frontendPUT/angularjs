var nodeTodo = angular.module("nodeTodo", []);

function mainController($scope, $http) {
  $scope.formData = {};
  $scope.formDataUpdate = {};
  $scope.todos = [];
  $scope.inputs = [];
  $scope.chosenTodo = {};
  $scope.markedTodo = {};
  $scope.done = false;

  $scope.choseTodo = function (todo) {
    $scope.chosenTodo = {
      _id: todo._id,
      text: todo.text,
      done: todo.done,
    };
  };

  // when landing on the page, get all todos and show them
  $http
    .get("/api/todos")
    .success(function (data) {
      $scope.todos = data;
    })
    .error(function (data) {
      console.log("Error: " + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function () {
    $http
      .post("/api/todos", $scope.formData)
      .success(function (data) {
        document.getElementById("newTodo").value = "";
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // update a todo after checking it
  $scope.updateTodo = function (todo) {
    console.log($scope.chosenTodo);
    $http
      .put("/api/todos/" + todo._id, todo)
      .success(function (data) {
        $scope.todos = data;
        $scope.chosenTodo = null;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  $scope.markDone = function (todo) {
    $scope.markedTodo = {
      _id: todo._id,
      text: todo.text,
      done: !todo.done,
    };
    $scope.updateTodo($scope.markedTodo);
  };

  // delete a todo after checking it
  $scope.deleteTodo = function (id) {
    $http
      .delete("/api/todos/" + id)
      .success(function (data) {
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };
}
