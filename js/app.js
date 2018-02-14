var puntos = 0,
        movimientos = 0,
        tiempoJuego = 120,
        tiempoRestante,
        tiempo,
        indColor = 0,
        indEstado = 0,
        figValidas = 0;
        colores = ['white', 'yellow'];
        dimension = 7;
var arrayImagenes = ['image/1.png', 'image/2.png', 'image/3.png', 'image/4.png'];
var puntuacion = [10, 50, 75, 100, 150, 200, 250,300,325,350,375,400,425,450];
var cantidadImagenes = arrayImagenes.length;
var matriz = [];
var divMovimiento = null;
var divArrastre = null;

$(function () {
    function juego(f, c, obj, src)
    {
        return {
            f: f,
            c: c,
            fuente: src,
            enCombo: false,
            o: obj
        };
    }
    function imagenRandom() {
        var imagenPonemos = Math.floor((Math.random() * cantidadImagenes));
        return arrayImagenes[imagenPonemos];
    }
    var cambiarTitulo = function () {
        setInterval(function () {
            if (indColor === colores.length)
                indColor = 0;
            $('.main-titulo').css('color', colores[indColor]);
            indColor++;
        }, 500);
    };
    $(".btn-reinicio").click(iniciar);
    function iniciar() {
        $('.btn-reinicio').text('Reiniciar');
        if (indEstado === 0) {
            indEstado = 1;
            iniciarTiempo();
            activarMovimientos();
            seleccionaryEliminar();
        } else {
            reiniciar();
        }
    }
    function reiniciar() {
        figValidas = 0;
        puntos = 0;
        movimientos = 0;
        tiempoRestante = tiempoJuego;
        actualizarTiempo();
        actualizarMovimientos();
        actualizarPuntos();
        clearTimeout(tiempo);
        var divTiempo = $('.time').css("display");
        if (divTiempo ==='none'){
            $('.panel-tablero').slideToggle("slow", function () {
                iniciarTiempo();
            });
            $('.time').show();
            $('.finalizacion').hide();
            $('.panel-score').css({'width': '25%'});
            $('.panel-score').resize({
                animate: true
            });
        }else{
            iniciarTiempo();
        }
        cargarTablero();
        seleccionaryEliminar();
        actualizarPuntos();
    }

    function iniciarTiempo() {
        tiempoRestante = tiempoJuego;
        tiempo = setTimeout(contadorTiempo, 1000);
    }
    function contadorTiempo() {
        tiempoRestante -= 1;
        console.log(tiempoRestante);
        actualizarTiempo();
        if (tiempoRestante === 0) {
            return finalizacion();
        }
        tiempo = setTimeout(contadorTiempo, 1000);
    }
    function actualizarTiempo() {
        $('#timer').html(formatoTiempo(tiempoRestante));
    }
    function actualizarPuntos() {
        $('#score-text').html(puntos);
    }
    function actualizarMovimientos() {
        $('#movimientos-text').html(movimientos);
    }
    function finalizacion() {
        $('.panel-tablero').slideToggle("slow", function () {
            $('.time').hide();
            $('.finalizacion').show();
            $('.panel-score').css({'width': '100%'});
            $('.panel-score').resize({
                animate: true
            });
        });
    }
    function cargarTablero() {
        for (var f = 0; f < dimension; f++) {
            matriz[f] = [];
            for (var c = 0; c < dimension; c++) {

                matriz[f][c] = new juego(f, c, null, imagenRandom());

                var celda = $('#img_' + f + '_' + c).html("<img src='" + matriz[f][c].fuente + "' alt='" + f + "," + c + "'/>");

                matriz[f][c].o = celda;
            }
        }
    }
    function activarMovimientos(){
        for (var f = 0; f < dimension; f++) {
             for (var c = 0; c < dimension; c++) {
                 var celda = $('#img_' + f + '_' + c);
                  celda.draggable(
                        {
                            containment: '.panel-tablero',
                            cursor: 'move',
                            zIndex: 100,
                            opacity: 0.85,
                            snap: '.panel-tablero',
                            stack: '.panel-tablero',
                            revert: true,
                            start: handleDragStart,
                            stop: handleDragStop
                        });
                celda.droppable(
                        {
                            drop: handleDropEvent
                        });
             }
        }
    }
    function handleDragStop(event, ui) {
        console.log('DIV Final: "' + divArrastre);
        console.log("DIV Inicial: " + divMovimiento);
        var src = divMovimiento.split("_");
        var sf = src[1];
        var sc = src[2];
        var dst = divArrastre.split("_");
        var df = dst[1];
        var dc = dst[2];
        var ddx = Math.abs(parseInt(sf) - parseInt(df));
        var ddy = Math.abs(parseInt(sc) - parseInt(dc));
        if (ddx > 1 || ddy > 1)
        {
            console.log("Distancia invalida > 1");
            return;
        }
        if (sf !== df && sc !== dc) {
            console.log("Movimiento invalido...");
            return;
        }
        console.log("swap " + sf + "," + sc + " to " + df + "," + dc);
        var tmp = matriz[sf][sc].fuente;
        matriz[sf][sc].fuente = matriz[df][dc].fuente;
        matriz[sf][sc].o.html("<img src='" + matriz[sf][sc].fuente + "' alt='" + sf + "," + sc + "'/>");
        matriz[df][dc].fuente = tmp;
        matriz[df][dc].o.html("<img src='" + tmp + "' alt='" + df + "," + dc + "'/>");
        movimientos += 1;
        divMovimiento = null;
        divArrastre = null;
        actualizarMovimientos();
        figValidas = 0;
        seleccionaryEliminar();
    }
    function handleDragStart(event, ui) {
        divMovimiento = event.target.id;
        console.log("Div Inicio Start :" + divMovimiento);
    }
    function handleDropEvent(event, ui) {
        divArrastre = event.target.id;
        console.log('DIV Final Drop: "' + divArrastre + '"!');
        console.log("DIV Inicio Drop: " + divMovimiento);
    }
    function seleccionaryEliminar() {
        for (var f = 0; f < dimension; f++) {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;
            for (var c = 0; c < dimension; c++) {
                if (prevCelda === null)
                {
                    prevCelda = matriz[f][c].fuente;
                    figInicio = c;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else {
                    var curCelda = matriz[f][c].fuente;
                    if (!(prevCelda === curCelda)) {
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = c - 1;
                            console.log("Combo Horizontal de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matriz[f][ci].enCombo = true;
                                matriz[f][ci].fuente = null;
                            }
                            puntos += puntuacion[figLongitud];
                            puntos += puntuacion[figValidas];
                        }
                        prevCelda = matriz[f][c].fuente;
                        figInicio = c;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else {
                        figLongitud += 1;
                        if (c === (dimension - 1)) {
                            if (figLongitud >= 3)
                            {
                                figValidas += 1;
                                figFin = c;
                                console.log("Combo Horizontal de " + figInicio + " a " + figFin + "!");
                                for (var ci = figInicio; ci <= figFin; ci++)
                                {
                                    matriz[f][ci].enCombo = true;
                                    matriz[f][ci].fuente = null;
                                }
                                puntos += puntuacion[figLongitud];
                                puntos += puntuacion[figValidas];
                                prevCelda = null;
                                figInicio = null;
                                figFin = null;
                                figLongitud = 1;
                                continue;
                            }
                        } else {
                            prevCelda = matriz[f][c].fuente;
                            figFin = null;
                            continue;
                        }
                    }
                }
            }
        }
        for (var c = 0; c < dimension; c++)
        {
            var prevCelda = null;
            var figLongitud = 0;
            var figInicio = null;
            var figFin = null;
            for (var f = 0; f < dimension; f++)
            {
                if (matriz[f][c].enCombo)
                {
                    figInicio = null;
                    figFin = null;
                    prevCelda = null;
                    figLongitud = 1;
                    continue;
                }
                if (prevCelda === null)
                {
                    prevCelda = matriz[f][c].fuente;
                    figInicio = f;
                    figLongitud = 1;
                    figFin = null;
                    continue;
                } else
                {
                    var curCell = matriz[f][c].fuente;
                    if (!(prevCelda === curCell))
                    {
                        if (figLongitud >= 3)
                        {
                            figValidas += 1;
                            figFin = f - 1;
                            console.log("Combo vertical de " + figInicio + " a " + figFin + "!");
                            for (var ci = figInicio; ci <= figFin; ci++)
                            {
                                matriz[ci][c].enCombo = true;
                                matriz[ci][c].fuente = null;
                            }
                            puntos += puntuacion[figLongitud];
                            puntos += puntuacion[figValidas];
                        }
                        prevCelda = matriz[f][c].fuente;
                        figInicio = f;
                        figFin = null;
                        figLongitud = 1;
                        continue;
                    } else
                    {
                        figLongitud += 1;
                        if (f === (dimension - 1)) {
                            if (figLongitud >= 3)
                            {
                                figValidas += 1;
                                figFin = f;
                                console.log("Combo vertical de " + figInicio + " a " + figFin + "!");
                                for (var ci = figInicio; ci <= figFin; ci++)
                                {
                                    matriz[ci][c].enCombo = true;
                                    matriz[ci][c].fuente = null;
                                }
                                puntos += puntuacion[figLongitud];
                                puntos += puntuacion[figValidas];
                                prevCelda = null;
                                figInicio = null;
                                figFin = null;
                                figLongitud = 1;
                                continue;
                            }
                        } else {
                            prevCelda = matriz[f][c].fuente;
                            figFin = null;
                            continue;
                        }
                    }
                }

            }
        }
        var esCombo = false;
        for (var f = 0; f < dimension; f++) {
            for (var c = 0; c < dimension; c++)
                if (matriz[f][c].enCombo)
                {
                    console.log("Combo para eliminar: " + f + ',' + c);
                    esCombo = true;
                }
        }
        if (esCombo){
            eliminarImagenes();
        }
        else {
            console.log("NO COMBO");
        }
        mostrarImagenes();
    }

    function eliminarImagenes()
    {
        for (var f = 0; f < dimension; f++){
            for (var c = 0; c < dimension; c++){
                if (matriz[f][c].enCombo)  // Celda vacia
                {
                    matriz[f][c].o.animate({
                        opacity: 0
                    }, 700);
                }
            }
        }
        actualizarPuntos();
        $(":animated").promise().done(function () {
            eliminarenMemoria();
         });
        console.log("finaliza aqui en eliminarImagenes");
    }
    function eliminarenMemoria() {
        for (var f = 0; f < dimension; f++)
        {
            for (var c = 0; c < dimension; c++)
            {
                if (matriz[f][c].enCombo)  // Pregunta si la celda esta vacia
                {
                    matriz[f][c].o.html("");
                    matriz[f][c].enCombo = false;
                    for (var sr = f; sr >= 0; sr--)
                    {
                        if (sr === 0)
                            break;
                        var tmp = matriz[sr][c].fuente;
                        matriz[sr][c].fuente = matriz[sr - 1][c].fuente;
                        matriz[sr - 1][c].fuente = tmp;
                    }
                }
            }
        }
        console.log("Fin de movimiento");
        for (var f = 0; f < dimension; f++)
        {
            for (var c = 0; c < dimension; c++)
            {
                matriz[f][c].o.html("<img src='" + matriz[f][c].fuente + "' alt='" + f + "," + c + "'/>");
                matriz[f][c].o.css("opacity", 1);
                matriz[f][c].enCombo = false;
                if (matriz[f][c].fuente === null)
                    matriz[f][c].respawn = true;
                if (matriz[f][c].respawn === true)
                {
                    matriz[f][c].o.off("handleDragStart");
                    matriz[f][c].o.off("handleDropEvent");
                    matriz[f][c].o.off("handleDragStop");
                    matriz[f][c].respawn = false;
                    console.log("Respawning " + f + "," + c);
                    matriz[f][c].fuente = imagenRandom();
                    matriz[f][c].o.html("<img src='" + matriz[f][c].fuente + "' alt='" + f + "," + c + "'/>");
                    matriz[f][c].o.draggable(
                            {
                                containment: '.panel-tablero',
                                cursor: 'move',
                                zIndex: 100,
                                opacity: 0.85,
                                snap: '.panel-tablero',
                                stack: '.panel-tablero',
                                revert: true,
                                start: handleDragStart,
                                stop: handleDragStop
                            });
                    matriz[f][c].o.droppable(
                            {
                                drop: handleDropEvent
                            });
                }else{
                     matriz[f][c].o.css("opacity", 1);
                }
            }
        }
        console.log("Combo reseteados y recreados.");
        mostrarImagenes();
        seleccionaryEliminar();
        console.log("finaliza aqui en eliminarenMemoria");
        mostrarImagenes();
    }
    function mostrarImagenes(){
          for (var f = 0; f < dimension; f++){
                for (var c = 0; c < dimension; c++){
                    if (matriz[f][c].o.css("opacity")===0)
                        console.log("Imagen invisible: " + f+','+c);
                    matriz[f][c].o.css("opacity", 1);
                }
            }
    }
    var temporizador = function () {
        var $timer,
                tiempo = 1000;
        incrementador = 70,
                actualizarTiempo = function () {
                    $timer.html(formatTime(tiempo));
                    if (tiempo === 0) {
                        temporizador.Timer.stop();
                        return;
                    }
                    tiempo -= incrementador / 10;
                    if (tiempo < 0) {
                        tiempo = 0;
                        tiempoCompleto();
                    }
                },
                tiempoCompleto = function () {
                    alert('Tiempo completado');
                },
                init = function () {
                    $timer = $('#timer');
                    temporizador.Timer = $.timer(actualizarTiempo, incrementador, true);
                };
        this.restaurarTiempo = function () {
            temporizador.Timer = $.timer();
        };
        $(init);
    };
    $(function () {
        cambiarTitulo();
        cargarTablero();
    });
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    function formatoTiempo(time) {
        var min = parseInt(time / 60),
                sec = time - (min * 60);
        console.log((min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2));
        return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2);
    }
}());
