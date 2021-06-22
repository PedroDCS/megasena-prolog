// Criar ambiente Prolog do tau prolog
class Prolog {
  constructor() {
      this.session = pl.create();
  }
}
prolog = new Prolog();

// Cria o link para o botao de Carregar arquivo fonte
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
                  var fatos = loadFile(fileReader.result);
                  fileContents.innerText = fatos;
                  //loadModulos(fatos)
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
function loadFile(data) {
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
    var aux = fatos.toString().replace(/\).,/g, ").\n");
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
    var rules = document.getElementById("regras").innerHTML.replace(/<br>/g,'\n');
    var query = document.getElementById('q-prolog').value
	// Clear output
    var result = document.getElementById("resp");
	result.innerHTML = "";
	// Find answers
    var db = program+'\n'+rules;
    prolog.session.consult(db, {
        success: function() {
            prolog.session.query(query, {
                success: function() {
                    prolog.session.answers(resp);
                },
                error: function(err) { console.log("ERRO Query");console.log(err) }
            })
        },
        error: function(err) { console.log("ERRO PROGRAMA");console.log(err) }
    });
}


// Carregar regras pre prontas no tuvasa
function loadRules(rule){
    prolog.session.consult(rule, {
        success: function() { alert('Regra Carregada'); },
        error: function(err) { alert(err) }
    });
}

var rTag = document.getElementById('r-prolog')
rTag.addEventListener('keypress', function (e) {
    if(e.key=="Enter"){
        //Cria a regra na sessão
        prolog.session.consult(rTag.value, {
            success: function() {
               alert("Regra criada")
            },
            error: function(err) { console.log(err) }
        });


    }
}, false);






function regras(){
    //O número X já foi sorteado alguma vez? Por exemplo: numero_sorteado(2).
    var regra1 = "numero_sorteado(Number) :- jogo(_,Number,_,_,_,_,_) ; jogo(_,_,Number,_,_,_,_) ; jogo(_,_,_,Number,_,_,_) ; jogo(_,_,_,_,Number,_,_) ; jogo(_,_,_,_,_,Number,_) ; jogo(_,_,_,_,_,_,Number). "
    //
    var regra2 = "" 
    var regras = regra1 + regra2
    var fileContents = document.getElementById('regras');
    fileContents.innerText = regras;

}
regras()

// Criar engine para fazer pesquisa
var qTag = document.getElementById('q-prolog')
qTag.addEventListener('keypress', function (e) {
    if(e.key=="Enter"){
        //Faz a pesquisa
        search(qTag.value)
    }
}, false);


// Persistir resutlado na tela
function resp(answer){
    content = prolog.session.format_answer(answer)
    var tag = document.getElementById('resp')
    tag.innerText = tag.innerText + '\n'+content
}