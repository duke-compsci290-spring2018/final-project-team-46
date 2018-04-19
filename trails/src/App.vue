<template>
  <div id="app">
      <h1>HikeAdvisor</h1>
    <div id="navbar">
      <button class="nav" @click="showMap">World Map</button>
        <button class="nav" @click="search">Search for Trails</button>
        <!--<div id="dropdown">
            <button @click="dropDown">View Trails by Category</button>
            <i></i>
        </div>-->
        <select @click="showCategory" id="categorySelect" class="nav" v-model="categ" name="View Trails by Category">
            <option>All</option>
            <option>Long</option>
            <option>Medium</option>
            <option>Short</option>
        </select>
        <button @click="createTrip" class="nav">Create a Trip</button>
        
        <div v-show="categDisplay" id="display">
            <ul v-for="trail in categoryTrails">
                <li :id="trail[2].id" class="nameClick" @click="openModal(trail)">{{ trail[2].name }}</li>
            </ul>
        </div>
        
        <div v-show="hikeModal" class="modal">
            <div @click="closeModal()" class="close">&times;</div>
            <div class="modal-content">
                <h4 id="infoModal">{{infoModal}}</h4>
                <p id="locationModal">{{locationModal}}</p>
                <p id="activityModal">{{activityModal}}</p>
                <p id="lengthModal">{{lengthModal}}</p>
                <p id="descriptionModal">{{descriptionModal}}</p>
                <a id="urlModal" :href="urlModal">More Info</a>
                <br>
                <br>
                <img id="picModal" :src="imgModal" alt="">
            </div>
        </div>
        
        <div v-show="searchQs" id="searchCriteria">
            <p>Activity Type:</p>
            <select v-model="activitySelect">
                <option></option>
                <option>Mountain Biking</option>
                <option>Hiking</option>
                <option>Camping</option>
            </select>
            <p>*Country:</p>
            <select v-model="countrySelect">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Egypt</option>
                <option>Turkey</option>
                <option>Netherlands</option>
                <option>New Zealand</option>
            </select>
            <p>State/Province:</p>
            <input v-model="stateSelect" placeholder="Ex. Colorado">
            <p>City:</p>
            <input v-model="citySelect" placeholder="Ex. Keystone">
            <p>Trail/Park Name:</p>
            <input v-model="trailnameSelect" placeholder="Ex. Westridge Loop">
            <p>Trail Length:</p>
            <select v-model="lengthSelect">
                <option></option>
                <option>Long (Greater than 12mi)</option>
                <option>Medium (5-12 mi)</option>
                <option>Short(Less than 5mi)</option>
            </select>
            <br>
            <button @click="searchCriteria">Submit</button>
            <p>*required field</p>
    
        </div>
        <div v-show="disMessage">
        <p id="searchMessage">We are sorry. We could not find exact results for the following criteria:</p>
            <ul v-for="message in searchMessages">
                <li>{{message}}</li>
            </ul>
            <p>We displayed the closest results.</p>
        </div>
        <div v-show="displayResults" id="searchResults">
            <ul v-for="traill in criteriaResults">
                <li class="nameClick" @click="openModal(traill)">{{traill[2].name}}</li>
            </ul>
        </div>
        <div v-show="worldMap">
            <h1>World Map</h1>
            <p>The world map below displays hikes from the mashape trail api. By hovering over a trail marked by a green dot, the trail's information will display to the right.</p>
            <hr/>
                
            <div id="map">
                <svg id="svg"></svg>
            </div>
            <div id="other">
            <h4 id="info"></h4>
                <p id="location"></p>
                <p id="activity"></p>
                <p id="length"></p>
                <p id="description"></p>
                <a id="url"></a>
                <br>
                <br>
                <img id="pic" src="" alt="">
            </div>
        </div>
        
        <div v-show="planTrip">
            <calendar-view :events="events" :show-event-times="eventTimes" @click-date="tryDate"></calendar-view>
            <div v-show="addEvent">
                <p>If you would like to add your selected trail to your calendar please select the start and end date (optional)</p>
                <p>To add:</p>
                <p>{{addHikeObj}}</p>
                <p>Start Date:</p>
                <input id="hikeDateStart" v-model="newStartDate" type="date">
                <p>End Date:</p>
                <input id="hikeDateEnd" v-model="newEndDate" type="date">
                <button @click="addHiketoCalendar">Add Hike to Calendar</button>
            </div>
            <hr/>
            <div v-show="addTrip" id="addTrip">
                <p>Add a Trip to your Calendar!</p>
                <input placeholder="Trip Name" v-model="newTripName">
                <p>Trip Start Date</p>
                <input id="tripDateStart" v-model="newTripStartDate" type="date">
                <p>Trip End Date</p>
                <input id="tripDateEnd" v-model="newTripEndDate" type="date">
                <br>
                <br>
                <button @click="addTriptoCalendar">Add Trip to Calendar</button>
                <p>Click any of the below hikes displayed on the map to view hike info. Double click to add this hike to your calendar. </p>
            
            </div>
            <hr/>
                <gmap-map
                    :center="center"
                    :zoom="2"
                    @click="addMarker"
                    style="height: 480px;"
                    >
                    <gmap-marker
                        v-for="(m, index) in markers"
                        :key="index+3"
                        :position="m.position"
                        :clickable="true"
                        :draggable="true"
                        @click="center = m.position"
                    >
                    </gmap-marker>
                    <gmap-circle
                        v-for="(c, index) in circles"
                        :key="c.id"
                        :center="c.center"
                        :radius="c.radius"
                        :options="c.options"
                        @mouseover="infoText = c.text"
                        @mouseout="infoText = ''"
                        @dblclick="addTrailEvent(c)"
                    ></gmap-circle>
                    <div slot="visible">
                        <div style="bottom: 0; left: 0; background-color: blue; color: white; position: absolute; z-index: 100">
                          {{infoText}}
                        </div>
                    </div>
                </gmap-map>
            <div v-show="closeByResults">
                <ul v-for="close in closeBy">
                    <li>
                        <p>Near by to your pin:</p>
                        <p>{{close.pin.name}}</p>
                        <p>Trails:</p>
                        <ul v-for="hike in close.hike">
                            <p @click="openModal(hike)">{{hike[2].name}}</p>
                            <button @click="addTrailEvent(hike)">Add to Calendar</button>
                        </ul>
                    </li>
                </ul>
    
            </div>
    
        </div>
    </div>
  </div>
