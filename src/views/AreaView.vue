<template>
  <div style="width: 100%">
    <h1>Areas</h1>
    <GoogleMap
      api-key="AIzaSyDczHPeAO1YHkom6QG66rPZfwLwth0WqX4"
      style="width: 100%; height: 500px"
      :center="areaPols[1].center"
      :zoom="15"
    >
      <template v-for="area in areaPols" :key="area.id">
        <Polygon :options="area" />
        <Marker
          :options="{
            position: area.center,
            // label: area.name,
            label: { text: area.name, fontSize: '18px', fontWeight: '600' },
            icon: {
              url: 'https://www.w3.org/TR/SVG/images/paths/triangle01.png',
              scaledSize: { width: 0, height: 0 }
            }
          }"
        />
      </template>
    </GoogleMap>
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
import { GoogleMap, Marker, Polygon, InfoWindow } from 'vue3-google-map'

const db = getFirestore()
const triangleCoords = [
  { lat: 25.774, lng: -80.19 },
  { lat: 18.466, lng: -66.118 },
  { lat: 32.321, lng: -64.757 },
  { lat: 25.774, lng: -80.19 }
]
let areas = [
  {
    id: 1,
    area: 'Area 1',
    latLngObj: [
      {
        lng: 78.397932,
        lat: 17.462753
      },
      {
        lng: 78.39851,
        lat: 17.462372
      },
      {
        lng: 78.398879,
        lat: 17.462131
      },
      {
        lng: 78.399397,
        lat: 17.462767
      },
      {
        lng: 78.399146,
        lat: 17.463077
      },
      {
        lng: 78.39902,
        lat: 17.463197
      },
      {
        lng: 78.398884,
        lat: 17.463717
      },
      {
        lng: 78.3986,
        lat: 17.465515
      },
      {
        lng: 78.398529,
        lat: 17.46629
      },
      {
        lng: 78.398374,
        lat: 17.467488
      },
      {
        lng: 78.398295,
        lat: 17.468062
      },
      {
        lng: 78.398633,
        lat: 17.468081
      },
      {
        lng: 78.399189,
        lat: 17.468153
      },
      {
        lng: 78.39954,
        lat: 17.468248
      },
      {
        lng: 78.40089,
        lat: 17.468757
      },
      {
        lng: 78.401583,
        lat: 17.469034
      },
      {
        lng: 78.401974,
        lat: 17.469196
      },
      {
        lng: 78.402186,
        lat: 17.46924
      },
      {
        lng: 78.402464,
        lat: 17.469281
      },
      {
        lng: 78.402887,
        lat: 17.469281
      },
      {
        lng: 78.403542,
        lat: 17.469308
      },
      {
        lng: 78.404438,
        lat: 17.469482
      },
      {
        lng: 78.40517,
        lat: 17.469653
      },
      {
        lng: 78.405703,
        lat: 17.469866
      },
      {
        lng: 78.406267,
        lat: 17.470064
      },
      {
        lng: 78.40646,
        lat: 17.470141
      },
      {
        lng: 78.40686,
        lat: 17.470129
      },
      {
        lng: 78.40723,
        lat: 17.470104
      },
      {
        lng: 78.408087,
        lat: 17.470078
      },
      {
        lng: 78.408558,
        lat: 17.470056
      },
      {
        lng: 78.408935,
        lat: 17.46995
      },
      {
        lng: 78.409913,
        lat: 17.469706
      },
      {
        lng: 78.410685,
        lat: 17.469523
      },
      {
        lng: 78.411422,
        lat: 17.469414
      },
      {
        lng: 78.411733,
        lat: 17.470014
      },
      {
        lng: 78.412212,
        lat: 17.470844
      },
      {
        lng: 78.412639,
        lat: 17.471905
      },
      {
        lng: 78.413186,
        lat: 17.473705
      },
      {
        lng: 78.413273,
        lat: 17.47422
      },
      {
        lng: 78.413234,
        lat: 17.475391
      },
      {
        lng: 78.413245,
        lat: 17.475846
      },
      {
        lng: 78.414548,
        lat: 17.474723
      },
      {
        lng: 78.415321,
        lat: 17.474354
      },
      {
        lng: 78.416284,
        lat: 17.473801
      },
      {
        lng: 78.417121,
        lat: 17.473383
      },
      {
        lng: 78.41765,
        lat: 17.473139
      },
      {
        lng: 78.418304,
        lat: 17.47265
      },
      {
        lng: 78.41857,
        lat: 17.472434
      },
      {
        lng: 78.418516,
        lat: 17.472371
      },
      {
        lng: 78.418803,
        lat: 17.472073
      },
      {
        lng: 78.419308,
        lat: 17.472618
      },
      {
        lng: 78.419871,
        lat: 17.472119
      },
      {
        lng: 78.4202,
        lat: 17.471827
      },
      {
        lng: 78.420371,
        lat: 17.472058
      },
      {
        lng: 78.420514,
        lat: 17.472549
      },
      {
        lng: 78.42069,
        lat: 17.472839
      },
      {
        lng: 78.421051,
        lat: 17.472869
      },
      {
        lng: 78.421114,
        lat: 17.47248
      },
      {
        lng: 78.421543,
        lat: 17.472485
      },
      {
        lng: 78.421574,
        lat: 17.472082
      },
      {
        lng: 78.421766,
        lat: 17.472058
      },
      {
        lng: 78.4219,
        lat: 17.472034
      },
      {
        lng: 78.42225,
        lat: 17.471837
      },
      {
        lng: 78.422601,
        lat: 17.471621
      },
      {
        lng: 78.423026,
        lat: 17.471345
      },
      {
        lng: 78.423192,
        lat: 17.47124
      },
      {
        lng: 78.423339,
        lat: 17.47151
      },
      {
        lng: 78.423384,
        lat: 17.471507
      },
      {
        lng: 78.424088,
        lat: 17.471412
      },
      {
        lng: 78.424401,
        lat: 17.4716
      },
      {
        lng: 78.425125,
        lat: 17.471982
      },
      {
        lng: 78.425882,
        lat: 17.472305
      },
      {
        lng: 78.426217,
        lat: 17.472516
      },
      {
        lng: 78.426371,
        lat: 17.472864
      },
      {
        lng: 78.426587,
        lat: 17.47302
      },
      {
        lng: 78.426782,
        lat: 17.473035
      },
      {
        lng: 78.427608,
        lat: 17.473102
      },
      {
        lng: 78.428026,
        lat: 17.473264
      },
      {
        lng: 78.42841,
        lat: 17.473093
      },
      {
        lng: 78.429063,
        lat: 17.472836
      },
      {
        lng: 78.430529,
        lat: 17.472333
      },
      {
        lng: 78.431218,
        lat: 17.472104
      },
      {
        lng: 78.432432,
        lat: 17.471738
      },
      {
        lng: 78.434099,
        lat: 17.471223
      },
      {
        lng: 78.43651,
        lat: 17.470428
      },
      {
        lng: 78.437542,
        lat: 17.470094
      },
      {
        lng: 78.438649,
        lat: 17.46971
      },
      {
        lng: 78.439388,
        lat: 17.469445
      },
      {
        lng: 78.43975,
        lat: 17.469338
      },
      {
        lng: 78.439612,
        lat: 17.468995
      },
      {
        lng: 78.43928,
        lat: 17.468339
      },
      {
        lng: 78.439082,
        lat: 17.46789
      },
      {
        lng: 78.438962,
        lat: 17.467575
      },
      {
        lng: 78.439605,
        lat: 17.467498
      },
      {
        lng: 78.439896,
        lat: 17.467442
      },
      {
        lng: 78.440072,
        lat: 17.467356
      },
      {
        lng: 78.440288,
        lat: 17.467144
      },
      {
        lng: 78.440573,
        lat: 17.466854
      },
      {
        lng: 78.440932,
        lat: 17.466471
      },
      {
        lng: 78.441099,
        lat: 17.466317
      },
      {
        lng: 78.441158,
        lat: 17.466183
      },
      {
        lng: 78.441172,
        lat: 17.465723
      },
      {
        lng: 78.44108,
        lat: 17.465575
      },
      {
        lng: 78.440876,
        lat: 17.465392
      },
      {
        lng: 78.440802,
        lat: 17.465316
      },
      {
        lng: 78.440815,
        lat: 17.465211
      },
      {
        lng: 78.44094,
        lat: 17.465
      },
      {
        lng: 78.441179,
        lat: 17.464695
      },
      {
        lng: 78.441546,
        lat: 17.464355
      },
      {
        lng: 78.4418,
        lat: 17.464039
      },
      {
        lng: 78.442071,
        lat: 17.463809
      },
      {
        lng: 78.442296,
        lat: 17.463472
      },
      {
        lng: 78.44257,
        lat: 17.462818
      },
      {
        lng: 78.442716,
        lat: 17.46256
      },
      {
        lng: 78.442976,
        lat: 17.462465
      },
      {
        lng: 78.443353,
        lat: 17.462295
      },
      {
        lng: 78.445382,
        lat: 17.462172
      },
      {
        lng: 78.446227,
        lat: 17.462057
      },
      {
        lng: 78.447004,
        lat: 17.462082
      },
      {
        lng: 78.447736,
        lat: 17.462076
      },
      {
        lng: 78.448351,
        lat: 17.462033
      },
      {
        lng: 78.448655,
        lat: 17.462008
      },
      {
        lng: 78.449117,
        lat: 17.461943
      },
      {
        lng: 78.449459,
        lat: 17.461911
      },
      {
        lng: 78.449649,
        lat: 17.461899
      },
      {
        lng: 78.450104,
        lat: 17.461835
      },
      {
        lng: 78.450263,
        lat: 17.461809
      },
      {
        lng: 78.450409,
        lat: 17.46175
      },
      {
        lng: 78.450667,
        lat: 17.46156
      },
      {
        lng: 78.451125,
        lat: 17.461162
      },
      {
        lng: 78.451769,
        lat: 17.460632
      },
      {
        lng: 78.452533,
        lat: 17.459938
      },
      {
        lng: 78.453133,
        lat: 17.459439
      },
      {
        lng: 78.453775,
        lat: 17.458893
      },
      {
        lng: 78.454009,
        lat: 17.458718
      },
      {
        lng: 78.454132,
        lat: 17.458685
      },
      {
        lng: 78.454348,
        lat: 17.458657
      },
      {
        lng: 78.454751,
        lat: 17.458802
      },
      {
        lng: 78.454831,
        lat: 17.458535
      },
      {
        lng: 78.454906,
        lat: 17.45839
      },
      {
        lng: 78.455022,
        lat: 17.458148
      },
      {
        lng: 78.455164,
        lat: 17.457978
      },
      {
        lng: 78.455271,
        lat: 17.457868
      },
      {
        lng: 78.455306,
        lat: 17.457743
      },
      {
        lng: 78.455279,
        lat: 17.456888
      },
      {
        lng: 78.455258,
        lat: 17.456492
      },
      {
        lng: 78.454711,
        lat: 17.45596
      },
      {
        lng: 78.45458,
        lat: 17.455778
      },
      {
        lng: 78.454532,
        lat: 17.454356
      },
      {
        lng: 78.45455,
        lat: 17.453878
      },
      {
        lng: 78.454211,
        lat: 17.45397
      },
      {
        lng: 78.454005,
        lat: 17.454001
      },
      {
        lng: 78.453766,
        lat: 17.453974
      },
      {
        lng: 78.453388,
        lat: 17.453865
      },
      {
        lng: 78.453139,
        lat: 17.453784
      },
      {
        lng: 78.452132,
        lat: 17.45376
      },
      {
        lng: 78.451186,
        lat: 17.453746
      },
      {
        lng: 78.450945,
        lat: 17.453736
      },
      {
        lng: 78.450874,
        lat: 17.453677
      },
      {
        lng: 78.450855,
        lat: 17.453615
      },
      {
        lng: 78.45087,
        lat: 17.453444
      },
      {
        lng: 78.450787,
        lat: 17.453418
      },
      {
        lng: 78.450479,
        lat: 17.453317
      },
      {
        lng: 78.450271,
        lat: 17.453262
      },
      {
        lng: 78.450339,
        lat: 17.452949
      },
      {
        lng: 78.450359,
        lat: 17.452615
      },
      {
        lng: 78.450355,
        lat: 17.452558
      },
      {
        lng: 78.449917,
        lat: 17.452589
      },
      {
        lng: 78.44912,
        lat: 17.452709
      },
      {
        lng: 78.448421,
        lat: 17.452809
      },
      {
        lng: 78.447714,
        lat: 17.452895
      },
      {
        lng: 78.44723,
        lat: 17.452986
      },
      {
        lng: 78.447095,
        lat: 17.452061
      },
      {
        lng: 78.446237,
        lat: 17.452207
      },
      {
        lng: 78.445612,
        lat: 17.452313
      },
      {
        lng: 78.445332,
        lat: 17.452347
      },
      {
        lng: 78.445432,
        lat: 17.452912
      },
      {
        lng: 78.445498,
        lat: 17.453248
      },
      {
        lng: 78.444615,
        lat: 17.453399
      },
      {
        lng: 78.443912,
        lat: 17.453499
      },
      {
        lng: 78.443467,
        lat: 17.453568
      },
      {
        lng: 78.443412,
        lat: 17.453257
      },
      {
        lng: 78.442446,
        lat: 17.453426
      },
      {
        lng: 78.441547,
        lat: 17.453547
      },
      {
        lng: 78.44123,
        lat: 17.453587
      },
      {
        lng: 78.440588,
        lat: 17.453699
      },
      {
        lng: 78.440238,
        lat: 17.453785
      },
      {
        lng: 78.439358,
        lat: 17.454106
      },
      {
        lng: 78.438852,
        lat: 17.454199
      },
      {
        lng: 78.437761,
        lat: 17.454306
      },
      {
        lng: 78.436904,
        lat: 17.454427
      },
      {
        lng: 78.436823,
        lat: 17.453927
      },
      {
        lng: 78.436377,
        lat: 17.453977
      },
      {
        lng: 78.435547,
        lat: 17.454099
      },
      {
        lng: 78.435205,
        lat: 17.454133
      },
      {
        lng: 78.434979,
        lat: 17.454006
      },
      {
        lng: 78.436377,
        lat: 17.450907
      },
      {
        lng: 78.434769,
        lat: 17.451387
      },
      {
        lng: 78.43372,
        lat: 17.451727
      },
      {
        lng: 78.433606,
        lat: 17.451465
      },
      {
        lng: 78.433291,
        lat: 17.450386
      },
      {
        lng: 78.433173,
        lat: 17.450061
      },
      {
        lng: 78.432988,
        lat: 17.448925
      },
      {
        lng: 78.432195,
        lat: 17.449151
      },
      {
        lng: 78.430961,
        lat: 17.449365
      },
      {
        lng: 78.4305,
        lat: 17.449452
      },
      {
        lng: 78.430427,
        lat: 17.449516
      },
      {
        lng: 78.430338,
        lat: 17.449693
      },
      {
        lng: 78.430253,
        lat: 17.449805
      },
      {
        lng: 78.43003,
        lat: 17.449887
      },
      {
        lng: 78.429664,
        lat: 17.449918
      },
      {
        lng: 78.428497,
        lat: 17.44995
      },
      {
        lng: 78.428156,
        lat: 17.449949
      },
      {
        lng: 78.427784,
        lat: 17.449963
      },
      {
        lng: 78.427741,
        lat: 17.450003
      },
      {
        lng: 78.427743,
        lat: 17.450074
      },
      {
        lng: 78.427763,
        lat: 17.450185
      },
      {
        lng: 78.427855,
        lat: 17.450439
      },
      {
        lng: 78.428127,
        lat: 17.451101
      },
      {
        lng: 78.428443,
        lat: 17.452096
      },
      {
        lng: 78.428776,
        lat: 17.453247
      },
      {
        lng: 78.429012,
        lat: 17.454064
      },
      {
        lng: 78.428759,
        lat: 17.454127
      },
      {
        lng: 78.427839,
        lat: 17.454301
      },
      {
        lng: 78.426919,
        lat: 17.454478
      },
      {
        lng: 78.426673,
        lat: 17.454515
      },
      {
        lng: 78.426235,
        lat: 17.454537
      },
      {
        lng: 78.425205,
        lat: 17.454538
      },
      {
        lng: 78.424589,
        lat: 17.454534
      },
      {
        lng: 78.423873,
        lat: 17.454472
      },
      {
        lng: 78.422919,
        lat: 17.454314
      },
      {
        lng: 78.422565,
        lat: 17.454262
      },
      {
        lng: 78.422589,
        lat: 17.453621
      },
      {
        lng: 78.422637,
        lat: 17.452525
      },
      {
        lng: 78.422694,
        lat: 17.451381
      },
      {
        lng: 78.42274,
        lat: 17.450955
      },
      {
        lng: 78.422872,
        lat: 17.450879
      },
      {
        lng: 78.422923,
        lat: 17.450491
      },
      {
        lng: 78.422965,
        lat: 17.449596
      },
      {
        lng: 78.422958,
        lat: 17.449291
      },
      {
        lng: 78.422506,
        lat: 17.449291
      },
      {
        lng: 78.421806,
        lat: 17.449252
      },
      {
        lng: 78.421761,
        lat: 17.449421
      },
      {
        lng: 78.421686,
        lat: 17.449505
      },
      {
        lng: 78.421089,
        lat: 17.451525
      },
      {
        lng: 78.420825,
        lat: 17.452474
      },
      {
        lng: 78.420614,
        lat: 17.453147
      },
      {
        lng: 78.420399,
        lat: 17.453987
      },
      {
        lng: 78.41992,
        lat: 17.453981
      },
      {
        lng: 78.419165,
        lat: 17.453957
      },
      {
        lng: 78.418664,
        lat: 17.453976
      },
      {
        lng: 78.418045,
        lat: 17.454016
      },
      {
        lng: 78.417731,
        lat: 17.454035
      },
      {
        lng: 78.41782,
        lat: 17.453075
      },
      {
        lng: 78.417445,
        lat: 17.45325
      },
      {
        lng: 78.417433,
        lat: 17.452424
      },
      {
        lng: 78.417408,
        lat: 17.451605
      },
      {
        lng: 78.417387,
        lat: 17.450981
      },
      {
        lng: 78.417314,
        lat: 17.450536
      },
      {
        lng: 78.417275,
        lat: 17.450065
      },
      {
        lng: 78.417191,
        lat: 17.449539
      },
      {
        lng: 78.417227,
        lat: 17.449527
      },
      {
        lng: 78.417342,
        lat: 17.449472
      },
      {
        lng: 78.417325,
        lat: 17.449186
      },
      {
        lng: 78.417315,
        lat: 17.449022
      },
      {
        lng: 78.417341,
        lat: 17.448848
      },
      {
        lng: 78.417383,
        lat: 17.448665
      },
      {
        lng: 78.417344,
        lat: 17.44865
      },
      {
        lng: 78.41718,
        lat: 17.448626
      },
      {
        lng: 78.416981,
        lat: 17.448504
      },
      {
        lng: 78.416771,
        lat: 17.448298
      },
      {
        lng: 78.41656,
        lat: 17.44804
      },
      {
        lng: 78.416452,
        lat: 17.447989
      },
      {
        lng: 78.416323,
        lat: 17.447946
      },
      {
        lng: 78.416232,
        lat: 17.447934
      },
      {
        lng: 78.415984,
        lat: 17.447919
      },
      {
        lng: 78.415777,
        lat: 17.447919
      },
      {
        lng: 78.415556,
        lat: 17.447885
      },
      {
        lng: 78.41517,
        lat: 17.447862
      },
      {
        lng: 78.414895,
        lat: 17.44783
      },
      {
        lng: 78.414767,
        lat: 17.447793
      },
      {
        lng: 78.414694,
        lat: 17.447739
      },
      {
        lng: 78.414687,
        lat: 17.447685
      },
      {
        lng: 78.414712,
        lat: 17.447627
      },
      {
        lng: 78.414782,
        lat: 17.447491
      },
      {
        lng: 78.414803,
        lat: 17.447391
      },
      {
        lng: 78.414801,
        lat: 17.447299
      },
      {
        lng: 78.414762,
        lat: 17.447157
      },
      {
        lng: 78.414709,
        lat: 17.447057
      },
      {
        lng: 78.414656,
        lat: 17.447044
      },
      {
        lng: 78.414589,
        lat: 17.447042
      },
      {
        lng: 78.41435,
        lat: 17.447056
      },
      {
        lng: 78.413961,
        lat: 17.447082
      },
      {
        lng: 78.413785,
        lat: 17.447076
      },
      {
        lng: 78.413571,
        lat: 17.447108
      },
      {
        lng: 78.413355,
        lat: 17.447144
      },
      {
        lng: 78.413225,
        lat: 17.447199
      },
      {
        lng: 78.413029,
        lat: 17.447323
      },
      {
        lng: 78.412577,
        lat: 17.447583
      },
      {
        lng: 78.412465,
        lat: 17.447626
      },
      {
        lng: 78.412333,
        lat: 17.447644
      },
      {
        lng: 78.412207,
        lat: 17.447645
      },
      {
        lng: 78.412028,
        lat: 17.447166
      },
      {
        lng: 78.411912,
        lat: 17.446839
      },
      {
        lng: 78.4118,
        lat: 17.446554
      },
      {
        lng: 78.411712,
        lat: 17.446321
      },
      {
        lng: 78.411703,
        lat: 17.446256
      },
      {
        lng: 78.411725,
        lat: 17.446203
      },
      {
        lng: 78.411842,
        lat: 17.446146
      },
      {
        lng: 78.412015,
        lat: 17.446092
      },
      {
        lng: 78.412116,
        lat: 17.446048
      },
      {
        lng: 78.412123,
        lat: 17.446001
      },
      {
        lng: 78.412103,
        lat: 17.445924
      },
      {
        lng: 78.412089,
        lat: 17.445875
      },
      {
        lng: 78.411937,
        lat: 17.445563
      },
      {
        lng: 78.411811,
        lat: 17.445274
      },
      {
        lng: 78.411384,
        lat: 17.445436
      },
      {
        lng: 78.410514,
        lat: 17.445793
      },
      {
        lng: 78.410208,
        lat: 17.4459
      },
      {
        lng: 78.410237,
        lat: 17.44615
      },
      {
        lng: 78.409635,
        lat: 17.44622
      },
      {
        lng: 78.408703,
        lat: 17.446252
      },
      {
        lng: 78.40725,
        lat: 17.446204
      },
      {
        lng: 78.40633,
        lat: 17.446262
      },
      {
        lng: 78.404488,
        lat: 17.44632
      },
      {
        lng: 78.403656,
        lat: 17.448814
      },
      {
        lng: 78.4034,
        lat: 17.448903
      },
      {
        lng: 78.403239,
        lat: 17.449001
      },
      {
        lng: 78.403064,
        lat: 17.449258
      },
      {
        lng: 78.402993,
        lat: 17.449358
      },
      {
        lng: 78.403028,
        lat: 17.449967
      },
      {
        lng: 78.403111,
        lat: 17.450631
      },
      {
        lng: 78.403078,
        lat: 17.450739
      },
      {
        lng: 78.402604,
        lat: 17.450796
      },
      {
        lng: 78.40126,
        lat: 17.450963
      },
      {
        lng: 78.400597,
        lat: 17.451081
      },
      {
        lng: 78.399257,
        lat: 17.451263
      },
      {
        lng: 78.398479,
        lat: 17.451322
      },
      {
        lng: 78.39661,
        lat: 17.451531
      },
      {
        lng: 78.396815,
        lat: 17.452148
      },
      {
        lng: 78.397124,
        lat: 17.453081
      },
      {
        lng: 78.397405,
        lat: 17.453886
      },
      {
        lng: 78.397652,
        lat: 17.454532
      },
      {
        lng: 78.397672,
        lat: 17.454652
      },
      {
        lng: 78.397609,
        lat: 17.454741
      },
      {
        lng: 78.397462,
        lat: 17.454856
      },
      {
        lng: 78.397314,
        lat: 17.454871
      },
      {
        lng: 78.397131,
        lat: 17.454883
      },
      {
        lng: 78.397129,
        lat: 17.456105
      },
      {
        lng: 78.397145,
        lat: 17.456964
      },
      {
        lng: 78.397126,
        lat: 17.4575
      },
      {
        lng: 78.397144,
        lat: 17.45795
      },
      {
        lng: 78.39715,
        lat: 17.458155
      },
      {
        lng: 78.397098,
        lat: 17.458352
      },
      {
        lng: 78.397109,
        lat: 17.458938
      },
      {
        lng: 78.397103,
        lat: 17.459189
      },
      {
        lng: 78.396237,
        lat: 17.459551
      },
      {
        lng: 78.397055,
        lat: 17.46119
      },
      {
        lng: 78.397932,
        lat: 17.462753
      }
    ]
  },
  {
    id: 1,
    area: 'Area 2',
    editable: true,
    zIndex: 1,
    clickable: false,
    latLngObj: [
      { lat: 25.774, lng: -80.19 },
      { lat: 18.466, lng: -66.118 },
      { lat: 32.321, lng: -64.757 },
      { lat: 25.774, lng: -80.19 }
    ]
  }
]
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
let areaPols = areas.map((a) => {
  const color = getRandomColor()
  return {
    name: a.area,
    center: polygonCenter(a.latLngObj),
    paths: a.latLngObj,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35
  }
})

export default {
  components: {
    GoogleMap,
    Marker,
    Polygon
  },
  data() {
    return {
      center: { lat: 40.689247, lng: -74.044502 },
      mapCenter: { lat: 0, lng: 0 },
      mapZoom: 7,
      areaPols
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
        const todosRef = collection(db, 'todos')
        const querySnapshot = await getDocs(todosRef)
        this.todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        console.log('todos: ', this.todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async addArea() {
      try {
        const randomId = Math.random().toString(36).substring(2) // Generate random ID
        await setDoc(doc(db, 'areas', randomId), {
          name: this.newTodo
        })
        this.newTodo = '' // Clear input field after adding todo
        this.fetchTodos() // Refresh todos list
        console.log('Todo added successfully!')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    },
    async deleteTodo(id) {
      try {
        await deleteDoc(doc(db, 'todos', id))
        this.fetchTodos() // Refresh todos list
        console.log('Todo deleted successfully!')
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }
  }
}
</script>

<style scoped></style>
