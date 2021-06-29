var session = pl.create();

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
                loadModulos(fatos);
                document.getElementById("corposite").style = "display: relative";
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
function loadModulos(db) {
    console.log(regras_f);
    var database = ":- use_module(library(lists)).\n" + regras_f + db;
    session.consult(database, {
        success: function () { console.log("DB carregado na tag 'source'") },
        error: function (err) { console.log(err) }
    });
}

// Criar engine para fazer pesquisa
var qTag = document.getElementById('q-prolog')
qTag.addEventListener('keypress', function (e) {
    if (e.key == "Enter") {
        //Faz a pesquisa
        search(qTag.value)
    }
}, false);

var rTag = document.getElementById('r-prolog')
rTag.addEventListener('keypress', function (e) {
    if (e.key == "Enter") {
        //Cria a regra na sessão
        session.consult(rTag.value, {
            success: function () {
                alert("Regra criada");
                document.getElementById("regras").innerText += "\n\n" + rTag.value;
            },
            error: function (err) { console.log(err) }
        });


    }
}, false);

let regras_f = '';
function regras() {
    var nl = '\n\n'
    var aux = '';
    //O número X já foi sorteado alguma vez? Por exemplo: numero_sorteado(2).
    var regra1 = "numero_sorteado(Number) :- jogo(_,Number,_,_,_,_,_) ; jogo(_,_,Number,_,_,_,_) ; jogo(_,_,_,Number,_,_,_) ; jogo(_,_,_,_,Number,_,_) ; jogo(_,_,_,_,_,Number,_) ; jogo(_,_,_,_,_,_,Number). "
    //Qual número nunca foi sorteado? Por exemplo: sorteado(X).
    aux = aux + "sorteado1(X, N) :- (\\+numero_sorteado(X), N is X).\n" +
        "sorteadoN(1, X) :- (\\+numero_sorteado(1),X is 1) ; true.\n" +
        "sorteadoN(N, X) :-  (N >0,N<61), N1 is N-1,sorteadoN(N1,X),((\\+numero_sorteado(N), X is N) ; true).\n"

    var regra2 = "sorteado(X,N):- (integer(X),sorteado1(X, N)) ; (\\+integer(X),sorteadoN(60, N))."

    aux = aux + "\n jogo(Jogo,Number) :- jogo(Jogo,Number,_,_,_,_,_) ; jogo(Jogo,_,Number,_,_,_,_) ; jogo(Jogo,_,_,Number,_,_,_) ; jogo(Jogo,_,_,_,Number,_,_) ; jogo(Jogo,_,_,_,_,Number,_) ; jogo(Jogo,_,_,_,_,_,Number).\n" +
        "dif(N1,N2,N3,N4,N5,N6) :- N1 =\\= N2, N1 =\\= N3, N1 =\\= N4, N1 =\\= N5, N1 =\\= N6, N2 =\\= N3, N2 =\\= N4, N2 =\\= N5, N2 =\\= N6, N3 =\\= N4, N3 =\\= N5, N3 =\\= N6, N4 =\\= N5, N4 =\\= N6, N5 =\\= N6 , !. \n"

    //O jogo (X1,X2,X3,X4,X5,X6) já foi contemplado alguma vez? Por exemplo: jogo_sorteado(2,3,5,7,9,19).
    var regra3 = "jogo_sorteado(N1,N2,N3,N4,N5,N6) :- jogo(Jogo,N1),jogo(Jogo,N2),jogo(Jogo,N3),jogo(Jogo,N4),jogo(Jogo,N5),jogo(Jogo,N6),dif(N1,N2,N3,N4,N5,N6)."
    //Algum jogo completo já foi contemplado mais de uma vez? Qual?

    var regra4 = "jogo_repetido(N1,N2,N3,N4,N5,N6) :- jogo(J1,N1,N2,N3,N4,N5,N6), jogo(J2,N1,N2,N3,N4,N5,N6), J1 =\\= J2.\n" +
        "jogo_repetido(X):- jogo(X1,N1,N2,N3,N4,N5,N6), jogo(X2,N1,N2,N3,N4,N5,N6), X1 =\\= X2, X = [X2,N1,N2,N3,N4,N5,N6]."

    var regra5 = "qtdsorteado(X, N) :- integer(X),findall(X,(jogo(_,X,_,_,_,_,_);jogo(_,_,X,_,_,_,_);jogo(_,_,_,X,_,_,_);jogo(_,_,_,_,X,_,_);jogo(_,_,_,_,_,X,_);jogo(_,_,_,_,_,_,X)), Y), length(Y,N)."

    aux = aux + "\n att(1,X,Num,Qtd,Naux,Qaux) :- (findall(1,(jogo(_,1,_,_,_,_,_);jogo(_,_,1,_,_,_,_);jogo(_,_,_,1,_,_,_);jogo(_,_,_,_,1,_,_);jogo(_,_,_,_,_,1,_);jogo(_,_,_,_,_,_,1)), X1) ; true), append(X1,X,X2),((count(A,X2,Qtt),Qtt > Qaux, Num is A, Qtd is Qtt) ; Num is Naux, Qtd is Qaux) ,!.\n" +
        "att(A,X,Num,Qtd,Naux,Qaux) :- (A >0,A<61), (findall(A,(jogo(_,A,_,_,_,_,_);jogo(_,_,A,_,_,_,_);jogo(_,_,_,A,_,_,_);jogo(_,_,_,_,A,_,_);jogo(_,_,_,_,_,A,_);jogo(_,_,_,_,_,_,A)), X1) ; true), ((length(X1,X11),X11>0,append(X1,X,X2));X2 = X, true), A1 is A-1,((count(A,X2,Qtt),Qtt > Qaux, att(A1,X2,Num,Qtd,A,Qtt)) ; att(A1,X2,Num,Qtd,Naux,Qaux)) ,!.\n" +
        "count(_, [], 0). \ncount(X, [X | T], N) :- !, count(X, T, N1), N is N1 + 1. \ncount(X, [_ | T], N) :- count(X, T, N).\n"

    var regra6 = "mais_sorteado(Num,Qtd) :- att(60,[],Num,Qtd,0,0)."



    //Um número X foi sorteado quantas vezes?

    //
    var regras = regra1 + nl + regra2 + nl + regra3 + nl + regra4 + nl + regra5 + nl + regra6 + nl + aux
    regras_f = regras;
    var fileContents = document.getElementById('regras');
    fileContents.innerText = regras;

}
regras()