</template>

<script>
import CalendarView from "vue-simple-calendar";
//import CalendarView from "./components/CalendarView"

require("vue-simple-calendar/dist/static/css/default.css");
    
import * as d3 from 'd3';
import MAPDATA from './assets/ca.json';
var VueD3 = require('vue-d3')

import { usersRef, storageRef } from './database.js'
import Authentication from './components/Authentication'
    
//Vue.use(VueD3)
var myHeaders = new Headers();
myHeaders.append("X-Mashape-Key", "UuMqkwSygmmsh0zqWC7yGzmgn0yYp1LN0H3jsnTFzEQasUDdyB");

var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

var myRequest = new Request('https://trailapi-trailapi.p.mashape.com/', myInit);

var TRAILS_API_URL = 'https://trailapi-trailapi.p.mashape.com/?api-key=A8exhlC63FmshIMkUXoplrWGYduqp1uJNp5jsn3zvB9RO8Dc37'

var allHikes=[];
fetch(myRequest).then(data=>data.json()).then(data=>{
    console.log(data)
    var i;
    for (i=0; i< data.places.length; i++){
        if (data.places[i].activities.length!==0){
            var info={
                "name": data.places[i].name, 
                "city": data.places[i].city,
                "state":  data.places[i].state,
                "country":  data.places[i].country,
                "activity": data.places[i].activities[0].activity_type.name,
                "length": data.places[i].activities[0].length,
                "description": data.places[i].activities[0].description,
                "url": data.places[i].activities[0].url,
                "pic": data.places[i].activities[0].thumbnail,
                "id": data.places[i].unique_id
            }
            var pt=[data.places[i].lon, data.places[i].lat, info];
            allHikes.push(pt);
        }
        else{
            var info={
                "name": data.places[i].name, 
                "city": data.places[i].city,
                "state":  data.places[i].state,
                "country":  data.places[i].country,
                "activity": "no specified activity",
                "length": "no length recorded",
                "description": "no description",
                "url": "no url",
                "pic": "no display picture",
                "id": data.places[i].unique_id
            }
            var pt=[data.places[i].lon, data.places[i].lat, info];
            allHikes.push(pt);
        }
    }
})
    
