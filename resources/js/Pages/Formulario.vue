<template>
    <div class="page" :style="{ backgroundImage: `url(${bg})` }">
        <!-- NAVBAR SUPERIOR -->
        <header class="nav-bar">
            <div class="nav-inner">
                <div class="logo-area">
                    <img :src="logo" alt="Logo Cuentos de Viaje" />
                    <span class="logo-text">Cuentos de Viaje</span>
                </div>

                <button class="help-btn" type="button">
                    <span>Ayuda</span>
                </button>
            </div>
        </header>

        <!-- CONTENIDO -->
        <main class="inner">
            <section class="form-card">
                <!-- Breadcrumb -->
                <div class="breadcrumb">
                    <a href="#">Iniciar sesión</a>
                    <span class="separator">›</span>
                    <span class="current">Formulario de Viaje</span>
                </div>

                <h2 class="section-title">Formulario de Viaje</h2>

                <!-- TÍTULO -->
                <div class="field-group">
                    <label for="titulo">Título</label>
                    <input
                        id="titulo"
                        :class="[
                            'text-input',
                            { 'input-error': errors.titulo },
                        ]"
                        v-model="titulo"
                        placeholder="Mi viaje a Costa Rica"
                    />
                </div>

                <!-- DESTINO / ORIGEN -->
                <div class="field-group">
                    <label for="destino-input">Destino</label>

                    <div class="destino-row">
                        <div class="segment-control">
                            <input
                                type="radio"
                                id="origen"
                                value="origen"
                                v-model="tipoDestino"
                            />
                            <label class="segment left" for="origen">
                                Origen
                            </label>

                            <button
                                class="swap-btn"
                                type="button"
                                @click="toggleDestino"
                            >
                                ⇄
                            </button>

                            <input
                                type="radio"
                                id="destino"
                                value="destino"
                                v-model="tipoDestino"
                            />
                            <label class="segment" for="destino">
                                Destino
                            </label>
                        </div>
                    </div>

                    <div class="autocomplete">
                        <input
                            id="destino-input"
                            :class="[
                                'text-input',
                                { 'input-error': errors.destino },
                            ]"
                            v-model="lugarActual"
                            :placeholder="placeholderLugar"
                            autocomplete="off"
                        />

                        <ul
                            v-if="sugerencias && sugerencias.length"
                            class="suggestions"
                        >
                            <li
                                v-for="(s, i) in sugerencias"
                                :key="i"
                                @click="seleccionarSugerencia(s)"
                            >
                                {{ s }}
                            </li>
                        </ul>
                    </div>

                    <!-- RESUMEN ORIGEN / DESTINO -->
                    <div class="route-summary">
                        <div class="route-pill">
                            <span class="route-label">Origen</span>
                            <span class="route-value">
                                {{ origenTexto || "Sin especificar" }}
                            </span>
                        </div>
                        <div
                            :class="[
                                'route-pill',
                                { 'pill-error': errors.destino },
                            ]"
                        >
                            <span class="route-label">Destino</span>
                            <span class="route-value">
                                {{ destinoTexto || "Sin especificar" }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- FECHAS -->
                <div class="field-group">
                    <label for="fecha-inicio">Fecha</label>

                    <div class="date-row">
                        <div
                            :class="[
                                'date-input',
                                { 'input-error': errors.fechaInicio },
                            ]"
                        >
                            <span>Inicio</span>
                            <input
                                id="fecha-inicio"
                                type="date"
                                v-model="fechaInicio"
                            />
                        </div>

                        <div
                            :class="[
                                'date-input',
                                { 'input-error': errors.fechaFinal },
                            ]"
                        >
                            <span>Final</span>
                            <input
                                id="fecha-final"
                                type="date"
                                v-model="fechaFinal"
                            />
                        </div>
                    </div>
                </div>

                <!-- ACTIVIDADES -->
                <div class="field-group">
                    <div class="activities-header">
                        <span>Actividades</span>
                        <button
                            class="new-activity-btn"
                            type="button"
                            @click="agregarActividad"
                        >
                            Nueva Actividad
                        </button>
                    </div>

                    <div
                        v-for="(act, i) in actividades"
                        :key="i"
                        class="activity-card"
                    >
                        <!-- COLUMNA AMARILLA (HORA) -->
                        <div class="activity-time">
                            <span class="time-display">
                                {{ formatHora(act.hora) }}
                            </span>
                            <input
                                type="time"
                                class="time-native"
                                v-model="act.hora"
                            />
                        </div>

                        <!-- CONTENIDO ACTIVIDAD -->
                        <div class="activity-content">
                            <div class="activity-top-row">
                                <input
                                    class="activity-title-input"
                                    v-model="act.titulo"
                                    placeholder="Visita a la playa de Teulada"
                                />
                                <button
                                    class="delete-activity-btn"
                                    @click="eliminarActividad(i)"
                                >
                                    Eliminar
                                </button>
                            </div>

                            <textarea
                                class="activity-desc"
                                v-model="act.descripcion"
                                placeholder="Añade una breve descripción de la actividad..."
                            ></textarea>

                            <!-- IMÁGENES -->
                            <div
                                v-if="act.imagenes && act.imagenes.length"
                                class="images-container"
                            >
                                <div
                                    v-for="(img, idx) in act.imagenes"
                                    :key="idx"
                                    class="activity-image-wrapper"
                                >
                                    <img
                                        :src="img.url"
                                        class="activity-image"
                                    />
                                    <button
                                        class="remove-image-btn"
                                        @click="quitarImagen(i, idx)"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <label class="upload-label">
                                Agregar imagen
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    @change="subirImagen(i, $event)"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <!-- TIPO DE VIAJE -->
                <div class="field-group">
                    <label for="tipo-viaje">Tipo de viaje</label>
                    <select
                        id="tipo-viaje"
                        :class="[
                            'select-input',
                            { 'input-error': errors.tipoViaje },
                        ]"
                        v-model="tipoViaje"
                    >
                        <option disabled value="">
                            Selecciona un tipo de viaje...
                        </option>
                        <option value="Playa">Playa</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <!-- NOTAS -->
                <div class="field-group">
                    <label for="notas-viaje">Notas de viaje</label>
                    <textarea
                        id="notas-viaje"
                        class="text-area"
                        v-model="notas"
                        placeholder="Escribe tus notas de viaje..."
                    ></textarea>
                </div>

                <!-- BOTÓN GUARDAR + MENSAJE -->
                <div class="actions-row">
                    <span
                        v-if="statusMessage"
                        class="status-message"
                        :class="statusType"
                    >
                        {{ statusMessage }}
                    </span>

                    <button
                        type="button"
                        class="save-btn"
                        @click="guardarViaje"
                    >
                        Guardar viaje
                    </button>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import logo from "./assets/logo.png";
