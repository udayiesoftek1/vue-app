<template>
  <div style="width: 100%">
    <h1>Areas</h1>
    <div id="mapdiv" style="width: 100%; height: 500px; margin-top: 10px"></div>
    <div style="display: flex; margin-top: 30px">
      <Button
        label="Add area"
        @click="showAddModal = true"
        style="margin-left: auto; margin-bottom: 10px"
      />
    </div>
    <ag-grid-vue
      :rowData="areas"
      :columnDefs="colDefs"
      :defaultColDef="defaultColDef"
      style="height: 500px"
      class="ag-theme-quartz"
      @cell-clicked="onCellClicked"
    />
    <AddAreaModal v-if="showAddModal" :show="showAddModal" :closeModal="closeModal"></AddAreaModal>
    <EditAreaModal
      v-if="showEditModal"
      :area="area"
      :show="showEditModal"
      :closeModal="closeModal"
    ></EditAreaModal>
  </div>
</template>

<script>
import firebase from '../../firebaseConfig'
import { getFirestore, doc, collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import AddAreaModal from './AddAreaView.vue'
import EditAreaModal from './EditAreaView.vue'
import { AgGridVue } from 'ag-grid-vue3'

const showAddModal = ref(false)
const showEditModal = ref(false)
const map = ref(null)
const loader = new Loader({
  apiKey: 'AIzaSyARck_Y7n98H1AyuneWglswzySsTrzF5bk',
  version: 'weekly',
  libraries: ['drawing', 'maps']
})
const apiPromise = loader.load()
const db = getFirestore()

function polygonCenter(poly) {
  var lats = poly.map((point) => point.lat)
  var lngs = poly.map((point) => point.lng)

  var lowx = Math.min(...lats)
  var highx = Math.max(...lats)
  var lowy = Math.min(...lngs)
  var highy = Math.max(...lngs)

  var center_x = lowx + (highx - lowx) / 2
  var center_y = lowy + (highy - lowy) / 2

  return { lat: center_x, lng: center_y }
}
function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

let areaName = ''
export default {
  components: {
    AddAreaModal,
    EditAreaModal,
    AgGridVue
  },
  data() {
    return {
      center: { lat: 40.689247, lng: -74.044502 },
      mapCenter: { lat: 0, lng: 0 },
      mapZoom: 7,
      areas: [],
      apiPromise,
      map,
      showAddModal,
      showEditModal,
      area: {},
      areaName,
      colDefs: [
        {
          field: 'name',
          cellStyle: { 'text-align': 'left' }
        },
        {
          field: 'edit',
          cellRenderer: this.editRenderer,
          maxWidth: 100,
          cellStyle: { 'text-align': 'center' }
        },
        {
          field: 'delete',
          maxWidth: 100,
          cellRenderer: this.deleteRenderer,
          cellStyle: { 'text-align': 'center' },
          cellRendererParams: {
            onClick: (params) => {
              console.log('param: ', params)
              this.deleteArea(params.data.id)
            }
          }
        }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
        resizable: true
      }
    }
  },
  created() {
    this.fetchAreas()
  },
  methods: {
    onCellClicked(params) {
      console.log('parasm: ', params)
      if (params.column.colId === 'edit') {
        this.openEditModal(params.data)
      } else if (params.column.colId === 'delete') {
        this.deleteArea(params.data.id)
      }
    },
    deleteRenderer(params) {
      console.log('params: ', params)
      return `
        <button @click="deleteArea('${params.data.id}')" style="background: none; border: none">
            <i class="fa fa-trash-alt" style="color:red"></i>                </button>`
    },
    editRenderer(params) {
      console.log('params: ', params)
      return `
        <button @click="editArea('${params.data.id}')" style="background: none; border: none">
            <svg style="width: 15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>                           </button>`
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.fetchAreas()
    },
    async fetchAreas() {
      try {
        const todosRef = collection(db, 'areas')
        const querySnapshot = await getDocs(todosRef)
        this.areas = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        apiPromise.then((google) => {
          var mapOptions = {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: false,
            fullscreenControl: false,
            center: new google.maps.LatLng(17.3944809, 78.4417806)
          }
          let mp = new google.maps.Map(document.getElementById('mapdiv'), mapOptions)
          this.areas.forEach(function (element, index) {
            try {
              var center = polygonCenter(element.latLngObj)
            } catch (e) {
              return
            }
            var arry = []
            element.latLngObj.forEach(function (elem, idx) {
              if (elem.lat != null && elem.lng != null) {
                arry.push(new google.maps.LatLng(elem.lat, elem.lng))
              }
            })
            if (arry != null) {
              element.latLngObj = arry
            }
            var color = getRandomColor()
            var polygonObj = new google.maps.Polygon({
              paths: element.latLngObj,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 3,
              fillColor: color,
              fillOpacity: 0.2
            })
            polygonObj.setMap(mp)
            console.log('element.name: ', center)
            var marker = new google.maps.Marker({
              map: mp,
              position: center,
              label: { text: element.name, color: color, fontSize: '18px', fontWeight: '600' },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0
              }
            })
          })
        })
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async deleteArea(id) {
      try {
        if (confirm('Do you want to delete the area')) {
          await deleteDoc(doc(db, 'areas', id))
          this.fetchAreas()
          console.log('Area deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting area:', error)
      }
    },
    openEditModal(e) {
      this.showEditModal = true
      this.area = e
    }
  }
}
</script>

<style scoped>
.dialog-content {
  background-color: white;
  padding: 20px;
  color: black;
  border-radius: 5px;
}

.buttons {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
td,
th {
  text-align: center;
  border: none;
}
th {
  font-size: 16px;
  font-weight: 600;
}
h1 {
  text-align: center;
}
button {
  margin-left: 10px;
}
</style>
