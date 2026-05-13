FROM quay.io/keycloak/keycloak:26.6.1

COPY ./realm-lab4.json /opt/keycloak/data/import/

CMD ["start-dev", "--import-realm"]