# API REST con el framework Express (MongoDB)

## Instrucciones de uso

Crear el archivo .env con variables de entorno

```bash
API_PORT=3000
JWT_KEY=super_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_NAME=todos
DB_USER=root
DB_PASSWORD=root
```

```bash
# Instalar dependencias
npm i

# Insertar datos de prueba
npm run seed

# Iniciar API
npm run dev
```

## Testing
```bash
# Correr pruebas unitarias
npm run test

# Correr pruebas unitarias y generar reporte de coverage
npm run test:coverage
```

## Debugging
El repo está configurado para utilizar Visual Studio Code como herramienta para depurar.
Por mas info: https://code.visualstudio.com/docs/nodejs/nodejs-debugging