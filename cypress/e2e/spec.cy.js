describe('template spec', () => {
  it('passes', () => {
    /// <reference types="cypress" />
    
    describe("Listado de viajes", () => {
      const URL = "http://127.0.0.1:8000";
    
      // Antes de cada prueba visitamos la página
      beforeEach(() => {
        // Interceptar el GET de los viajes para esperar a que carguen
        cy.intercept("GET", "/api/trips").as("getTrips");
    
        cy.visit(URL);
    
        cy.wait("@getTrips");
      });
    
      it("muestra el banner y los textos principales", () => {
        // Imagen del banner
        cy.get("img[alt='Logo']").should("exist");
            
        // Título grande
        cy.contains("Cuentos de viajes para almas aventureras").should("exist");
            
        // Subtítulo
        cy.contains("Animate a compartir tus experiencias con nosotros").should(
          "exist"
        );
      });
    
      it("muestra al menos una tarjeta de viaje con información básica", () => {
        cy.get(".rounded-md.border-2")
          .first()
          .within(() => {
            cy.contains("Partiendo de:").should("exist");
            cy.contains("Notas:").should("exist");
            cy.contains("Duración del viaje").should("exist");
          });
      });
    
      it("muestra la imagen cuando la actividad tiene imágenes", () => {
        // Asumimos que la PRIMERA tarjeta tiene imagen (por los seeders)
        cy.get(".rounded-md.border-2")
          .first()
          .within(() => {
            cy.get("img").should("exist");
          });
      });
    
      it("muestra el placeholder cuando NO hay imágenes", () => {
        // Asumimos que la SEGUNDA tarjeta no tiene imagen (por los seeders)
        cy.get(".rounded-md.border-2")
          .eq(1)
          .within(() => {
            cy.contains("Sin imagen disponible").should("exist");
            cy.get("img").should("not.exist");
          });
      });
    
      it("envía la solicitud DELETE cuando se hace clic en Eliminar", () => {
        // Interceptamos el DELETE
        cy.intercept("DELETE", "/api/trips/*").as("deleteTrip");
            
        cy.get(".rounded-md.border-2")
          .first()
          .within(() => {
            cy.contains("Eliminar").click();
          });
            
        cy.wait("@deleteTrip")
          .its("response.statusCode")
          .should("eq", 200);
      });
    });
    
    
    
  })
})