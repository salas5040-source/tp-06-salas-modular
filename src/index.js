const express = require('express');
const path = require(`node:path`);
const morgan = require('morgan');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3002;

const salasPermitidas = ['sala norte', 'sala sur', 'sala multimedia'];
const turnosPermitidos = ['mañana', 'tarde', 'noche'];

let contadorIdReservas = 5;
let contadorSolicitudes = 1;

let reservas = [
  {
    id: 1,
    estudiante: 'Juan Perez',
    email: 'juan.perez@example.com',
    sala: 'sala Norte',
    turno: 'mañana',
    fecha: '2026-09-24',
    personas: 2
  },
  { 
    id: 2, 
    estudiante: "Carlos López", 
    email: "carlos@example.com", 
    sala: "Sala Sur", 
    fecha: "2026-09-25", 
    turno: "Tarde", 
    personas: 4 
    },
  { 
    id: 3, 
    estudiante: "Lucía Fernández", 
    email: "lucia@example.com", 
    sala: "Sala Multimedia", 
    fecha: "2026-09-26", 
    turno: "Noche", 
    personas: 1 
    },
  { 
    id: 4, 
    estudiante: "Mateo Díaz", 
    email: "mateo@example.com", 
    sala: "Sala Norte", 
    fecha: "2026-09-27", 
    turno: "Mañana", 
    personas: 3 
    }
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layouts/main');

app.use(morgan(`dev`));

app.use((req, res, next) => {
    const numSolicitudes = String(contadorSolicitudes++).padStart(4, '0');
    res.locals.solicitudId = `BIB-${numSolicitudes}`;
  next();
});

app.use((req, res, next) => {
    const inicio = Date.now();

    res.on('finish', () => {
        const duracion = Date.now() - inicio;

        console.log(`[MEDICIÓN] ID: ${res.locals.solicitudId} | Método: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode} | Duración: ${duracion}ms`);
  });
  next();
});

app.use(expressLayout);
app.use(express.static(path.join(__dirname, `../public`)));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('inicio', { titulo: 'Inicio - reserva de salas' });
});

app.get(`/estado`, (req, res) => {
  res.json({
    servicio: "activo",
    reservas: reservas.length,
    solicitudId: res.locals.solicitudId
  });
});

/*app.get("/reservas",(req,res) => {
    res.json({
        servicio: "reservas",
        reservas: reservas.length,
        solicitudId: res.locals.solicitudId,
    })
});*/


const reservasRouter = express.Router();

reservasRouter.use((req, res, next) => {
  res.locals.section = "reservas de salas";
  next();
});


reservasRouter.get("/", (req, res) => {
  res.render("reservas/lista", {
    titulo: "Reservas de salas",
    reservas: reservas
  });
});

reservasRouter.get("/nueva", (req, res) => {
  res.render("reservas/nueva", {
    titulo: "Nueva reserva",
    salasPermitidas, turnosPermitidos, errores:[], valores:{} 
  });
});

reservasRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const reserva = reservas.find((r) => r.id === id);

  if(!reserva) {
    return res.status(404).render("no-encontrado", {
      titulo: "reserva No Encontrada",
     mensaje: `No fue posible encontrar la reserva con el ID ${req.params.id}`
    });
  };

  res.render("reservas/detalle", {
    titulo: "Detalle de reserva",
    reserva
  });
});

const validarReserva = (req, res, next) => {
  let {estudiante, email, sala, fecha, turno, personas} = req.body;

  estudiante = estudiante?.trim();
  email = email?.trim();
  sala = sala?.trim();
  fecha = fecha?.trim();
  turno = turno?.trim();
  personas = Number(personas);

  const errores = [];

  if (!estudiante) errores.push("El nombre del estudiante es obligatorio.");
  if (!email || !email.includes("@")) errores.push("Debe ingresar un email válido que contenga '@'.");
  if (!salasPermitidas.includes(sala)) errores.push("La sala seleccionada no es válida.");
  if (!fecha) errores.push("La fecha es obligatoria.");
  if (!turnosPermitidos.includes(turno)) errores.push("El turno seleccionado no es válido.");
  if (isNaN(personas) || !Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push("La cantidad de personas debe ser un número entero entre 1 y 6.");
  }

  if(errores.length > 0){
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva - error", salasPermitidas, turnosPermitidos, errores,
      valores: {estudiante, email, sala, fecha, turno, personas}
    });
  }

  req.reservaValida = {
    id: contadorIdReservas++,
    estudiante, email, sala, fecha, turno,
    personas
  };
  next();
};

const crearReservas = (req, res) => {
  reservas.push(req.reservaValida);
  res.redirect('/reservas');
};

reservasRouter.post('/', validarReserva, crearReservas);

app.use('/reservas', reservasRouter);

app.use((req, res) => {
  res.status(404).render("no-encontrado", {
    titulo: "Pagina No Encontrada",
    mensaje: "La direccion solicitada no existe"
  });
});

app.listen(PORT, () => {
  console.log(`servidor escuchando en http://localhost:${PORT}`)
})
  