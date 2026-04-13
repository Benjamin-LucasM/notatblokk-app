**set-up**

ssh server@192.168.20.83

1. rm -rf notatblokk-app
2. git clone https://github.com/Benjamin-LucasM/notatblokk-app.git
3. cd notatblokk-app/server/
4. npm install
5. npm audit fix
6. npm rebuild
7. node server.js > log.txt 

server available på chrome: 192.168.20.83:6767

**------------------------------------------**

**GitHub Terminal**

1. git add .
2. git commit -a -m "comment"
3. git push

**-------**

**Logs**

hvis noen skriver noe upassende i notater kan serveren stanses
bruk:

"cat log.txt"

da får du se hva hvilke ip-adresser har gjort

**-----------------------------------------**