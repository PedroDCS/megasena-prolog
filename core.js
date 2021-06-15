// Criar ambiente Prolog do tu vasa
class Prolog {
  constructor() {
      this.session = pl.create();
  }
}
prolog = new Prolog();

// Carregar arquivo fonte
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
                  loadModulos(fatos)
                  //console.log(fatos);
                  //fileContents.style = "display: relative;";
              }
              fileReader.readAsText(fileTobeRead);
          }, false);
      }
      else {
          alert("Arquivo(s) não suportado(s)");
      }
  }

  // Fromatar arquivo fonte
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

// Carregar arquivo fonte no tuvasa
function loadModulos(db){
    prolog.session.consult(db, {
        success: function() { alert('DB Formatado');console.log("DB carregado na tag 'source'") },
        error: function(err) { alert(err) }
    });
}

function search(q){
	// Get program
	var program = document.getElementById("source").innerHTML.replace(/<br>/g,'\n');
	// Clear output
    var result = document.getElementById("resp");
	result.innerHTML = "";
	// Consult program
	prolog.session.consult(program);
	// Query goal
	prolog.session.query(q);
	// Find answers
	prolog.session.answer((answer)=>{
        result.innerHTML = result.innerHTML + "<div>" + prolog.session.format_answer(answer) + "</div>";
    });

}


// Carregar regras pre prontas no tuvasa





// Criar engine para fazer pesquisa
var qTag = document.getElementById('q-prolog')
qTag.addEventListener('keypress', function (e) {
    if(e.key=="Enter"){
        //Faz a pesquisa
        search(qTag.value)
    }
}, false);

function resp(content){
    var tag = document.getElementById('resp')
    tag.innerText = contet
}