var filters= {
    Long: function (hikes) {
        var categhikes=[];
        var i;
        //console.log(hikes.length)
        for (i=0; i<hikes.length; i++){
            if (hikes[i][2].length!=="no length recorded"){
                if (hikes[i][2].length>12){
                    categhikes.push(hikes[i]);
                }
            }
        }
        //console.log(categhikes)
        return categhikes;
    },
    Medium: function (hikes) {
        var categhikes2=[];
        var i;
        for (i=0; i<hikes.length; i++){
            if (hikes[i][2].length>5 && hikes[i][2].length<=12){
                categhikes2.push(hikes[i]);
            }
        }
        return categhikes2;
    },
    Short: function (hikes) {
        var categhikes3=[];
        var i;
        for (i=0; i<hikes.length; i++){
            if (hikes[i][2].length!==0 && hikes[i][2].length<=5){
                categhikes3.push(hikes[i]);
            }
        }
        return categhikes3;
    },
    All: function (hikes){
        return hikes;
    }
}
var circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#FF0000',
    fillOpacity: 0.3
}
    
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
        url: TRAILS_API_URL,
        myRequest: myRequest,
        categoryHikes: [],
        allHikes: allHikes,
        categ: 'All',
        categDisplay: true,
        searchQs: false,
        activitySelect: '',
        citySelect: '',
        countrySelect: '',
        trailnameSelect: '',
        stateSelect: '',
        criteriaResults: [],
        displayResults: false,
        lengthSelect: '',
        searchMessages: [],
        disMessage: false,
        hikeModal: false,
        test: "hey",
        infoModal: '',
        locationModal: '',
        lengthModal: '',
        activityModal: '',
        descriptionModal: '',
        urlModal:'',
        imgModal: '',
        worldMap: false,
        mapData: MAPDATA,
        planTrip: false, 
        infoText: '',
        center: {
                lat: 40,
                lng: -35
        },
        markers: [
                {
                    position: { lat: 35.99, lng: -78.89 }, // Durham, NC
                    name: "durr"
                }
        ],
        circles: [],
        events: [
            {
                startDate: "2018-04-19",
                endDate: "2018-04-22",
                title: "My Trip To California"
            }
            
        ],
        eventTimes: true,
        addEvent: false,
        addHikeObj: '',
        newStartDate: '',
        newEndDate: '',
        addTrip: false,
        newTripName: '',
        newTripStartDate: '',
        newTripEndDate: '',
        closeBy: [],
        closeByResults: false,
    }
  },
    components: {
        CalendarView,
        Authentication
    },
    computed: {
        categoryTrails(){
            console.log(this.categ)
            return filters[this.categ](this.allHikes);
        },
    },
    methods: {
        createTrip(){
            this.categDisplay=false;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=true;
            var i;
            for (i=0; i<this.allHikes.length;i++){
                this.circles.push({
                        id: this.allHikes[i][2].id,
                        center: {
                            lng: this.allHikes[i][0],
                            lat: this.allHikes[i][1]
                        },
                        radius: 60000,
                        text: this.allHikes[i][2].name
                        
                    })
            }
            this.addTrip=true;
            
        },
        addMarker (event) {
            var name=prompt("Please enter a name for your marker:", "Ex. My Start Location")
            console.log(name)
            if (name!=null){
                this.markers.push({
                    position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                    name: name
                })
                var i;
                var nearMarkers=[];
                for (i=0;i<this.markers.length; i++){
                    var j;
                    var mlongmax=Math.abs(this.markers[i].position.lng)+2;
                    var mlongmin=Math.abs(this.markers[i].position.lng)-2;
                    var mlatmax=Math.abs(this.markers[i].position.lat)+2;
                    var mlatmin=Math.abs(this.markers[i].position.lat)-2;
                    console.log(mlongmax+"and"+mlongmin)
                    var markercloses=[];
                    for (j=0; j<this.allHikes.length; j++){

                        var hlong=Math.abs(this.allHikes[j][0]);
                        console.log(hlong)
                        var hlat=Math.abs(this.allHikes[j][1]);
                        if (hlong<mlongmax && hlong>mlongmin && hlat<mlatmax && hlat>mlatmin){
                            markercloses.push(this.allHikes[j])
                        }
                    }
                    nearMarkers.push({
                                pin: this.markers[i],
                                hike: markercloses
                            });
                    console.log(nearMarkers)
                }
                this.closeBy=nearMarkers;
            }
            this.closeByResults=true;
        },
        
        tryDate (date){
            console.log("here")
        },
        
        addTrailEvent(trail){
            this.addEvent=true;
            console.log(trail);
            if (trail.text!==null){
                this.addHikeObj=trail.text;
                console.log("trail.text"+trail.text)
            }
            if (trail[2].name!==null){
                this.addHikeObj=trail[2].name;
                console.log("herenow")
            }
        },
        
        addHiketoCalendar() {
            //document.getElementById()
            if (this.newEndDate!==''){
                this.events.push({
                    title: this.addHikeObj,
                    startDate: this.newStartDate,
                    endDate: this.newEndDate,
                })
            }
            else {
                this.events.push({
                    title: this.addHikeObj,
                    startDate: this.newStartDate,
                })
            }
            console.log("added")
            this.newStartDate='';
            this.newEndDate='';
        },
        
        addTriptoCalendar(){
            console.log("addtrip")
            this.events.push({
                title: this.newTripName,
                startDate: this.newTripStartDate,
                endDate: this.newTripEndDate
            })
            this.newTripName='';
            this.newTripStartDate='';
            this.newTripEndDate='';
        },
//        zoomed() {
//            d3.select("svg").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//        },
        
        showMap(){
            this.categDisplay=false;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.planTrip=false;
            this.worldMap=true;
            
            var svg = d3.select("svg");
            var projection = d3.geoMercator()
                
            var path = d3.geoPath()
              .projection(projection);
            console.log("here3");
            //var url = "assets/ca.json";
            //d3.json(url, function(err, geoData) {
                //console.log(geoData);
              d3.select("svg").append("path")
                .attr("d", path(this.mapData))
                .attr("stroke", "black")
                .attr("fill", "lightblue")
            //})
            
            var i;
            for (i=0; i<this.allHikes.length; i++){
                    svg.selectAll("pin")
                    .data([this.allHikes[i]]).enter()
                    .append("circle")
                    .attr("cx", function (d) { return projection(d)[0]; })
                    .attr("cy", function (d) { return projection(d)[1]; })
                    .attr("r", "4px")
                    .attr("fill", "darkgreen")
                  //make hover so that will display info to the right
                    .on("mouseover", function(d){
                        console.log(d[2]);
                        d3.select("#info").text("Trail Name: "+d[2].name);
                        d3.select("#location").text("Location: "+d[2].city);
                        d3.select("#activity").text("Activity Type: "+d[2].activity);
                        d3.select("#length").text("Length: "+d[2].length+" miles");
                        d3.select("#description").text("Description: "+d[2].description);
                        d3.select("#url").attr("href", d[2].url);
                        d3.select("#url").text("More Trail Info");
                        d3.select("#pic").attr("src", d[2].pic);
                        d3.select("#pic").attr("alt", "trail thumbnail"); 
                    })
            }
            //var zoom = d3.zoom()
                //.on("zoom", this.zoomed);
        },
        
        showCategory(){
            this.categDisplay=true;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=false;
            
/*            var i;
            for (i=0;i<this.allHikes.length;i++){
                var j;
                for (j=0; j<this.allHikes.length;j++){
                    if (j!=i){
                        if (this.allHikes[i][2].id===this.allHikes[j][2].id){
                            console.log(this.allHikes[i][2].id)
                        }
                    }
                }
            }*/
            
        },
        
        closeModal(){
            this.hikeModal=false;
        },
        
        openModal(trail){
            this.hikeModal=true;
            this.infoModal=trail[2].name;
            this.locationModal=trail[2].city;
            this.activityModal=trail[2].activity;
            this.urlModal=trail[2].url;
            this.descriptionModal=trail[2].description;
            this.lengthModal=trail[2].length;
            this.imgModal=trail[2].pic;
        },
        
        search(){
            this.categDisplay=false;
            this.searchQs=true;
            this.worldMap=false;
            this.planTrip=false;
        },
        
        searchCriteria(){
            var messages=[];
            var criteria=[];
            if (this.countrySelect!==''){
                criteria[0]=this.countrySelect.toLowerCase();
            }
            else{
                alert("Country is required field, you must select a country")
            }
            if (this.citySelect!==''){
                criteria[1]=this.citySelect.toLowerCase();
            }
            if (this.citySelect==='') {
                criteria[1]=0;
            }
            if (this.stateSelect!==''){
                criteria[2]=this.stateSelect.toLowerCase();
            }
            if (this.stateSelect==='') {
                criteria[2]=0;
            }
            if (this.activitySelect!==''){
                criteria[3]=this.activitySelect.toLowerCase();
            }
            if (this.activitySelect===''){
                criteria[3]=0;
            }
            if (this.trailnameSelect!==''){
                criteria[4]=this.trailnameSelect.toLowerCase();
            }
            if(this.trailnameSelect===''){
                criteria[4]=0;
            }
            if (this.lengthSelect!==''){
                criteria[5]=this.lengthSelect.toLowerCase();
            }
            if(this.lengthSelect===''){
                criteria[5]=0;
            }
            console.log(criteria)
            var getHikes=[];
            var i;
            for (i=0; i<this.allHikes.length; i++){
                var curr=this.allHikes[i][2];
                if (curr.country.toLowerCase()===criteria[0]){
                    getHikes.push(this.allHikes[i]);

                }
            }
            var passHikes=[];
            if (criteria[1]!==0){
                var j;
                for (j=0;j<getHikes.length;j++){
                    if (getHikes[j][2].city!==null){
                        if (criteria[1]===getHikes[j][2].city.toLowerCase()){
                        passHikes.push(getHikes[j]);
                        }
                    }
                }
            }
            if (passHikes.length===0 && criteria[1]!==0){
                messages.push("no hikes matched for this city");
                passHikes=getHikes;
            }
            if (criteria[1]===0){
                passHikes=getHikes;
            }
            console.log(passHikes);
            var nextPass=[];
            if (criteria[2]!==0){
                var j;
                for (j=0;j<passHikes.length;j++){
                    if (passHikes[j][2].state!==null){
                        if (criteria[2]===passHikes[j][2].state.toLowerCase()){
                        nextPass.push(passHikes[j]);
                        }
                    }
                }
            }
            if (nextPass.length===0 && criteria[2]!==0){
                messages.push("no hikes matched for this state");
                nextPass=passHikes;
            }
            if (criteria[2]===0){
                nextPass=passHikes;
            }
            console.log("state: "+nextPass);
            var activityPass=[];
            if (criteria[3]!==0){
                var j;
                for (j=0;j<nextPass.length;j++){
                    if (criteria[3]===nextPass[j][2].activity.toLowerCase()){
                        activityPass.push(nextPass[j]);
                    }
                }
            }
            if (activityPass.length===0 && criteria[3]!==0){
                messages.push("no hikes matched for this activity");
                activityPass=nextPass;
            }
            if (criteria[3]===0){
                activityPass=nextPass;
            }
            var finalPass=[];
            if (criteria[4]!==0){
                var j;
                for (j=0;j<activityPass.length;j++){
                    console.log(activityPassHikes[j][2])
                    if (criteria[4]===activityPassHikes[j][2].name.toLowerCase()){
                        finalPass.push(activityPass[j]);
                    }
                }
            }
            if (finalPass.length===0 && criteria[4]!==0){
                messages.push("no hikes matched for this name");
                finalPass=activityPass;
            }
            if (criteria[4]===0){
                finalPass=activityPass;
            }
            var nowfinalPass=[];
            if (criteria[5]!==0){
                var j;
                for (j=0;j<finalPass.length;j++){
                    if (finalPass[j][2].length!==0){
                        if (criteria[5]==="long (greater than 12mi)"){
                            if (finalPass[j][2].length>12){
                                nowfinalPass.push(finalPass[j]);
                            }
                        }
                        if (criteria[5]==="medium (5-12mi)"){
                            if (finalPass[j][2].length>5 && finalPass[j][2].length<=12){
                                nowfinalPass.push(finalPass[j]);
                            }
                        }
                        if (criteria[5]==="long (less than 5mi)"){
                            if (finalPass[j][2].length<=5){
                                nowfinalPass.push(finalPass[j]);
                            }
                        }
                    }
                }
            }
            if (nowfinalPass.length===0 && criteria[5]!==0){
                messages.push("no hikes matched for this length");
                nowfinalPass=finalPass;
            }
            if (criteria[5]===0){
                nowfinalPass=finalPass;
            }
            
            console.log(nowfinalPass);
            console.log(messages);
            this.criteriaResults=nowfinalPass;
            this.displayResults=true;
            this.activitySelect='';
            this.citySelect='';
            this.countrySelect='';
            this.trailnameSelect='';
            this.stateSelect='';
            this.lengthSelect='';
            if (messages.length!==0){
                this.disMessage=true;
                this.searchMessages=messages;
            }
        },
    }
}
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
    
    #navbar{
        border-color: black;
        background-color: antiquewhite;
    }
    .nav{
        /*border-color: black;*/
    }
    .nav:hover{
        background-color: beige;
    }

    .modal {
    position: fixed; 
    z-index: 1000; 
    padding-top: 10%;
    padding-bottom: 10%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%; 
    background-color: rgba(0,0,0,0.9);
    overflow: scroll;
}

.modal-content {
    margin: auto;
    display: block;
    height: auto;
    border-style: double;
}
    
    #picModal{
        max-width: 60%;
    }

.close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: white;
    font-size: 40px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: darkred;
    cursor: pointer;
    
}
    #map{
          width: 900px;
          height: 600px;
      }
    #svg { 
        background-color: white;
        width: 100%; 
        height: 600px;
        margin-left: auto;
      }
        #other{
          width: 275px;
          position: absolute;
          top: 350px;
          right: 0px;
          height: 600px;
      }
    
    .nameClick:hover{
        cursor: pointer;
    }
</style>
