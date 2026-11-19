# Pasarela de notificaciones

API para que varios sistemas internos envíen correos por un solo lugar. Cada sistema tiene su token; los correos se envían en segundo plano con reintentos, y un panel muestra qué se envió, qué falló y por qué.

Versión base de demostración. Todos los datos son ficticios y los correos no salen a internet: los atrapa Mailpit.

![Panel](docs/capturas/01-panel.png)

## Qué hace

- **API REST** `POST /api/v1/notificaciones` y `GET /api/v1/notificaciones/{id}` con token Bearer por sistema.
- **Tokens seguros.** Se muestran una sola vez; en la base solo queda su huella SHA-256. Regenerarlo invalida el anterior y desactivar un sistema corta su acceso.
- **Cola con reintentos.** Hasta 5 intentos con espera creciente (10 s, 30 s, 1 min, 5 min). Lo que falla queda como *Fallida* con el error del servidor de correo y se puede reintentar desde el panel.
- **Idempotencia.** Si el sistema cliente repite la llamada con la misma `clave`, no se envía dos veces.
- **Límite de 60 solicitudes por minuto** por token.
- **Panel** con enviadas, en cola y fallidas por día y por sistema; detalle con vista previa del correo; guía de integración con ejemplos en curl, PHP y Python.
- **Roles.** Administrador (sistemas, tokens, reintentos, usuarios) y Consulta (solo lectura).

| Notificación fallida | Guía de integración |
|---|---|
| ![Fallida](docs/capturas/03-notificacion-fallida.png) | ![Integración](docs/capturas/06-integracion.png) |

| Vista previa | Correo recibido en Mailpit |
|---|---|
| ![Vista previa](docs/capturas/04-vista-previa.png) | ![Mailpit](docs/capturas/07-mailpit.png) |

## Tecnología

Laravel 13 · PHP 8.4 · colas de Laravel (driver database) · Inertia.js · React 18 · TypeScript · Tailwind CSS · MariaDB 11 · Mailpit · Docker (nginx + PHP-FPM + worker con supervisord)

## Probarlo

Requiere Docker.

```bash
git clone https://github.com/Xarod65211/api-notificaciones.git
cd api-notificaciones
docker compose up -d --build
```

- Panel: http://localhost:8530 (`admin@demo.test` / `demo1234`, o `consulta@demo.test` para solo lectura)
- Bandeja de Mailpit: http://localhost:8535

Envíe una notificación con el token de demostración del sistema «Control de EPP»:

```bash
curl -X POST http://localhost:8530/api/v1/notificaciones \
  -H "Authorization: Bearer ntf_demo0000000000000000000000000000000000" \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"evento":"orden.aprobada","asunto":"Orden 1042 aprobada","cuerpo":"La orden pasa a compras.","para":["compras@empresa.test"],"clave":"orden-1042"}'
```

Responde `202` con el id. A los pocos segundos el correo aparece en Mailpit y el estado cambia a *Enviada*.

## Pruebas

```bash
composer install && npm install && npm run build
php artisan test
```

30 pruebas. Las de la API están en [`tests/Feature/ApiNotificacionesTest.php`](tests/Feature/ApiNotificacionesTest.php): token ausente, falso o de un sistema desactivado, validación, idempotencia, envío real del correo, fallo definitivo y reintento, aislamiento entre sistemas y regeneración de token.

## Dónde está cada cosa

| Ruta | Contenido |
|---|---|
| `routes/api.php` | Rutas de la API, middleware de token y límite por minuto |
| `app/Http/Middleware/AutenticarSistema.php` | Autenticación por token |
| `app/Http/Controllers/Api/NotificacionApiController.php` | Recepción e idempotencia |
| `app/Jobs/EnviarNotificacion.php` | Envío, reintentos y marca de fallo |
| `resources/views/correo/notificacion.blade.php` | Plantilla del correo |
| `docker/supervisord.conf` | nginx, PHP-FPM y el worker de la cola en un contenedor |

## Autor

Aramis Corini · [Portafolio](https://xarod65211.github.io)

Licencia MIT.
