# Vank API

Esta API fue desarrollada para el proceso de selección de Xepelin y podemos encontrar la versión desplegada en [http://vank-api.herokuapp.com/](http://vank-api.herokuapp.com/).

## Dependencias

Para poder ejecutar este proyecto, es necesario NodeJS v16.14.0, MySQL 5.7+ Y Redis. Por lo que, para correr el proyecto localmente tenemos dos opciones:

**Correr el proyecto usando Docker**

* Instalar Docker y docker-compose.
* Obtener una API Key en [Currency Converter API](https://free.currencyconverterapi.com/free-api-key).
* Configurar variables de entorno (ver sección [Variables de entorno](#variables-de-entorno)).
* Ir a la carpeta principal del proyecto y correr el comando ```docker-compose up```, esto se encargara de instalar todas las dependencias necesarias e iniciar el proyecto.

**Correr el proyecto localmente**

* Instalar NodeJS 16.14.0 y npm.
* Instalar el CLI de NestJS ```npm install -g @nestjs/cli```
* Levantar una base de datos MySQL 5.7+, configurar un usuario y crear una base de datos.
* Instalar y configurar Redis
* Obtener una API Key en [Currency Converter API](https://free.currencyconverterapi.com/free-api-key)
* Configurar variables de entorno (ver sección [Variables de entorno](#variables-de-entorno))
* Instalar dependencias con:
  * `npm install`
* Correr ```npm run start:dev```

## Variables de entorno
* Crear un archivo .env dentro de la carpeta principal del proyecto.
* Reemplazar los siguientes valores según corresponda
```
NODE_ENV=local
PORT=3000
DB_SYNC=true
DB_NAME=vank
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306
INVOICE_CSV_URL=https://gist.githubusercontent.com/rogelio-meza-t/f70a484ec20b8ea43c67f95a58597c29/raw/41f289c605718e923fc1fad0539530e4d0413a90/invoices.csv
CURRENCY_CONVERTER_API_URL=https://free.currconv.com
CURRENCY_CONVERTER_API_KEY=<API_KEY>
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password
REDIS_DATABASE=vank
```
La variable de entorno **DB_SYNC** permite que se sincronicen las entidades del proyecto con la base de datos, por lo que se recomienda sea **true** en un entorno de desarrollo y la primera vez que se despliega el proyecto a producción.

## Documentacion técnica

Esta aplicación se desarrollo utilizando el framework **NestJS** de NodeJS, el cual nos ofrece una arquitectura que permite modularizar las funcionalidades, así como acceder a un conjunto de herramientas como ORM, Testing, Gestores de Cache y Configuración que hacen de el desarrollo un proceso mas ágil y robusto.

Ademas de esto, se utilizo **TypeScript** como sustituto de JavaScript para aprovechar el tipado estático, **TypeORM** como ORM para la base de datos y **Jest** para los tests unitarios.

La base de datos cuenta con 2 entidades principales: **clients** e **invoices**.

Para interactuar con la API, contamos con los siguientes servicios:

**Clients:**
* GET localhost:3000/clients
Entrega un listado de los clientes

* PATCH localhost:3000/clients/:id
Permite editar los campos taxId y currency de un cliente.

* POST localhost:3000/clients
Permite crear un cliente. Recibe los siguientes parámetros en el body como JSON:
	* **companyName:** String. Nombre del cliente.
	* **internalCode:** String. Código interno del cliente.
	* **taxId**: String. Identificador tributario del cliente.
	* **currency**: String. Moneda en la que opera el cliente. Puede ser CLP, USD o EUR.
	* **apiQuota**: Int. Cantidad de llamadas mensuales que puede hacer el usuario a la API.
	* **allowedBanks**: Array(Int). Lista de bancos a los que el cliente tiene acceso.
* DELETE localhost:3000/clients/:id
Permite eliminar a un cliente de la base de datos. Recibe el id mediante los parámetros de la request.

**Invoices**
* GET localhost:3000/invoices
Permite obtener la lista de las facturas. Puede recibir los siguientes filtros opcionales como queryStrings:

	* **vendor**: Int. Id del vendor de la factura.
	* **invoice_date**: String. Fecha mínima en la que puede haberse creado la factura, admite los formatos: DD-MMM-YYY, DD/MMM/YYYY o DD.MM.YYY.
	* **currency**: String. Moneda en la que serán devueltos los montos de las facturas. Puede ser CLP, USD o EUR. De no proporcionar ninguno, las facturas serán devueltas en su moneda original.

###  Postman

Dentro de la capeta **postman** podemos encontrar una colección con ejemplos de cada llamada que pueden ser importadas para probar la API.

### Swagger

Como alternativa a hacer peticiones en Postman, podemos acceder al swagger, para ver la estructura de las llamadas a la API, así como los parametros que reciben e interactuar con ella directamente.
* Localmente: [http://localhost:3000/swagger](http://localhost:3000/swagger)
* Desplegado: [http://vank-api.herokuapp.com/swagger](http://vank-api.herokuapp.com/swagger)

### Testing

Existen un total de 8 tests unitarios, contenidos en dos archivos:

* **clients.service.spec.ts**
* **invoices.service.spec.ts**

Para correrlos, usamos el comando ```npm run test```

### Cronjob

La tarea recurrente que actualiza las facturas se encuentra en el archivo **invoices.task.ts**, este se ejecuta todos los días a las 12 am (según la hora del servidor), tambien se ejecuta cuando se ejecuta la aplicación para cargar la data en la base de datos.


	 
### Supuestos
* El filtro de facturas **invoice_date** se utiliza para filtrar la fecha mínima de creación de la factura.
* Al no tener mas data de los bancos y no poder determinar que cliente esta haciendo la petición, se tomo la decisión de no guardar los bancos y su relación con los clientes en tablas aparte, ya que actualmente no se les da uso.

### Posibles mejoras
* Manejo de sesiones de los usuarios/clientes, de forma que se pueda limitar el uso de la API, filtrar las facturas según los bancos a los que tienen acceso y poder tener una moneda por defecto a la hora de listar facturas.
* Proteger las rutas internas de gestión de clientes con un mecanismo de autorización
* Hacer que el proceso de lectura del CSV sea mas escalable leyendo el archivo por partes, ya que leer un archivo muy grande a la vez puede representar un problema para archivos muy grandes.
* Mejorar la validación de casos borde y excepciones en la aplicación.
* Implementar un motor de búsqueda avanzado.

### Notas

En ciertos IDE, pueden surgir problemas con **ESLint**, debido a un problema con la dependencia. De ser así desactivar la extensión o eliminar el archivo de configuración.