import bg from "./assets/BGFormulario.png";

/* ESTADOS PRINCIPALES */
const titulo = ref("");
const tipoDestino = ref("origen");
const origenTexto = ref("");
const destinoTexto = ref("");
const fechaInicio = ref("");
const fechaFinal = ref("");
const tipoViaje = ref("");
const notas = ref("");

/* MENSAJES */
const statusMessage = ref("");
const statusType = ref(""); // 'success' | 'error'

/* ERRORES POR CAMPO */
const defaultErrors = {
    titulo: false,
    destino: false,
    tipoViaje: false,
    fechaInicio: false,
    fechaFinal: false,
};
const errors = ref({ ...defaultErrors });

const resetErrors = () => {
    errors.value = { ...defaultErrors };
};

/* AUTOCOMPLETE */
const destinos = [
    "Costa Rica",
    "Teulada",
    "Madrid",
    "Barcelona",
    "París",
    "Londres",
    "Tokio",
    "Roma",
    "Berlín",
    "Nueva York",
    "Seúl",
    "Bangkok",
    "Ciudad de México",
    "Mérida",
    "Buenos Aires",
    "Santiago de Chile",
];
const sugerencias = ref([]);

/* ACTIVIDADES */
const actividades = ref([
    {
        hora: "10:00",
        titulo: "Visita a la playa de Teulada",
        descripcion: "",
        imagenes: [],
    },
]);

/* INPUT DINÁMICO ORIGEN / DESTINO */
const lugarActual = computed({
    get() {
        return tipoDestino.value === "origen"
            ? origenTexto.value
            : destinoTexto.value;
    },
    set(v) {
        if (tipoDestino.value === "origen") {
            origenTexto.value = v;
        } else {
            destinoTexto.value = v;
        }

        if (!v.trim()) {
            sugerencias.value = [];
            return;
        }

        sugerencias.value = destinos.filter((d) =>
            d.toLowerCase().includes(v.toLowerCase())
        );
    },
});

