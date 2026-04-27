FROM jboss/wildfly:20.0.1.Final
LABEL authors="yaroslavmakogon"

WORKDIR ./wildfly

COPY ./standalone.xml ./standalone/configuration/

COPY ./build/libs/lab4-1.0-SNAPSHOT.war ./standalone/deployments/

COPY ./wildfly-20.0.1.Final/modules/system/layers/base/org/postgresql/main/module.xml ./modules/system/layers/base/org/postgresql/main/

COPY ./wildfly-20.0.1.Final/modules/system/layers/base/org/postgresql/main/postgresql-42.7.8.jar ./modules/system/layers/base/org/postgresql/main/

RUN /opt/jboss/wildfly/bin/add-user.sh admin password123 --silent

EXPOSE 12030 9990

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]