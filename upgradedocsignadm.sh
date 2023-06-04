docker build -t docsignadmin .
docker stop docsignadmin
docker rm docsignadmin
docker run -d --name=docsignadmin -p 58585:9526 --restart=always -v /opt/docsign/log:/app/log msapi:latest


