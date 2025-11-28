<template>
    <h1>Lista</h1>
</template>

<script setup>
import { Head, Link } from "@inertiajs/vue3";
import axios from "axios";
import { onMounted } from "vue";

onMounted(async () => {
    const res = await axios.get("/api/trips");
    console.log(res.data);
});
</script>
