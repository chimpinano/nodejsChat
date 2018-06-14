var express = require('express'); 
var http = require('http');
var socket = require('socket.io');

var app = express();
var server = http.createServer(app);
var usuarios = [];

server.listen(3000, function(){
    console.log("Corriendo en el puerto 3000");
})

var io = socket.listen(server);

app.get('/', function(llamado, respuesta){
    respuesta.sendFile(__dirname + '/cliente.html');
});

io.on('connection', function(socket){
    socket.on('nuevo usuario', function(usuario, callback){
        if(usuarios.indexOf(usuario) != -1){
            callback(false);
        }
        else{
            callback(true);
            socket.usuario = usuario;
            usuarios.push(usuario);
            actualizarUsuarios();
            io.emit('mensaje',{mensaje: 'se ha conectado', usuario: socket.usuario});
        }
    });
    
    socket.on('nuevo mensaje', function(mensaje){
        io.emit('mensaje', {mensaje: mensaje, usuario: socket.usuario});
    });
    
    function actualizarUsuarios(){
        io.emit('actualizarUsuarios', usuarios);
    };
    
    socket.on('disconnect', function(data){
        usuarios.splice(usuarios.indexOf(socket.usuario), 1);
        io.emit('mensaje',{mensaje: 'se ha desconectado', usuario: socket.usuario});
        actualizarUsuarios();
    });
})







