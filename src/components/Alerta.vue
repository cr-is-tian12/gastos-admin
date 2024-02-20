<script>

</script>

<template>
    <div 
        class="alerta"
    >
        <slot></slot>
    </div>

</template>

<style scoped>
    .alerta{
        padding: 1rem;
        font-size: 1.6rem;
        text-transform: uppercase;
        font-weight: 900;
        background-color: var(--blanco);
        text-align: center;
        border-left: .5rem solid #b91c1c;
        color: #b91c1c;
        margin-bottom: 1rem;
    }
</style>