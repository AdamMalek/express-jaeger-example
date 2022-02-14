Simple example of using express with Jaeger.

1. run Jaeger:
 ```   
 docker run -d --name jaeger \
   -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
   -p 5775:5775/udp \
   -p 6831:6831/udp \
   -p 6832:6832/udp \
   -p 5778:5778 \
   -p 16686:16686 \
   -p 14250:14250 \
   -p 14268:14268 \
   -p 14269:14269 \
   -p 9411:9411 \
   jaegertracing/all-in-one:1.31
``` 
2. npm install
3. run all services:
    - npm run a
    - npm run b
    - npm run c
    - npm run d
4. open http://localhost:8001/start
5. open jaeger: http://localhost:16686/search
6. traces should be there