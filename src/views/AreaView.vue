<template>
  <div style="width: 100%">
    <h1>Areas</h1>
    <div id="mapdiv" style="width: 100%; height: 500px; margin-top: 10px"></div>
    <div style="display: flex; margin-top: 30px">
      <button @click="showAddModal = true" style="margin-left: auto">Add area</button>
    </div>
    <table style="width: 100%; margin-top: 15px" border="1">
      <thead>
        <tr style="background: #e3e3e3">
          <th>Name</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in areas" :key="index">
          <td width="80%">{{ item.name }}</td>
          <td width="10%">
            <button @click="openEditModal(item)" style="background: none; border: none">
              <FontAwesomeIcon :icon="['fas', 'pencil']" />
            </button>
          </td>
          <td width="10%">
            <button @click="deleteArea(item.id)" style="background: none; border: none">
              <FontAwesomeIcon :icon="['fas', 'trash']" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
import firebase from '../firebaseConfig.js'
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore'
import { ref, computed, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import AddAreaModal from './AddAreaView.vue'
import EditAreaModal from './EditAreaView.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const showAddModal = ref(false)
const showEditModal = ref(false)
let areaLatLng = {}
const map = ref(null)
const loader = new Loader({
  apiKey: 'AIzaSyDczHPeAO1YHkom6QG66rPZfwLwth0WqX4',
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
    FontAwesomeIcon
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
      areaName
    }
  },
  created() {
    this.fetchAreas()
    this.subscribeToTodos()
  },
  methods: {
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.fetchAreas()
    },
    subscribeToTodos() {
      const todosRef = collection(db, 'todos')
      onSnapshot(todosRef, (querySnapshot) => {
        this.todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      })
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
.my-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

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
