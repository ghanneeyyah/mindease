FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN sed -i 's/\r$//' mvnw \
    && chmod +x mvnw \
    && ./mvnw package -DskipTests -B \
    && cp target/chatbot-0.0.1-SNAPSHOT.jar app.jar \
    && rm -rf target /root/.m2 \
    && ln -sf "$(which java)" /usr/local/bin/java

EXPOSE 8081
ENTRYPOINT ["/usr/local/bin/java", "-Xmx256m", "-Xms64m", "-jar", "app.jar"]