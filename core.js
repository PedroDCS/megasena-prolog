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
                    fileContents.innerText = fileReader.result;
                }
                fileReader.readAsText(fileTobeRead);
            }, false);
        }
        else {
            alert("Arquivo(s) não suportado(s)");
        }
    }

// Fromatar arquivo fonte
// Carregar arquivo fonte no tuvasa
// Carregar regras pre prontas no tuvasa

// Criar engine para adicioanr regra
// Criar engine para fazer pesquisa

