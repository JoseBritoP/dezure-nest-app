## Iniciar proyecto

- Recomendación: Crea tu cuenta, inicia sesión para obtener tu token de acceso a los demás endpoints!
Para poner en marcha este proyecto, sigue estos pasos:

* **Instalar dependencias**: Ejecuta el siguiente comando en la terminal para instalar todas las dependencias necesarias:

````bash
    npm install
````

* Crear un archivo .env teniendo en cuenta los ejemplos del archivo .env.example para su correcto funcionamiento en un entorno local
* Ejecuta en la terminal el siguiente comando para iniciar el proyecto!

````bash
  npm run start:dev
````


* Visitando http://localhost:3000/docs verás la documentación de la API realizada con Swagger

## Backend Developer Challenge

Queremos conocerte mejor!!! 

- ¿Qué buscamos? 

Una oportunidad de que compartas eso que sabés hacer mejor. Programar. Que puedas a través de este ejercicio presentarte con tu trabajo y demostrar las ganas que tienes de ser parte. 

- ¿Qué valoraremos? 

Uso de node.js / Nest.js / Typescript 
Uso de middlewares, jwt. 
Uso de postgresql, models. Uso de relaciones y scopes. ORM. 
Buenas prácticas: KISS, DRY, SOLID. Organización del código. Arquitectura de software 

## Consigna:

1. Crear una API REST que comprenda las siguientes funcionalidades: 

* Implementar autenticación utilizando JWT. 
* Un endpoint para gestionar usuarios (crear, actualizar, eliminar). 
* Un endpoint para gestionar productos (crear, actualizar, eliminar). 
* Un endpoint para listar todos los productos. Implementar paginación y filtros en el endpoint de listado de productos. 
* Implementar manejo de errores y validación de datos en los endpoints. 
* Implementar Swagger como herramienta para probar la funcionalidad de los endpoints y facilitar la documentación del proyecto
* Agregar un endpoint para realizar consultas a ChatGPT mediante el uso de Langchain, su objetivo debe ser fruto de tu imaginación. 


2. Responder las siguientes preguntas y añadirlas al README como parte de la documentación: 

## ¿Qué es un middleware y cuál es su utilidad en una aplicación backend? 

Un middleware es una función que se ejecuta entre la solicitud (request) del cliente y la respuesta (response) del controlador en una aplicación NestJS. En otras palabras, el middleware intercepta y puede manipular el objeto request antes de que llegue al controlador y puede modificar la respuesta antes de que se envíe de vuelta al cliente.

Los middlewares son útiles y suelen ser utilizados para realizar tareas comunes de procesamiento de solicitudes, como:

- Validación de Datos: Verificar y validar la información recibida en el cuerpo (body) de la solicitud.
- Autenticación y Autorización: Comprobar que la solicitud incluye un token de acceso válido y que el usuario tiene los permisos necesarios para acceder al recurso solicitado.
- Manejo de Errores: Capturar y manejar errores de manera centralizada antes de que lleguen a los controladores.

## ¿Qué es SQL Injection y cómo puede evitarse? 

SQL Injection es una técnica de ataque en la que un atacante inserta o "inyecta" código SQL malicioso en una consulta de base de datos a través de la entrada de un usuario. Este tipo de ataque puede permitir al atacante ejecutar comandos SQL arbitrarios, lo que puede llevar a la manipulación, divulgación o destrucción de datos sensibles en la base de datos.

Algunas formas en las que se puede evitar son :

1. Uso de consultas Parametrizadas(Prepared Statements):Utilizar consultas parametrizadas permite separar el código SQL de los datos suministrados por el usuario. Esto asegura que los datos se traten siempre como valores y no como parte del código SQL.
````bash
  const query = 'SELECT * FROM users WHERE username = ?';
  const username = 'user_input';
  database.execute(query, [username]);
 ````
2. ORMs y Query Builders: Utilizar un ORM o query builder manejan automáticamente la parametrización de las consultas y abstraen la construcción de las mismas.
````bash
  const user = await userRepository.findOne({ username: 'user_input' });

````
3. Validación y sanatización de entradas: Validar y sanear todas las entradas del usuario para asegurar que contengan solo los datos esperados. Utilizar bibliotecas de validación como class-validator en NestJS, etc.
````bash
import { IsString } from 'class-validator';

class UserInputDto {
  @IsString()
  username: string;
}

````
4. Uso de procedimientos almacenados:Los procedimientos almacenados pueden ayudar a encapsular la lógica SQL en la base de datos y evitar que los datos del usuario se incluyan directamente en las consultas SQL.

````bash
  CREATE PROCEDURE GetUser(IN user_name VARCHAR(255))
  BEGIN
    SELECT * FROM users WHERE username = user_name;
  END;

````

## ¿Cuándo es conveniente utilizar SQL Transactions? Dar un ejemplo. 
Una transacción SQL es una secuencia de operaciones que se ejecutan como una única unidad lógica de trabajo. Una transacción debe cumplir con las propiedades ACID: Atomicidad, Consistencia, Aislamiento y Durabilidad. Son convenientes cuando se necesitan asegurar la consistencia y la integridad de los datos en operaciones que involucran múltiples cambios en la base de datos. 

Ejemplo en TypeORM y NestJS:

Supongamos que estamos desarrollando una aplicación bancaria y necesitamos implementar una funcionalidad para transferir dinero de una cuenta a otra. Este proceso debe ser atómico para evitar cualquier inconsistencia.

````bash

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Account } from './entities/account.entity';
import { TransferDto } from './dto/transfer.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class BankingService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private connection: Connection,
  ) {}

  async transferMoney(transferDto: TransferDto): Promise<void> {
    const { fromAccountId, toAccountId, amount } = transferDto;

    // Start a new transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch accounts within the transaction
      const fromAccount = await queryRunner.manager.findOne(Account, fromAccountId);
      const toAccount = await queryRunner.manager.findOne(Account, toAccountId);

      if (!fromAccount || !toAccount) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      if (fromAccount.balance < amount) {
        throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
      }

      // Update balances
      fromAccount.balance -= amount;
      toAccount.balance += amount;

      // Save updated accounts
      await queryRunner.manager.save(fromAccount);
      await queryRunner.manager.save(toAccount);

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}

````

- Iniciamos una transacción creando un QueryRunner.
- Se realiza las operaciones necesarias como obtener las cuentas, verificar que existan y tengan saldo para  actualizar los datos.
- Se confirman los cambios si todas las operaciones fueron realizadas con exito.
- Se manejan los errores revirtiendo la transacción para asegurar que ninguna operación parcial quede aplicada.
- Se libera el recurso, en este caso, el QueryRunner que manejó la transacción.

## Usando async/await: ¿cómo se puede aprovechar el paralelismo? 

El paralelismo se puede aprovechar mediante el uso de Promise.all() o Promise.allSettled() para manejar múltiples tareas asincrónicas de forma simultánea que son independiente una de la otra.

Cuando se utiliza await en una función async, se espera a que una operación asincrónica se complete antes de continuar con la siguiente línea de código. Sin embargo, si hay varias operaciones asincrónicas independientes que pueden ejecutarse al mismo tiempo sin depender unas de otras, se pueden esperar simultáneamente utilizando Promise.all() o también con Promise.allSettled().

## Entrega: 

Un repositorio en GitHub con el desarrollo, incluyendo instrucciones claras para su ejecución (README). 
Puedes proporcionar un entorno en línea para demostrar el proyecto funcionando, como Heroku o similar, si es posible. 
Plazo: 4 días.