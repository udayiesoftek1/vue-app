<template>
  <div class="my-dialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>Edit Area</h2>
        <button @click="closeModal" style="background: none; border: none">
          <FontAwesomeIcon :icon="['fas', 'x']" />
        </button>
      </div>
      <label for="AreaName" style="margin-right: 10px; font-size: 16px"> Area Name</label>
      <InputText id="areaName" v-model="areaName" aria-describedby="" placeholder="Area Name" />
      <div id="addModalMap" style="width: 100%; height: 350px; margin-top: 25px"></div>
      <div class="buttons">
        <Button
          @click="closeModal"
          label="Close"
          severity="contrast"
          outlined
          style="margin-right: auto; margin-left: 0"
        />
        <Button @click="editArea" label="Submit" />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../../firebaseConfig'
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
let areaLatLng = []

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
  props: {
    isOpen: Boolean,
    closeModal: Function,
    showDialog: Boolean,
    area: Object
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
    this.areaName = this.area.name
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
          console.log('areas: ', this.areas)
          console.log('this.area: ', this.area)
          let areaId = this.area.id
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
              editable: element.id === areaId,
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
            if (element.id === areaId) {
              google.maps.event.addListener(polygonObj.getPath(), 'set_at', function (e) {
                let polygon = polygonObj
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
                console.log('poolygonArr: ', polygonArr)
                areaLatLng = polygonArr
                console.log('areaLatLng: ', areaLatLng)
              })
            }
          })
        })
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async editArea() {
      try {
        console.log('this.areas: ', this.areas)
        if (!areaLatLng || areaLatLng.length === 0) {
          console.log('return: ', areaLatLng)
          return
        }
        await setDoc(doc(db, 'areas', this.area.id), {
          name: this.areaName,
          latLngObj: areaLatLng
        })
        this.areaName = ''
        areaLatLng = []
        console.log('Area edited successfully!')
        this.closeModal()
      } catch (error) {
        console.error('Error editing todo:', error)
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
  width: 800px;
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
.dialog-header {
  display: flex;
}

.dialog-header h2 {
  width: 100%;
  text-align: center;
}
button {
  margin-left: 10px;
}
</style>
