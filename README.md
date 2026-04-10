**set-up**

ssh server@192.168.20.83

1. rm -rf notatblokk-app
2. git clone https://github.com/Benjamin-LucasM/notatblokk-app.git
3. cd notatblokk-app/server/
4. npm install
5. npm audit fix
6. npm rebuild
7. node server.js

server available på chrome: 192.168.20.83:6767

**GitHub Terminal**

1. git add .
2. git commit -m "comment"
    ~kanskje "-a"
3. git push

funket fint lokalt på pc men å poste notater og todos fungerer ikke på proxmox serveren.