const placeholderLugar = computed(() =>
    tipoDestino.value === "origen"
        ? "Escribe tu lugar de origen..."
        : "Escribe tu destino..."
);

const seleccionarSugerencia = (s) => {
    lugarActual.value = s;
    sugerencias.value = [];
};

const toggleDestino = () => {
    tipoDestino.value = tipoDestino.value === "origen" ? "destino" : "origen";
};

/* ACTIVIDADES MÉTODOS */
const agregarActividad = () => {
    actividades.value.push({
        hora: "10:00",
        titulo: "",
        descripcion: "",
        imagenes: [],
    });
};

const eliminarActividad = (i) => {
    const act = actividades.value[i];
    if (act?.imagenes) {
        act.imagenes.forEach((img) => {
            if (img?.url) URL.revokeObjectURL(img.url);
        });
    }
    actividades.value.splice(i, 1);
};

const subirImagen = (i, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const act = actividades.value[i];
    if (!act) return;

    if (!act.imagenes) act.imagenes = [];

    files.forEach((file) => {
        const url = URL.createObjectURL(file);
        act.imagenes.push({ file, url });
    });

    e.target.value = "";
};

const quitarImagen = (activityIndex, imageIndex) => {
    const act = actividades.value[activityIndex];
    if (!act || !act.imagenes) return;

    const img = act.imagenes[imageIndex];
    if (img?.url) URL.revokeObjectURL(img.url);

    act.imagenes.splice(imageIndex, 1);
};

/* FORMATO HORA */
const formatHora = (hora) => {
    const [hh, mm] = hora.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return hora;

    const isPM = hh >= 12;
    const h12 = ((hh + 11) % 12) + 1;
    const suf = isPM ? "p. m." : "a. m.";

    return `${h12}:${mm.toString().padStart(2, "0")} ${suf}`;
};

/* GUARDAR (VALIDACIONES BÁSICAS) */
const limpiarEstado = () => {
    statusMessage.value = "";
    statusType.value = "";
    resetErrors();
};

const guardarViaje = () => {
    limpiarEstado();

    // 1. Destino obligatorio
    if (!destinoTexto.value.trim()) {
        errors.value.destino = true;
        statusType.value = "error";
        statusMessage.value = "Destino obligatorio.";
        return;
    }

    // 2. Validar fechas
    if (
        fechaInicio.value &&
        fechaFinal.value &&
        fechaFinal.value < fechaInicio.value
    ) {
        errors.value.fechaInicio = true;
        errors.value.fechaFinal = true;
        statusType.value = "error";
        statusMessage.value = "Fechas no válidas.";
        return;
    }

    // 3. Campos obligatorios generales
    let missing = false;

    if (!titulo.value.trim()) {
        errors.value.titulo = true;
        missing = true;
    }
    if (!tipoViaje.value) {
        errors.value.tipoViaje = true;
        missing = true;
    }
    if (!fechaInicio.value) {
        errors.value.fechaInicio = true;
        missing = true;
    }
    if (!fechaFinal.value) {
        errors.value.fechaFinal = true;
        missing = true;
    }

    if (missing) {
        statusType.value = "error";
        statusMessage.value = "Completa todos los campos obligatorios.";
        return;
    }

    // 4. Todo bien
    statusType.value = "success";
    statusMessage.value = "Viaje guardado con éxito.";
};
</script>

<style scoped>
/* RESET */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
}

