angular.module('app', [])
    .controller('appController', function ($scope, $http) {

        foto = { nome: "", url: "" };
      //  $scope.fotos = [
      //      { nome: "foto1", url: "Images/imgUploader_1579222493093_1579222508180.jpg" }
      //  ];

        $http.get("/api/fotos")
            .then(function (response) {
                var fotos = [];
                angular.forEach(response.data, function(value, key) {
                    //console.log(key + ': ' + value);

                    foto = {};
                    foto.nome = value;
                    foto.url = "Images/"+value;
                    fotos.push(foto);

                  });
                $scope.fotos = fotos;
            });

        //console.log("Controller carregado...");
    });