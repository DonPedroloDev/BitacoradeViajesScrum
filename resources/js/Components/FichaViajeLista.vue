<template>
    <div class="rounded-md border-2 p-5">
        <p class="text-sm font-bold">{{ trip.trip_type }}</p>
        <h3 class="text-lg font-semibold mt-1">{{ trip.title }}</h3>
        <p>Partiendo de: {{ trip.origin }}</p>
        <p>Por: {{ trip.user.name }}</p>

        <p
            class="bg-neutral-200 rounded-md p-1 font-semibold inline-block my-4"
        >
            {{ trip.destination }}
        </p>

        <p><span class="font-semibold">Notas:</span> {{ trip.notes }}</p>

        <p class="font-semibold my-2">Duración del viaje</p>
        <p class="mb-2">
            {{ trip.start_date }} -
            {{ trip.end_date }}
        </p>

        <img
            v-if="trip.activities.length && trip.activities[0].images.length"
            class="w-full h-40 rounded-md object-cover"
            :src="trip.activities[0].images[0].image_url"
            alt=""
        />

        <div v-if="trip.activities[0].images[0] == undefined">
            <div
                class="w-full h-40 rounded-md bg-neutral-400 flex items-center justify-center"
            >
                <p class="text-center p-10 text-white">Sin imagen disponible</p>
            </div>
        </div>

        <div
            data-testid="delete-button"
            class="bg-red-500 py-1 px-3 rounded-md text-white inline-block mt-5 cursor-pointer font-semibold"
            @click="deleteTrip"
        >
            <p>Eliminar</p>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["tripDeleted"]);

const deleteTrip = async () => {
    try {
        await axios.delete(`api/trips/${props.trip.id}`);
        emit("tripDeleted", props.trip.id);
    } catch (error) {
        console.error(error);
    }
};
</script>
