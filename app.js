//////////// CRUD - TIMER ///////////
const express = require('express');
const app = express();
const port = process.env.PORT || 5555;
////////////////////////////////////
let linksArray = [];

app.use(express.json());

function id_generator(){
for (let i = 1; i <= 3; i++) {
 const id = Math.floor(100000 + Math.random() * 900000);
 return id;
}
}

app.get('/', (req, res) => {
 res.send('Welcome to TimerCrud');
})

app.get('/docs', (req, res) => {
 res.send(`
   <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <pre style="font-family: Arial; margin: 10px; overflow-x: auto;">
 AGREGAR: 
 curl "https://timercrud.onrender.com/add?link=https://musify-dl.onrender.com/check&time=40"
 
 ELIMINAR
 curl -X DELETE https://timercrud.onrender.com/remove/858853
 
 ACTUALIZAR:
 curl -X PUT https://timercrud.onrender.com/update/123456 -H "Content-Type: application/json" -d '{"link":"https://www.google.com", "time":"120"}'
    </pre>
    </body>
  </html>
 `)
})

// ---> /links (esto muestra todos los links, tiempos y sus id) 
app.get('/links', (req, res) => {
 if (linksArray.length === 0){
  res.json({"message" : "No se encontraron links almacenados..."});
 }
 res.json(linksArray);
})

// --->  /add?link=https://www.google.com&time=60
app.get('/add', (req, res) => {
 if (!req.query.link || !req.query.time) {
    return res.status(400).json({ error: "Faltan argumentos..." });
  } else {
   let id = id_generator();
   let link = req.query.link; let time = req.query.time;
   res.json({status : "success", id, link, time} );
   linksArray.push({'id': id, 'link': link, 'time': time});
  }
})


// curl -X PUT http://localhost:5555/update/123456 -H "Content-Type: application/json" -d '{"link":"https://nuevo.com", "time":"120"}'
app.put('/update/:id', (req, res) => {
  const id = +req.params.id;
  const { link, time } = req.body;
  if (!link && !time) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar (link o time)" });
  }
  const itemIndex = linksArray.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "ID no encontrado" });
  }
  if (link) linksArray[itemIndex].link = link;
  if (time) linksArray[itemIndex].time = time;

  res.json({
    status: "success",
    message: "Elemento actualizado",
    updatedItem: linksArray[itemIndex]
  });
});



// curl -X DELETE http://localhost:5555/remove/739063
app.delete('/remove/:id', (req, res) => {
const usuarioIndex = linksArray.findIndex(u => u.id === +req.params.id);
if (usuarioIndex === -1) return res.status(404).send('ID no encontrado, introduzca un id valido.');
linksArray.splice(usuarioIndex, 1);
res.status(204).send();
});



app.listen(port, () => {
 console.log(`Servicio corriendo en el puerto [http://localhost:${port}] `)
})

