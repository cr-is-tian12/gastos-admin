<script setup>
  import Presupuesto from './components/Presupuesto.vue';
  import { ref, reactive, watch, computed, onMounted } from 'vue';
  import ControlPresupuesto from './components/ControlPresupuesto.vue';
  import VentanaModal from './components/VentanaModal.vue';
  import iconoGasto from './assets/img/nuevo-gasto.svg';
  import { generarID } from '../helpers';
  import Gastos from './components/Gastos.vue';

  import filtroCategoria from './components/FiltroCategorias.vue';
import Swal from 'sweetalert2';

  /*Estamos haciendo esto para darle una condición al presupuesto*/ 
  const presupuesto = ref(0);

  const definirPresupuesto = (cantidad) => {
    presupuesto.value = cantidad;
    disponible.value = cantidad;
  }

  const disponible = ref(0);

  const modal = reactive({
    mostrar: false,
    animar: false
  })

  const mostrarModal = () =>{
    modal.mostrar = true
    setTimeout(() => {
      modal.animar = true
    }, 300);
    
  }

  const cerrarModal = () =>{
    modal.animar = false

    setTimeout(() => {
      modal.mostrar = false
    }, 300);
  }

  const gasto = reactive({
    nombre: '',
    cantidad: '',
    categoria: '',
    id: null,
    fecha: Date.now()
  })

  const guardarGasto = () =>{
    console.log('Desde App.vue')

    if(gasto.id){
      //editando
      const { id } = gasto
      const i = gastos.value.findIndex(( gasto => gasto.id === id ))
      gastos.value[i] = {...gasto}
    }else{
        gastos.value.push({
        ...gasto,
        id: generarID()
      })
    }
    cerrarModal()
    //Reiniciar objeto (limpiando formulario al agregar gastos)
    reiniciarObjeto()
  }

  const gastos = ref([]);

  watch(gastos, () => {
    const totalGastado = gastos.value.reduce((total, gasto) => gasto.cantidad + total, 0)
    // console.log(totalGastado)
    gastado.value = totalGastado
    
    //reescribiendo disponible para restar 
    // disponible.value = presupuesto.value - totalGastado;
    },{
      deep: true
  })

  watch(gastos, () => {
    const restarDisponible = gastos.value.reduce((total, gasto) => gasto.cantidad + total, 0)
    // console.log(totalGastado)

    //reescribiendo disponible para restar 
    disponible.value = presupuesto.value - restarDisponible;

    localStorage.setItem('gastos', JSON.stringify(gastos.value))
    },{
      deep: true
  })

  const gastado = ref(0);

  const seleccionarGasto = (id) =>{
    // console.log(id)
    const listaGastoEditarNombre = gastos.value.filter(gasto => gasto.id === id)[0]
    Object.assign(gasto, listaGastoEditarNombre);
    mostrarModal()
  }

  watch(modal, () => {
    if(!modal.mostrar){
      reiniciarObjeto()
    }
  },{
    deep:true
  })

  const reiniciarObjeto = () => {
    Object.assign(gasto, {
      nombre: '',
      cantidad: '',
      categoria: '',
      id: null,
      fecha: Date.now()
      })
  }

  
  const btnTrash = () =>{
      // console.log('Eliminando gasto')
      Swal.fire({
        title: "¿Estas seguro?",
        text: "No podras revertirlo, ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminalo"
      }).then((result) => {
        if (result.isConfirmed) {

          gastos.value = gastos.value.filter( gastoState => gastoState.id !== gasto.id )
          cerrarModal()
          Swal.fire({
            title: "Eliminado",
            text: "Tu registro de gastos fue eliminado.",
            icon: "success"
          });
        }
      });
        
}
    

  //String vacio para leer el select
  const filtro = ref('')

  const gastosFiltrados = computed(() => {
    if(filtro.value){
      return gastos.value.filter( gasto => gasto.categoria === filtro.value )
    }
    return gastos.value
  }) 

  watch( presupuesto, ()=>{
    localStorage.setItem('presupuesto', presupuesto.value)
    
  }, {
    deep: true
  })

  onMounted(() => {
    const presupuestoStorage = localStorage.getItem('presupuesto')
    if(presupuestoStorage){
      presupuesto.value = Number(presupuestoStorage)
      disponible.value = Number(presupuestoStorage)
    }

    const gastosStorage = localStorage.getItem('gastos')
    if(gastosStorage){
      gastos.value = JSON.parse(gastosStorage)
    }
  })

  const btnResetear = () =>{
    console.log('Reseteando App...')


    Swal.fire({
        title: "¿Resetear Gastos?",
        text: "No podras revertirlo, ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, resetear"
      }).then((result) => {
        if (result.isConfirmed) {

          gastos.value = []
          presupuesto.value = 0

          Swal.fire({
            title: "Gastos reiniciados",
            text: "La aplicación fue reseteada exitosamente.",
            icon: "success"
          });
        }
      });
  }
