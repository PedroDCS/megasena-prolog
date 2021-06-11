// Criar ambiente Prolog do tu vasa
class Prolog {
  constructor() {
      this.session = pl.create();
  }
}

// Carregar arquivo fonte

  
  function create(){//Criar Tag Escondida  
      // Buscar elemento pai
      var body = document.body;

      //Cria a elemento escondido
      var element = document.createElement('div');
      element.setAttribute('id', 'source');
      element.setAttribute('style', 'display: none;');

      // Inserir (anexar) o elemento filho (titulo) ao elemento pai (body)
      body.appendChild(element);
  }
  
  window.onload = function () {
      //Check the support for the File API support
      if (window.File && window.FileReader && window.FileList && window.Blob) {
          var fileSelected = document.getElementById('sourceProlog');
          fileSelected.addEventListener('change', function (e) {
              //Get the file object
              var fileTobeRead = fileSelected.files[0];
              // Ler arquivo
              var fileReader = new FileReader();
              fileReader.onload = function (e) {
                  var fileContents = document.getElementById('source');
                  var fatos = logarquivo(fileReader.result);
                  fileContents.innerText = fatos;
                  console.log(fatos);
                  fileContents.style = "display: relative;";
              }
              fileReader.readAsText(fileTobeRead);
          }, false);
      }
      else {
          alert("Arquivo(s) não suportado(s)");
      }
  }

  function logarquivo(data) {

    var str = String(data).replace(/\s/g, '');

    var patt = /([0-9]{4})\([0-9]{2}\/[0-9]{2}\/[0-9]{4}\)([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/gm;
    var result = str.match(patt);


    const s = new Set(result);


    let arr = [...s];
    var regra = ""

    var fatos = [];
    for (let index = 0; index < arr.length; index++) {
        regra = 'jogo(' + arr[index].substr(0, 4) +
            ',' + arr[index].substr(16, 2) +
            ',' + arr[index].substr(18, 2) +
            ',' + arr[index].substr(20, 2) +
            ',' + arr[index].substr(22, 2) +
            ',' + arr[index].substr(24, 2) +
            ',' + arr[index].substr(26, 2) + ').';
        fatos.push(regra)
    }

    //var fileContents2 = document.getElementById('filecontents2');
    //fileContents2.innerText = fatos;

    var aux = fatos.toString().replace(/\).,/g, ").\n");

    //fileContents2.innerText = aux;
    //document.getElementById('nfatos').innerText = fatos.length+1;

    return aux;

}

// Fromatar arquivo fonte
// Carregar arquivo fonte no tuvasa
// Carregar regras pre prontas no tuvasa

// Criar engine para adicioanr regra
// Criar engine para fazer pesquisa