# Trabajo Práctico 06: Refactorización Modular de Reservas

## Proyecto de partida y cambios
- **Proyecto de partida:** Copia funcional y verificada del TP 05 (`tp-05-salas-middleware`)[cite: 8].
- **Cambios realizados:** Se reorganizó toda la aplicación monolítica en una arquitectura modular limpia, separando las responsabilidades en arranque, configuración, aplicación, rutas, controladores, servicios y middlewares. Se incorporó la lectura y validación de variables de entorno mediante un archivo de configuración externo y se configuraron las herramientas de análisis estático (ESLint y Prettier)[cite: 10, 11]. Se mantuvo intacto el comportamiento funcional, las vistas EJS, el diseño y las respuestas HTTP.

## Instalación y ejecución
1. Clonar el repositorio y ubicarse en la carpeta del proyecto (`tp-06-salas-modular`)[cite: 8, 9].
2. Instalar las dependencias ejecutando:
   ```bash
   npm install

*Iniciar la aplicación en modo desarrollo:*

**npm start**

_Ejecutar la verificación de formato y análisis estático de código:_

**npm run check**


## configuracion del entorno

1. El módulo src/configuracion.js se encarga de procesar PORT y NODE_ENV desde process.env.

2. Puerto: Si la variable PORT no está definida, toma por defecto el puerto 3000. Valida estrictamente que sea un número entero dentro del rango permitido (1 a 65535); de lo contrario, rechaza el inicio con un mensaje claro.

3. Entorno (NODE_ENV): Utiliza Morgan en modo dev por defecto y conmuta automáticamente a combined si se configura como production.

4. Se versiona el archivo .env.example con los parámetros seguros por defecto, manteniendo .env y node_modules/ excluidos en el .gitignore.


## Mapa de modulos y dependencias.

1. src/index.js (Arranque): Crea la instancia única del servicio con los datos iniciales, lee la configuración externa, inicializa la aplicación Express y levanta el servidor en el puerto indicado. No declara rutas ni valida formularios.

2. src/configuracion.js (Configuración): Centraliza la lectura, conversión y validación de las variables de entorno.

3. src/app.js (Aplicación): Configura todo el pipeline de middlewares, la motorización de vistas EJS, los recursos estáticos y monta el enrutador principal junto con el manejador final de errores 404. No ejecuta métodos de escucha (listen) ni manipula directamente el arreglo de datos.

4. src/rutas/reservas.js (Rutas): Define el enrutador de Express que relaciona los métodos y caminos HTTP con sus respectivos middlewares de validación y funciones de control.

5. src/controladores/reservas.js (Controladores): Funciones creadas mediante inyección de dependencias (crearControladorReservas(servicio)) que leen parámetros, interactúan con el servicio, renderizan vistas, devuelven respuestas JSON, manejan redirecciones o códigos 404. No contienen lógica HTTP directa ni manipulan arreglos de almacenamiento.

6. src/servicios/reservas.js (Servicios): Contiene la lógica de negocio y la única instancia compartida del arreglo en memoria (creada mediante crearServicioReservas(datosIniciales)) para listar, buscar, contar y crear reservas. No utiliza objetos de respuesta HTTP (res), vistas EJS ni códigos de estado.   

7. src/middleware/ (Middlewares): Módulos independientes encargados de conservar el identificador de solicitudes, la medición de tiempos de respuesta, las secciones y la validación estricta de los formularios POST

## Matriz antes y despues.

## Matriz antes / después
| Caso de Prueba | Comportamiento Esperado | Resultado Observado |
| :--- | :--- | :--- |
| **GET /** | 200 (Inicio) | Correcto |
| **GET /estado** | 200 (JSON con cantidad e ID base) | Correcto |
| **GET /reservas** | 200 (Listado de reservas) | Correcto |
| **GET /reservas/nueva** | 200 (Formulario de alta) | Correcto |
| **GET /reservas/:id** | 200 o 404 HTML | Correcto |
| **POST /reservas (Válido)** | 302 y posterior redirección GET 200 | Correcto |
| **POST /reservas (Inválido)** | 400 (Sin crear registro) | Correcto |
| **GET /css/estilos.css** | 200 (Recurso estático cargado) | Correcto |
| **URL Inexistente** | 404 HTML | Correcto |

## pipeline y contrato de rutas

El orden de los middlewares en el pipeline se conserva de manera estricta.
_Morgan -> identificarSolicitud -> medirDuracion -> layouts -> static -> urlencoded -> json -> rutas de aplicación -> router /reservas -> 404_

## Formato y analisis estetico

1. Se configuró ESLint para los archivos CommonJS dentro de la carpeta src/.   

2. Se integró Prettier para asegurar el formato consistente del código.   

3. Scripts incluidos en el package.json:

      1. npm start: Inicia la aplicación en producción o desarrollo.   

      2. npm run format: Aplica formato automático con Prettier.   

      3. npm run format:check: Verifica el formato de código.
      4. npm run lint: Ejecuta el análisis estático con ESLint.   
      5. npm run check: Ejecuta en conjunto format:check y lint.


## Persistencia temporales y limites

1. Los datos de las reservas se almacenan exclusivamente en memoria RAM a través del servicio compartido

2. Ante cualquier reinicio de la aplicación, los nuevos registros creados desaparecen y el sistema regresa a su estado inicial de semilla.
