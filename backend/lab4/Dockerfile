FROM gradle:jdk11 AS build

COPY settings.gradle ./
COPY standart-build.gradle ./build.gradle
COPY gradlew ./
COPY gradle/ gradle/
COPY src src

RUN ./gradlew clean build --no-daemon

FROM jboss/wildfly:20.0.1.Final

WORKDIR ./wildfly

COPY --from=build /home/gradle/build/libs/ ./standalone/deployments/
COPY ./standalone.xml ./standalone/configuration/
COPY ./wildfly-20.0.1.Final/modules/system/layers/base/org/postgresql/main/ ./modules/system/layers/base/org/postgresql/main/

RUN /opt/jboss/wildfly/bin/add-user.sh admin password123 --silent

EXPOSE 12030 9990

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]