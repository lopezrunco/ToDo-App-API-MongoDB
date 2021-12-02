## Escenario VM

### Creacion de VM e instalacion de OS
- Crear nueva maquina
- Asignar al menos 1.5Gb de RAM
- Asignar disco dinamico de al menos unos 15Gb
- Intentar arrancar la maquina
- Una vez lo pida, asignar la ISO para arrancar la instalacion del OS
- Instalar el SO
- Habilitar la opcion para instalar OpenSSH
- Apagar la VM
- Arrancar la VM

### Forward de puertos
En caso de ser un servidor en cloud, simplemente abir los puertos necesarios por ejemplo 80/443

#### API (con PM2) (OPCIONAL)
Name: Tasky API
Protocol: TCP
Host Port: 8080
Guest Port: 3000

#### API (con PM2 + Nginx)
Name: Tasky API
Protocol: TCP
Host Port: 9090
Guest Port: 80

#### SSH
Name: SSH
Protocol: TCP
Host Port: 1022
Guest Port: 22

### Paso a paso para instalar y ejecutar el API
```bash
# Conectarse al servidor por SSH
# ssh NOMBRE_DE_USUARIO@DIRECCION_DEL_SERVER -p PUERTO_SSH
ssh NOMBRE_DE_USUARIO@127.0.0.1 -p 1022
# Actualiza dependencias del OS
sudo apt update
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Cerrar la sesion de la VM y entrar nuevamente para que funcione NVM
# Install node with nvm (alternativas abajo)
# Ultima version (opcion 1)
nvm install node
# Version LTS (opcion 2)
nvm install --lts
# Instalar pm2
npm install pm2@latest -g
# Clonar la app en el server / tambien se puede copiar
# Usar personal access token de github como password https://github.com/settings/tokens
# Instalar dependencias
npm i
# Generar o copiar el archivo .env con los valores correspondientes
# Obtener comando para reinicio de app automatico
pm2 startup
# Copiar y ejecutar el comando entregado anteriormente
# Ejecutar app con pm2
pm2 start src/api.js
# Freeze para que pm2 recuerde que apps reiniciar de forma automatica
pm2 save
# Instalamos server Nginx
sudo apt install nginx
# Verificamos estado de Nginx
sudo systemctl status nginx
# Borrar el contenido del archivo default y pegar el contenido de nginx.conf
sudo nano /etc/nginx/sites-available/default
# Recargar la configuracion de Nginx
sudo systemctl reload nginx
```

## Utils
```bash
# Copiar archivos desde la maquina local a un server remoto
scp -P 1022 .env NOMBRE_DE_USUARIO@127.0.0.1:RUTA_EN_EL_SERVIDOR
# Monitor de PM2
pm2 monit
# Muestra la ruta absoluta donde se esta actualmente
pwd
```

## Mas info
- https://pm2.keymetrics.io/docs/usage/startup/
- https://github.com/nvm-sh/nvm