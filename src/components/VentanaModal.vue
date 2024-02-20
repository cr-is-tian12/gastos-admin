<script setup>
    import imgCerrarModal from '../assets/img/cerrar.svg'
    import Alerta from './Alerta.vue';
    import { ref } from 'vue'

    import Borrar from '../assets/img/borrar.png';

    const emit = defineEmits(['cerrar-modal', 'update:nombre', 'update:cantidad', 'update:categoria', 'guardar-gasto', 'boton-borrar'])
    
    const props = defineProps({
        modal:{
            type: Object,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        cantidad: {
            type: [String, Number],
            required: true
        },
        categoria: {
            type: String,
            required: true
        },
        disponible: {
            type: Number,
            required: true
        },
        id: {
            type: [String, null],
            required: true
        }
    })

    const cantidadAnterior = props.cantidad

    const agregarGasto = () => {
        //validar que no tenga campos vacios
        // console.log(props)
        const { nombre, cantidad, categoria, disponible, id } = props;
        
        if([nombre, cantidad, categoria].includes('')){
            // console.log('Hay campos vacios')
            mensajeError.value = '*Los campos estan vacios*'
            setTimeout(() => {
                mensajeError.value = ''
            }, 3000);
            return 
        }

        //Validando cantidad
        if(cantidad <= 0){
            mensajeError.value = 'cantidad no valida'
            setTimeout(() => {
                mensajeError.value = ''
            }, 3000);
            return
        }

        if(id){
            //tomamos en cuenta la cantidad anterior 
            if(cantidad > cantidadAnterior + disponible){
                mensajeError.value= 'Has excedido tu presupuesto';
                setTimeout(() => {
                    mensajeError.value = ''
                }, 3000);
                return
            }
        }else{
            //Validando que el usuario no gaste más de lo disponible
            if(cantidad > disponible){
                mensajeError.value= 'Has excedido tu presupuesto';
                setTimeout(() => {
                    mensajeError.value = ''
                }, 3000);
                return
            }
        }

        emit('guardar-gasto')
    }

    const mensajeError = ref(''); 
</script>

<template>
  <div class="modal">
    <div class="cerrar-modal">
        <img 
            :src="imgCerrarModal" 
            alt="cerrar-modal"
            v-on:click="$emit('cerrar-modal')"
        >
    </div>

    <div 
        class="contenedor contenedor-formulario"
        :class="[ modal.animar ? 'animar' : 'cerrar']" >

        <form 
            class="nuevo-gasto"
            @submit.prevent="agregarGasto"
            >
            
            <legend>{{ id ? 'Editando Gastos' : 'Añadir Gastos' }}</legend>

            <Alerta v-if="mensajeError">{{ mensajeError }}</Alerta>

            <div class="campo">
                <label for="nombre">Nombre Gasto:</label>
                <input 
                    type="text" 
                    id="nombreGasto" 
                    placeholder="Añade el nombre del gasto"
                    :value="nombre" 
                    @input="$event => $emit('update:nombre', $event.target.value)"   
                >
            </div>
            <div class="campo">
                <label for="cantidad">Cantidad:</label>
                <input 
                    type="number" 
                    id="cantidad" 
                    placeholder="Añade la cantdad del gasto"
                    :value="cantidad"
                    @input="$event => $emit('update:cantidad', +$event.target.value)"
                    >
            </div>
            <div class="campo">
                <label for="cantidad">Categoria:</label>
                <select 
                    id="categoria"
                    :value="categoria"
                    @input="$event => $emit('update:categoria', $event.target.value)"
                >
                    <option value="">-- Seleccione --</option>
                    <option value="ahorro">Ahorro</option>
                    <option value="comida">Comida</option>
                    <option value="casa">Casa</option>
                    <option value="gastos">Gastos</option>
                    <option value="ocio">Ocio</option>
                    <option value="salud">Salud</option>
                    <option value="suscripciones">Suscripciones</option>
                </select>
            </div>

            <input 
                type="submit"
                :value="[id ? 'Guardar cambios':  'Añadir Gastos']">
        </form>

        <button 
        v-if="props.id"
        type="button" 
        class="btn-eliminar"
        @click="$emit('boton-borrar')"
        >
          <img 
            :src="Borrar" 
            alt="borrar"
            class="borrar">
      </button>

    </div>
  </div>
</template>

<style scoped>
    .btn-eliminar{
        margin-top: 7rem;
        cursor: pointer;
        border: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background-color: #1b1a1a;

        /* width: 100%; */
        
    }
    .borrar{
      width: 3rem;


    }

    .modal{
        position: absolute;
        background-color: rgb( 0 0 0 / 0.9);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .cerrar-modal{
        position: absolute;
        right: 3rem;
        top: 3rem;
    }
    .cerrar-modal img{
        width: 3rem;
        cursor: pointer;
    }

    .nuevo-gasto{
        margin: 10 auto 0 auto;
        display: grid;
        gap: 2rem;
    }
    .campo{
        display: grid;
        gap: 2rem;
    }

    .nuevo-gasto input,
    .nuevo-gasto select{
        background-color: var(--gris-claro);
        border-radius: 1rem;
        padding: 1rem;
        font-size: 2.2rem;
    }
    .nuevo-gasto label{
        color: var(--blanco);
        font-size: 3rem;
    }
    .nuevo-gasto input[type="submit"]{
        background-color: var(--azul);
        color: var(--blanco);
        font-weight: 700;
        cursor: pointer;
    }
    .nuevo-gasto legend{
        text-align: center;
        color: var(--blanco);
        font-size: 3rem;
        font-weight: 700;
        margin-top: 5rem;
    }

    .contenedor-formulario{
        transition-property: all;
        transition-duration: 300ms;
        transition-timing-function: ease-in;
        opacity: 0;
    }

    .contenedor-formulario.animar{
        opacity: 1;
    }
    .contenedor-formulario.cerrar{
        opacity: 0;
    }


</style>