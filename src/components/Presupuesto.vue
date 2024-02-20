<script setup>
    import { ref } from 'vue';
    import Alerta from './Alerta.vue';

    const presupuesto = ref(0);
    
    const error = ref('');

    const emit = defineEmits(['definir-presupuesto'])
    
    const definirPresupuesto = () => {
        if(presupuesto.value <= 0){
            error.value = 'Presupuesto no valido';

            setTimeout(() => {
                error.value = '';
            }, 3100);
           
            return
        }

        emit('definir-presupuesto', presupuesto.value)
    }
</script>

<template>
   <form 
        class="presupuesto" 
        @submit.prevent="definirPresupuesto"
    >

    <Alerta v-if="error">
       {{ error }}
    </Alerta>

        <div class="campo">
            <label for=""> Definir Presupesto</label>
            
            <input
                type="number"
                class="nuevo-presupuesto"
                id="nuevo-presupuesto"
                placeholder="Añade tu presupuesto"
                min="0"
                v-model.number="presupuesto"
            />
        </div>

        <input type="submit" value="Definir Presupuesto" name="" id="">
   </form> 
</template>

<style scoped>
    .presupuesto{
        width: 100%;
    }

    .campo{
        display: grid;
        gap: 2rem;
    }

    .presupuesto input[type="number"]{
        background-color: var(--gris-claro);
        border-radius: 1rem;
        padding: 1rem;
        border: none;
        font-size: 2.2rem;
        text-align: center;
        
    }

    .presupuesto input[type="submit"]{
        background-color: var(--azul );
        border: none;
        width: 100%;
        padding: 1rem;
        font-size: 2rem;
        margin-top: 2rem;
        text-align: center;
        font-weight: 900;
        color: var(--blanco);
        transition: background-color 300ms ease;
    }

    .presupuesto input[type="submit"]:hover{
        background-color: #1048a4;
        cursor: pointer;
    }

    .presupuesto label{
        text-align: center;
        font-size: 2.2rem;
        letter-spacing: .2rem;
    }

</style>