.page {
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

/* NAVBAR */
.nav-bar {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.nav-inner {
    max-width: 1200px;
    margin: auto;
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 4px;
}

.logo-area img {
    height: 50px;
}

.logo-text {
    font-size: 20px;
    font-weight: 600;
    color: #d4af37;
}

.help-btn {
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid #111;
    background: transparent;
    cursor: pointer;
}

/* CONTENEDOR */
.inner {
    max-width: 1200px;
    margin: 32px auto;
    padding: 0 24px;
}

.form-card {
    background: #f7f7f7;
    border-radius: 14px;
    padding: 26px 32px;
    max-width: 660px;
    margin: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

/* BREADCRUMB Y TÍTULO */
.breadcrumb {
    display: flex;
    gap: 6px;
    font-size: 13px;
    color: #9ca3af;
    margin-bottom: 6px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 18px;
}

.field-group {
    margin-bottom: 18px;
}

.field-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 6px;
}

/* INPUTS GENERALES */
.text-input,
.text-area,
.select-input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 11px 13px;
    font-size: 14px;
    background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.text-area {
    min-height: 70px;
    resize: vertical;
}

/* ESTADO ERROR */
.input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

/* SEGMENT ORIGEN/DESTINO */
.destino-row {
    margin-bottom: 8px;
}

.segment-control {
    display: flex;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    overflow: hidden;
    position: relative;
}

.segment-control input {
    display: none;
}

.segment {
    flex: 1;
    text-align: center;
    padding: 8px 16px;
    font-size: 13px;
    color: #9ca3af;
}

.segment.left {
    border-right: 1px solid #e5e7eb;
}

.segment-control input:checked + .segment {
    background: #fff;
    color: #4b5563;
    font-weight: 600;
}

.swap-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: #d4af37;
    border: none;
    cursor: pointer;
}

/* AUTOCOMPLETE */
.autocomplete {
    position: relative;
    margin-bottom: 10px;
}

.suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 4px 0;
    list-style: none;
    z-index: 10;
}

.suggestions li {
    padding: 6px 10px;
    cursor: pointer;
}

/* RESUMEN ORIGEN/DESTINO */
.route-summary {
    display: flex;
    gap: 8px;
    margin-top: 6px;
}

.route-pill {
    flex: 1;
    background: #fff;
    border-radius: 10px;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.route-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 2px;
}

.route-value {
    font-size: 13px;
    color: #374151;
}

.pill-error {
    border-color: #ef4444;
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

/* FECHAS */
.date-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.date-input {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 9px 11px;
    background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.date-input.input-error {
    border-color: #ef4444;
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

/* ACTIVIDADES */
.activities-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
}

.new-activity-btn {
    background: #d4af37;
    border-radius: 6px;
    border: none;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

/* CARD ACTIVIDAD */
.activity-card {
    display: grid;
    grid-template-columns: 120px 1fr;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    margin-bottom: 12px;
    overflow: hidden;
}

/* COLUMNA HORA */
.activity-time {
    background: #d4af37;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 0;
    position: relative;
}

.time-display {
    font-size: 18px;
    font-weight: 700;
}

.time-native {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

/* CONTENIDO ACTIVIDAD */
.activity-content {
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.activity-top-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.activity-title-input {
    flex: 1;
    padding: 7px 9px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

.delete-activity-btn {
    padding: 4px 8px;
    border-radius: 6px;
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
}

.activity-desc {
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    padding: 7px 9px;
    min-height: 42px;
}

/* IMÁGENES */
.images-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
}

.activity-image-wrapper {
    position: relative;
    display: inline-block;
}

.activity-image {
    max-width: 190px;
    max-height: 110px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    object-fit: cover;
}

.remove-image-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    border: none;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    cursor: pointer;
}

/* UPLOAD */
.upload-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 6px;
    border: 1px dashed #cbd5e1;
    background: #f9fafb;
    font-size: 12px;
    color: #6b7280;
    cursor: pointer;
    margin-top: 6px;
}

.upload-label input {
    display: none;
}

/* GUARDAR */
.actions-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.save-btn {
    background: #d4af37;
    border-radius: 999px;
    border: none;
    padding: 8px 22px;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    cursor: pointer;
}

.status-message {
    font-size: 13px;
}

.status-message.error {
    color: #b91c1c;
}

.status-message.success {
    color: #15803d;
}

/* HOVER CON SOMBRA (GENERAL, SIN EL CÍRCULO) */
.help-btn,
.new-activity-btn,
.delete-activity-btn,
.remove-image-btn,
.save-btn,
.upload-label {
    transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.help-btn:hover,
.new-activity-btn:hover,
.delete-activity-btn:hover,
.remove-image-btn:hover,
.save-btn:hover,
.upload-label:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
}

/* HOVER ESPECIAL PARA EL BOTÓN CÍRCULO */
.swap-btn {
    transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.swap-btn:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transform: translate(-50%, -50%) scale(1.03);
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .activity-card {
        grid-template-columns: 100px 1fr;
    }

    .time-display {
        font-size: 15px;
    }

    .route-summary {
        flex-direction: column;
    }
}
</style>
