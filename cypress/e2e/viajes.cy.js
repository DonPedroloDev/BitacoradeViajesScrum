/// <reference types="cypress" />

describe("Listado de viajes", () => {
    const URL = "http://127.0.0.1:8000";

    beforeEach(() => {
        cy.intercept("GET", "/api/trips").as("getTrips");
        cy.visit(URL);
        cy.wait("@getTrips");
    });

    it("muestra el banner y textos principales", () => {
        cy.get("img[alt='Logo']").should("exist");
        cy.contains("Cuentos de viajes para almas aventureras").should("exist");
        cy.contains("Animate a compartir tus experiencias con nosotros").should(
            "exist"
        );
    });

    it("muestra una tarjeta de viaje con información básica", () => {
        cy.get(".rounded-md.border-2")
            .first()
            .within(() => {
                cy.contains("Partiendo de:").should("exist");
                cy.contains("Notas:").should("exist");
                cy.contains("Duración del viaje").should("exist");
            });
    });

    it("muestra la imagen cuando la actividad tiene imágenes", () => {
        cy.get(".rounded-md.border-2")
            .first()
            .within(() => {
                cy.get("img").should("exist");
            });
    });

    it("muestra el placeholder cuando NO hay imágenes", () => {
        cy.get(".rounded-md.border-2")
            .eq(1)
            .within(() => {
                cy.contains("Sin imagen disponible").should("exist");
                cy.get("img").should("not.exist");
            });
    });

    it("hace DELETE cuando se hace clic en Eliminar", () => {
        cy.intercept("DELETE", "/api/trips/*").as("deleteTrip");

        cy.get(".rounded-md.border-2")
            .first()
            .within(() => {
                cy.contains("Eliminar").click();
            });

        cy.wait("@deleteTrip").its("response.statusCode").should("eq", 200);
    });
});
