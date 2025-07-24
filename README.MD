Way to start this application:

1)Do NOT forget to nvm use 12 and "npm i" - it will install all dependencies from the package.json.
If nvm is not installed, download it by command "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh" or from the site and install it by command (nvm install latest). Then set PATH for it:

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

This will help launch nvm from terminal in intellij idea.

2) IF mySQL is not installed. Install it, then in terminal in intellij idea, set PATH for it:

export PATH="/c/Program Files/MySQL/MySQL_Server_8.0/bin:$PATH"
If you have folder with white spaces in name - rename it to name without white spaces, so you can properly write it in your terminal as written above.

If mySql installed, then:
If this is a linux, or mac. Then, before starting app - start mysql server from the terminal in the nodeApi folder with using of 
"mysql.server start". If it's windows - skip this and proceed to next step.
3)After it login to mySql:
1. For linux or mac:
sudo mysql -u root -p
Ввести пароль "MAC"(запуск super user)
2. For Windows:
mysql -u root -p
Ввести пароль mysql.server, который был задан при установке mysql.server.
3. Если потребует, ввести пароль базы данных "password" - is a real password)



4) After it use this command for start application:
node ./src/index.js - to launch this express app
OR
npm start
DO NOT use npm react start - it won't work, but npm start - actually works

App description:
Это приложение не использует соккет для передачи данных. А использует соединение к базе данных и express app
для того чтобы выводить разные результаты. И в JSON ответе мы выводим данные прямо из базы данных



Problem solving:
Problem solving with starting app (related to mysql.server has not been started)

1) Описание проблемы:
По какой-то причине запуск node ./src/index.js падает, а npm start не работает

Ошибка "events.js:287
              throw er; // Unhandled 'error' event
              ^
        
        Error: connect ECONNREFUSED 127.0.0.1:3306
"
3306 - это порт mysql, значит проблемы с базой данных

Проблема в том что перед запуском приложения необходимо использовать команду "mysql.server start"


2) РЕШЕНИЕ!!!
1.Запустить mysql командой:
  mysql.server start
2. приконектится к базе данных, используя:
   sudo mysql -u root -p
   Ввести пароль "MAC"(запуск super user)
   а а затем пароль базы данных "password" - is a real password)