function search(q) {
    // Get program

    var query = document.getElementById('q-prolog').value
    // Clear output
    var result = document.getElementById("resp");
    result.innerHTML = "";
    // Find answers

    session.query(query, {
        success: function (goal) {
            //console.log(goal);
            session.answers(resp);
        },
        error: function (err) { console.log("ERRO Query"); console.log(err) }
    })


}

function searchpersonal(q) {
    console.log(q);
    var query = ''
    document.getElementById("resp").innerHTML = "";
    var qq = ''
    switch (Number(q)) {
        case 1:
            qq = document.getElementById('personalquery1').value
            query = "numero_sorteado(" + qq + ")."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp1);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        case 2:
            qq = document.getElementById('personalquery2').value
            query = "sorteado(" + qq + ",NumeroNuncaSorteado)."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp2);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        case 3:
            //qq= document.getElementById('personalquery3').value
            query = "jogo_sorteado(" + document.getElementById('personalquery31').value + "," +
                document.getElementById('personalquery32').value + "," +
                document.getElementById('personalquery33').value + "," +
                document.getElementById('personalquery34').value + "," +
                document.getElementById('personalquery35').value + "," +
                document.getElementById('personalquery36').value + ")."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp3);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        case 4:
            qq = document.getElementById('personalquery4').value
            query = "jogo_repetido(" + qq + ")."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp4);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        case 5:
            qq = document.getElementById('personalquery5').value
            query = "qtdsorteado(" + qq + ",QuantidadeSorteado)."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp5);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        case 6:
            query = "mais_sorteado(Numero,Quantidade)."
            session.query(query, {
                success: function (goal) {
                    //console.log(goal);
                    session.answers(resp6);
                },
                error: function (err) { console.log("ERRO Query"); console.log(err) }
            })
            break;

        default:
            break;
    }
}

function resp1(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')

    if (content.match(/true/) == 'true') {
        content = "O numero foi sorteado"
    } else if (content.match(/false/) != 'false') {
        var aux = content.split('=');
        content = "O numero " + aux[1].match(/[0-9]+/) + " foi sorteado"
    }
    tag.innerText = tag.innerText + '\n' + content
}

function resp2(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')

    if (content.match(/false/) != 'false') {
        var aux = content.split('=');
        content = "O numero " + aux[1].match(/[0-9]+/) + " Nunca foi sorteado"
    }
    tag.innerText = tag.innerText + '\n' + content
}

function resp3(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')


    if (content.match(/true/) == 'true') {
        content = "O Jogo ja foi contemplado"
    } else if (content.match(/false/) != 'false') {
        content = "O Jogo ja foi contemplado com " + content;
    }

    tag.innerText = tag.innerText + '\n' + content
}

function resp4(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')

    if (content.match(/true/) == 'true') {
        content = "O jogo foi contemplado multiplas vezes"
    } 
    tag.innerText = tag.innerText + '\n' + content
}

function resp5(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')

    if (content.match(/false/) != 'false') {
        var aux = content.split('=');
        content = "O numero foi sorteado " + aux[1].match(/[0-9]+/) + " vezes"
    }
    tag.innerText = tag.innerText + '\n' + content
}

function resp6(answer) {
    content = session.format_answer(answer)
    var tag = document.getElementById('resp')

    if (content.match(/false/) != 'false') {
        var aux = content.split('=');
        console.log(aux);
        content = "O numero " + aux[1].match(/[0-9]+/) + " foi sorteado " + aux[2].match(/[0-9]+/) + " vezes"
    }
    tag.innerText = tag.innerText + '\n' + content
}
// Persistir resutlado na tela
function resp(answer) {

    content = session.format_answer(answer)
    var tag = document.getElementById('resp')
    tag.innerText = tag.innerText + '\n' + content
    console.log(answer);
    console.log(content);
}