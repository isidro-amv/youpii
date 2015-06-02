angular.module('youpiiBApp')
  .controller('EditPersonCtrl', function ($scope, $location, Person)  {
    $scope.status = '';
    $scope.person = [];
    $scope.ownerFields = [0];
    $scope.personID = $location.path().split('/').slice(-1)[0];

    Person.get({id:$scope.personID}, function (data) {
      $scope.person = data;
    });

    $scope.addPromo = function () {
      var promoId = prompt("Ingrese el ID de promoción", "");
      if (promoId) {
        $scope.person.promos.push(promoId);
        $scope.person.$update(function (err,data) {
          console.log(err,data);
        },function (err) {
          alert('ID de promooción no válido');
          $scope.person.promos.pop(promoId);
        });
      }
    }

    $scope.deletePromo = function (index) {
      if(index > -1){
        $scope.person.promos.splice(index,1);
        $scope.person.$update(function (err,data) {
          console.log(err,data);
        },function (err) {
          alert('Ocurrió un error en el servidor');
        });
      }
    }

    $scope.update = function (form) {
      $scope.submitted = true;
       if(form.$valid) {
        $scope.person.$update(function () {
          window.alert('Paquete actualizada!');
        });
       }
    };

  });