</script>

<template>
    <div
      :class="{fijar: modal.mostrar}"
    >
      <header>
        <h1>Planificador de Gastos</h1>
        
        <div class="contenedor contenedor-header sombra">
          <Presupuesto
            v-if="presupuesto === 0"
              @definir-presupuesto="definirPresupuesto"
          />

          <ControlPresupuesto
            v-else
            v-bind:presupuesto="presupuesto"
            v-bind:disponible="disponible"
            v-bind:gastado="gastado"
            @resetear-app="btnResetear"
          />

        </div>
      </header>

      <main v-if="presupuesto > 0">

        <filtroCategoria
          v-model:filtro="filtro"
        />

        <div class="listado-gastos contenedor">
          <h2>{{ gastosFiltrados.length > 0 ? 'Gastos' : 'No hay Gastos' }} </h2>
          
          <Gastos
            v-for="gasto in gastosFiltrados"
            :key="gasto.id"
            :gasto="gasto"
            @seleccionar-gasto="seleccionarGasto"

          />
        </div>

        <div class="crear-gasto">
          <img 
            v-bind:src=iconoGasto 
            alt="imagen gasto"

            v-on:click="mostrarModal"
          >
        </div>

        <VentanaModal
          v-if="modal.mostrar"
          v-on:cerrar-modal="cerrarModal"
          v-bind:modal="modal"
          v-model:nombre="gasto.nombre"
          v-model:cantidad="gasto.cantidad"
          v-model:categoria="gasto.categoria"

          v-on:guardar-gasto="guardarGasto"
          v-bind:disponible="disponible"

          v-bind:id="gasto.id"

          @boton-borrar="btnTrash"
        />

      </main>
    </div>
</template>

<style>
  :root{
    --azul: #3b82f6;
    --blanco: #fff;
    --gris-claro: #f5f5f5;
    --gris: #94a4b8;
    --gris-oscuro: #64748b;
    --negro: #000;
  }
  html{
    font-size: 62.5%; 
    box-sizing: border-box;

  }

  *,
  *:before,
  *:after{
    box-sizing: inherit;
  }

  body{
    font-size: 1.6rem;
    font-family: "Lato", sans-serif;
    background-color: var(--gris-claro);
  }
  h1{
    font-size: 4rem;
  }
  h2{
    font-size: 3rem;
    
  }

  /*Ventana Modal */
  .fijar{
    overflow: hidden;
    height: 100vh;
  }

  header{
    background-color: var(--azul);
  }

  header h1{
    padding: 3rem 0;
    text-align: center;
    color: var(--blanco);
    margin: 0;
  }

  .contenedor{
    widows: 90%;
    margin: 0 auto;
    max-width: 80rem;
  }

  .contenedor-header{
    margin-top: -5rem;
    transform: translateY(5rem);
    padding: 5rem;
  }

  .sombra{
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    background-color: var(--blanco);
    border-radius: 1.2rem;
    padding: 5rem;
  }

  .crear-gasto{
    position: fixed;
    bottom: 5rem;
    right: 5rem;
  }

  .crear-gasto img{
    width: 5rem;
    cursor: pointer;
  }

  .listado-gastos{
    margin-top: 7rem;
  }

  .listado-gastos h2{
    font-weight: 900;
    color: var(--gris-oscuro);
  }

</style>