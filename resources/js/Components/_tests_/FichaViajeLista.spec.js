import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FichaViajeLista from "../FichaViajeLista.vue";
import axios from "axios";

vi.mock("axios", () => ({
    default: {
        delete: vi.fn(),
    },
}));

const baseTrip = {
    id: 1,
    trip_type: "Playa",
    title: "Vacaciones de Verano",
    origin: "Ciudad de México",
    user: { name: "Test User" },
    destination: "Cancún",
    notes: "Viaje para relajarme.",
    start_date: "2025-06-10",
    end_date: "2025-06-15",
    activities: [
        {
            images: [{ image_url: "https://example.com/imagen.jpg" }],
        },
    ],
};

describe("FichaViajeLista.vue", () => {
    beforeEach(() => {
        axios.delete.mockReset();
    });

    it("muestra la información básica del viaje", () => {
        const wrapper = mount(FichaViajeLista, {
            props: { trip: baseTrip },
        });

        const text = wrapper.text();

        expect(text).toContain("Playa");
        expect(text).toContain("Vacaciones de Verano");
        expect(text).toContain("Partiendo de: Ciudad de México");
        expect(text).toContain("Por: Test User");
        expect(text).toContain("Cancún");
        expect(text).toContain("Notas: Viaje para relajarme.");
        expect(text).toContain("2025-06-10 - 2025-06-15");
    });

    it("muestra la imagen cuando la actividad tiene imágenes", () => {
        const wrapper = mount(FichaViajeLista, {
            props: { trip: baseTrip },
        });

        const img = wrapper.find("img");
        expect(img.exists()).toBe(true);
        expect(img.attributes("src")).toBe("https://example.com/imagen.jpg");
        expect(wrapper.text()).not.toContain("Sin imagen disponible");
    });

    it("muestra el placeholder cuando no hay imágenes", () => {
        const tripSinImagen = {
            ...baseTrip,
            activities: [
                {
                    images: [],
                },
            ],
        };

        const wrapper = mount(FichaViajeLista, {
            props: { trip: tripSinImagen },
        });

        expect(wrapper.find("img").exists()).toBe(false);
        expect(wrapper.text()).toContain("Sin imagen disponible");
    });

    it("llama a axios.delete y emite el evento 'tripDeleted' al hacer clic en Eliminar", async () => {
        axios.delete.mockResolvedValue({ status: 200 });

        const wrapper = mount(FichaViajeLista, {
            props: { trip: baseTrip },
        });

        const deleteButton = wrapper.get('[data-testid="delete-button"]');
        await deleteButton.trigger("click");

        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toHaveBeenCalledWith(`api/trips/${baseTrip.id}`);

        const events = wrapper.emitted("tripDeleted");
        expect(events).toBeTruthy();
        expect(events[0]).toEqual([baseTrip.id]);
    });
});
