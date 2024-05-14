<template>
  <div class="my-dialog">
    <div class="dialog-content">
      <h2>Add Area</h2>
      <input type="text" v-model="areaName" placeholder="Area Name" />
      <div id="addModalMap" style="width: 100%; height: 500px"></div>
      <div class="buttons">
        <button @click="closeModal">Close</button>
        <button @click="addArea">Confirm</button>
      </div>
    </div>
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
const showDialog = ref(false)
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
  var lowx,
    highx,
    lowy,
    highy,
    lats = [],
    lngs = [],
    vertices = poly
  for (var i = 0; i < vertices.length; i++) {
    lngs.push(vertices[i].lng)
    lats.push(vertices[i].lat)
  }
  lats.sort()
  lngs.sort()
  lowx = lats[0]
  highx = lats[vertices.length - 1]
  lowy = lngs[0]
  highy = lngs[vertices.length - 1]
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
  props: {
    isOpen: Boolean,
    closeModal: Function,
    showDialog: Boolean
  },
  components: {},
  data() {
    return {
      center: { lat: 40.689247, lng: -74.044502 },
      mapCenter: { lat: 0, lng: 0 },
      mapZoom: 7,
      areas: [],
      apiPromise,
      map,
      areaName
    }
  },
  created() {
    this.fetchTodos()
    this.subscribeToTodos()
  },
  methods: {
    subscribeToTodos() {
      const todosRef = collection(db, 'todos')
      onSnapshot(todosRef, (querySnapshot) => {
        this.todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      })
    },
    async fetchTodos() {
      try {
        const todosRef = collection(db, 'areas')
        const querySnapshot = await getDocs(todosRef)
        this.areas = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        console.log('areas: ', this.areas)
        apiPromise.then((google) => {
          var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
              fillColor: '#BCDCF9',
              fillOpacity: 0.5,
              strokeWeight: 3,
              strokeColor: '#57ACF9',
              clickable: false,
              editable: true,
              zIndex: 1
            }
          })
          var mapOptions = {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: false,
            fullscreenControl: false,
            center: new google.maps.LatLng(17.3944809, 78.4417806)
          }
          console.log('map: ', document.getElementById('addModalMap'))
          let mp = new google.maps.Map(document.getElementById('addModalMap'), mapOptions)
          drawingManager.setMap(mp)
          console.log('areasss: ', this.areas)
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
          google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            drawingManager.setMap(null)
            var polygonArr = []
            for (var i = 0; i < polygon.getPath().getLength(); i++) {
              var pointPair = polygon.getPath().getAt(i).toUrlValue(6)
              polygonArr.push(pointPair)
            }
            polygonArr = polygonArr.map((e) => {
              let splits = e.split(',')
              return {
                lat: splits[0],
                lng: splits[1]
              }
            })
            areaLatLng = polygonArr
            showDialog.value = true // Show dialog when polygon is drawn
          })
        })
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async addArea() {
      try {
        const randomId = Math.random().toString(36).substring(2) // Generate random ID
        await setDoc(doc(db, 'areas', randomId), {
          name: this.areaName,
          latLngObj: areaLatLng
        })
        this.areaName = ''
        console.log('Area added successfully!')
        this.closeModal()
      } catch (error) {
        console.error('Error adding todo:', error)
      }
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
  width: 900px;
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

button {
  margin-left: 10px;
}
</style>
