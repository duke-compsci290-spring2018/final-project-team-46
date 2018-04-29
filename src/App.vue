<template>
  <div id="app">
        <div id="themeM" v-show="themeModal" class="modal">
            <h4>Choose a colour from the colour wheel for your background!</h4>
          <div @click="closeThemeModal()" class="close">&times;</div>
        <div class="modal-content">
            <label>Colour:<input id="colourWheel" v-model="colourChoice" type="color"></label>
            <br><br>
            <button @click="chooseTheme">Submit Colour Choice</button>
            <button @click="cancelColour">Cancel, Go back to Default</button>
        </div>
    
        </div>
      
        <div id="hikeM" v-show="hikeModal" class="modal">
            <div @click="closeModal()" class="close">&times;</div>
            <div class="modal-content">
                <button id="addToFaves" @click="addToFaves" v-show="signedIn && normmodalOpen">Add to Favourites</button>
                <h4 id="infoModal">{{infoModal}}</h4>
                <p class="title">Location:</p>
                <p id="locationModal">{{locationModal}}</p>
                <p class="title">Activity:</p>
                <p id="activityModal">{{activityModal}}</p>
                <p class="title">Length:</p>
                <p id="lengthModal">{{lengthModal}} mi</p>
                <p class="title">Description:</p>
                <div id="descriptionModal"></div>
                <a id="urlModal" :href="urlModal">More Info</a>
                <br>
                <img id="picModal" :src="imgModal" alt="">
            </div>
        </div>
      
      <div class="extraButtons" v-show="admin">
            <button @click="showUsers">See Users</button>
            <button @click="showActivity">See Site Activity</button>
        </div>
      <header>
    <authentication class="navbar-right"
                    :getUser="getUser"
                    :setUser="setUser" :refreshSetUser="refreshSetUser" :signedIn="signedIn">
    </authentication>
      <h1>HikeAdvisor</h1>
          </header>
    <div id="navbarr" class="container">
        <div class="row">
        <button class="nav col" v-show="signedIn" @click="openThemeOptions">Choose Theme</button>
      <button class="nav col" @click="showMap">World Map</button>
        <button class="nav col" @click="search">Search for Trails</button>
        <!--<div id="dropdown">
            <button @click="dropDown">View Trails by Category</button>
            <i></i>
        </div>-->
            <button>
        <label class="catLabel">View Trails By Category<select @click="showCategory" id="categorySelect" class="nav col" v-model="categ" name="View Trails by Category">
            <option></option>
            <option>All</option>
            <option>Long</option>
            <option>Medium</option>
            <option>Short</option>
    </select></label></button>
        <button @click="createTrip" class="nav col">Create a Trip</button>
        </div>
        </div>

        <br>
        
        <div v-show="categDisplay" id="display">
            <button class="categButtons" @click="displayFavourites" v-show="signedIn">See Favourite Hikes</button>
            <button v-show="signedIn" class="categButtons" @click="defaultCategory">Make Current Category Default</button>
            <br>
            <br>
            <div class="container">
            <div id="trailDisplayList" class="row">
            <div class="nameClick col-lg-3 col-md-5 col-sm-6" v-for="trail in categoryTrails">
                <p :id="trail[2].id" class="clickTrail" @click="openModal(trail)">{{ trail[2].name }}</p>
                <p class="noClick">{{trail[2].city}}, {{trail[2].country}}</p>
<!--                <img class="imgDisplay" :src="trail[2].pic">-->
            </div>
            </div>
                </div>
        </div>
        <br>
        <div v-show="displayFaves">
            <p v-show="nofaves">You do not have any current favourite trails</p>
            <ul v-for="trail in userFavourites">
                <button @click="removeFave(trail)">Remove From Favourites</button>
                <li :id="trail[2].id" class="nameClick" @click="openModal(trail)">{{ trail[2].name }}</li>
            </ul>
        </div>
        
        <div v-show="activityUS">
        <div>
            <h4>Search Activity</h4>
            <div v-show="SEACT">
            <div v-for="activity in searchActivities">
                <div>{{activity}}</div>
            </div>
            <button @click="clearSearchAct">Clear Search Activity</button>
                </div>
        </div>
      <br><br>
        <div>
            <h4>User Activity</h4>
            <div v-show="USACT">
            <div v-for="activity in userActivity">
                <div>{{activity}}</div>
            </div>
            <button @click="clearUserAct">Clear User Activity</button>
            </div>
        </div>
        </div>
        <div v-show="userStuff">
            <h4>Users and Their Information</h4>
            <div id="userdisplay" v-for="user in users">
                <p class="title">Name:</p>
                <div>{{user.name}}</div>
                <br>
                <p class="title">Email:</p>
                <div>{{user.email}}</div>
                <br>
                <p class="title">ID:</p>
                <div>{{user.uid}}</div>
                <br>
                <p class="title">Administration:</p>
                <p>{{user.admin}}</p>
                <button v-if="user.admin===false" @click="makeAdmin(user)">Make Admin</button>
                <button v-else @click="removeAdmin(user)">Remove from Admin</button>
            </div>
    
        </div>
      
        <div v-show="searchQs" id="searchCriteria">
            <h4>Search Criteria</h4>
            <hr/>
            <div class="row" id="qrow">
            <div class="col-lg-4 col-md-5 col-sm">
            <label class="searchQ">*Country:<br><br><select v-model="countrySelect">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Egypt</option>
                <option>Turkey</option>
                <option>Netherlands</option>
                <option>New Zealand</option>
            </select></label>
            <br><br>
            <label class="searchQ">State/Province:<br><br><input v-model="stateSelect" placeholder="Ex. Colorado"></label>
            <br><br>
            <label class="searchQ">City:<br><br><input v-model="citySelect" placeholder="Ex. Keystone"></label>
            </div>
                <br><br>
            <div class="col-lg-4 col-md-5 col-sm">
            <label class="searchQ">Activity Type:<br><br><select v-model="activitySelect">
                <option></option>
                <option>Mountain Biking</option>
                <option>Hiking</option>
                <option>Camping</option>
            </select></label>
            <br><br>
            <label class="searchQ">Trail Length:<br><br><select v-model="lengthSelect">
                <option></option>
                <option>Long (Greater than 12mi)</option>
                <option>Medium (5-12 mi)</option>
                <option>Short(Less than 5mi)</option>
            </select></label>
                <br><br>
            <label class="searchQ">Trail/Park Name:<br><br><input v-model="trailnameSelect" placeholder="Ex. Westridge Loop"></label>
                </div>
                </div>
            <br><br>
            <button @click="searchCriteria">Submit</button>
            <br><p>*required field</p>
            <hr/>
  
        </div>
        <div v-show="disMessage">
        <p id="searchMessage">We are sorry. We could not find exact results for the following criteria:</p>
            <ul v-for="message in searchMessages">
                <li>{{message}}</li>
            </ul>
            <p>We displayed the closest results.</p>
        </div>
      <br>
        <div v-show="displayResults" id="searchResults">
            <h4>Search Results</h4>
            <hr/>
            <div id="row">
            <div class="col" id="resultsCol" v-for="traill in criteriaResults">
                <div class="results" @click="openModal(traill)">{{traill[2].name}}</div>
            </div>
                </div>
        </div>
        <div v-show="worldMap">
            <h3>World Map</h3>
            <p>The world map below displays hikes from the mashape trail api. By hovering over a trail marked by a green dot, the trail's information will display to the right.</p>
            <hr/>
                
            <div class="row">
            <div id="map" class="col-lg-8">
                <svg id="svg"></svg>
            </div>
            <div id="other" class="col-lg-4">
            <h4 id="info"></h4>
                <p id="location"></p>
                <p id="activity"></p>
                <p id="length"></p>
                <div id="description"></div>
                <a id="url"></a>
                <br>
                <br>
                <img id="pic" src="" alt="">
            </div>
        </div>
            </div>
      
        <div v-show="planTrip">
            <div id="eventClickModal" v-show="eventClickModal" class="modal">
                <div @click="closeEventModal()" class="close">&times;</div>
                <div class="modal-content">
                    <p class="title">Event:</p>
                    <p>{{eventClickTitle}}</p>
                    <p class="title">Start Date:</p>
                    <p>{{eventClickStart}}</p>
                    <p class="title">End Date:</p>
                    <p>{{eventClickEnd}}</p>
                    <button @click="editEvent">Edit event details</button>
                    <br><br>
                    <div v-show="eventEdits">
                        <label>New Title:<input :placeholder="eventClickTitle" v-model="newEventTitle"></label>
                        <button @click="submitTitleEdit">Change Title</button>
                        <br><br>
                        <label>New Start Date:<input type="date" v-model="newEventStart" value="eventClickStart"></label>
                         <button @click="submitStartEdit">Change Start Date</button>
                        <br><br>
                        <label>New End Date:<input type="date" v-model="newEventEnd" value="eventClickEnd"></label>
                        <button @click="submitEndEdit">Change End Date</button>
                        <br><br>
    
                    </div>
                    <br><br>
                    <button @click="deleteClickedEvent">Delete Event</button>
                </div>
    
            </div>
            <h4>Use the calendar below to plan trips. Add trips that are multiple days, click on individual days to add a day trip, and add hikes that you may be interested in doing! You can always view contents of your plans and delete or edit them if necessary.</h4>
            <br>
            <calendar-view :events="userEvents" :enable-drag-drop="eventTimes" :starting-day-of-week="stow" @click-date="dateClick" @click-event="eventClick" @show-date-change="dateChange" :show-date="showDate"></calendar-view>
            <div id="empty"></div>
            <div id="addingEvent" v-show="addEvent">
                <p>If you would like to add your selected trail to your calendar please select the start and end date (optional)</p>
                <p class="title">To add:</p>
                <p>{{addHikeObj}}</p>
                <label class="title">Start Date:<input id="hikeDateStart" v-model="newStartDate" type="date"></label>
                <label class="title">End Date:<input id="hikeDateEnd" v-model="newEndDate" type="date"></label>
                <br><br>
                <button @click="addHiketoCalendar">Add Hike to Calendar</button>
                <button @click="cancelAdd">Cancel</button>
            </div>
            <hr/>
                <button @click="expand">Add a Trip to your Calendar!</button>
                <button @click="hide">^</button>
                <br><br>
                <div v-show="addTrip" id="addTrip">
                <label>Name:<input placeholder="Trip Name" v-model="newTripName"></label>
                <label>Start Date:<input id="tripDateStart" v-model="newTripStartDate" type="date"></label>
                <label>End Date:<input id="tripDateEnd" v-model="newTripEndDate" type="date"></label>
                <br>
                <br>
                <button @click="addTriptoCalendar">Add Trip to Calendar</button>
                <button @click="cancelAddTrip">Cancel</button>
                    
            
            </div>
            <hr/>
            <h3>Hover over any of the below hikes displayed on the map to view hike name. Click to add this hike to your calendar. Drop pins in areas where you want to see what is close by!</h3>
            <hr/>
            <div id="markerModal" class="modal">
                <div @click="closeMarkerModal()" class="close">&times;</div>
                <div class="modal-content">
                    <p>{{clickedMarkerName}}</p>
                    <p>Latitude</p>
                    <p>{{clickedMarkerLat}}</p>
                    <p>Longtitude</p>
                    <p>{{clickedMarkerLon}}</p>
                    <button @click="deleteMarker">Delete Marker</button>
    
                </div>
    
            </div>
                <gmap-map
                    :center="center"
                    :zoom="2"
                    @click="addMarker"
                    style="height: 480px; width: 80%; margin: 0 auto"
                    >
                    <gmap-marker
                        v-for="(m, index) in userMarkers"
                        :key="index+3"
                        :position="m.position"
                        :clickable="true"
                        :title="m.title"
                        @click="showMarker(m)"
                    >
                    </gmap-marker>
                    <a href="#addingEvent" v-smooth-scroll><gmap-circle
                        v-for="(c, index) in circles"
                        :key="c.id"
                        :center="c.center"
                        :radius="c.radius"
                        :options="c.options"
                        @mouseover="infoText = c.text"
                        @mouseout="infoText = ''"
                        @click="addTrailEventFromCircle(c)"
                    ></gmap-circle></a>
                    <div slot="visible">
                        <div style="bottom: 0; left: 0; background-color: blue; color: white; position: absolute; z-index: 100">
                          {{infoText}}
                        </div>
                    </div>
                </gmap-map>
            <br>
            <hr/>
            <button @click="seeCloseBy">Click to see trails close by to your pins!</button>
            <button @click="collapseCloseBy">x</button>
            <br><br>
            <div v-show="closeByResults">
                <ul v-for="close in closeBy">
                    <li>
                        <h3>Near by to your pin:</h3>
                        <h4>"{{close.pin.name}}"</h4>
                        <ul v-for="hike in close.hike">
                            <p class="closePinTrail" @click="openModal(hike)">{{hike[2].name}}</p>
                            <a href="#empty" v-smooth-scroll><button @click="addTrailEvent(hike)">Add to Calendar</button></a>
                            <br><br>
                        </ul>
                    </li>
                </ul>
    
            </div>
    
        </div>
  </div>
</template>

<script>

var categoryGlobal;
import CalendarView from "vue-simple-calendar";

require("vue-simple-calendar/dist/static/css/default.css");
    
import vueSmoothScroll from 'vue-smooth-scroll';
    
import * as d3 from 'd3';
import MAPDATA from './assets/ca.json';
var VueD3 = require('vue-d3');

import { usersRef, storageRef, tripRef, db, userActRef, searchActRef } from './database.js';
import Authentication from './components/Authentication';
    
import {TRAIL_KEY} from './secrets.js';

var myHeaders = new Headers();
myHeaders.append("X-Mashape-Key", TRAIL_KEY);

var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

var myRequest = new Request('https://trailapi-trailapi.p.mashape.com/', myInit);

var allHikes=[];
var circleS=[];
fetch(myRequest).then(data=>data.json()).then(data=>{
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
            };
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
            };
            var pt=[data.places[i].lon, data.places[i].lat, info];
            allHikes.push(pt);
        }
        circleS.push({
            id: data.places[i].id,
            center: {
                lng: data.places[i].lon,
                lat: data.places[i].lat
            },
            radius: 60000,
            text: data.places[i].name,
            options: {
                strokeColor: "red",
                strokeOpacity: 0.8,
                strokeWeight: 0.5,
                fillColor: "orange",
                fillOpacity: 0.3
            }
        });
    }
});
    
var filters= {
    Long: function (hikes) {
        var categhikes=[];
        var i;
        for (i=0; i<hikes.length; i++){
            if (hikes[i][2].length!=="no length recorded"){
                if (hikes[i][2].length>12){
                    categhikes.push(hikes[i]);
                }
            }
        }
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
    
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
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
        circles: circleS,
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
        stow: 0,
        showDate: new Date(),
        user: null,
        signedIn: '',
        trailModal: {},
        displayFaves: false,
        FaveTrails: [],
        normmodalOpen: true,
        nofaves: false,
        eventClickStart: '',
        eventClickEnd: '',
        eventClickTitle: '',
        eventClickModal: false,
        eventEdits: false,
        themeModal: false,
        colourChoice: '',
        markerModal: false,
        clickedMarkerName: '',
        clickedMarkerLat: '',
        clickedMarkerLon: '',
        clickedMarker: {},
        clickedEvent: {},
        newEventStart: '',
        newEventEnd: '',
        newEventTitle: '',
        admin: false,
        searchActivities: [],
        mapHasBeen: false,
        userStuff: false,
        userActivity: [],
        activityUS: false,
        SEACT: false,
        USACT: false,
    }
  },
    components: {
        CalendarView,
        Authentication
    },
    firebase: {
        users: usersRef,
        trip: tripRef,
        uaAct: userActRef,
        searchAct: searchActRef
    },
    computed: {
        categoryTrails(){
            console.log(this.categ)
            return filters[this.categ](this.allHikes);
        },

        userEvents(){
            if (this.user){
                var evs=[];
                var i;
                for (i=0;i<this.users.length;i++){
                    if (this.users[i].uid===this.user.uid){
                        for (var thing in this.users[i].calendarEvents){
                            evs.push(this.users[i].calendarEvents[thing]);
                        }
                    }
                }
                return evs;
            }

        },
        userMarkers(){
            if (this.user){
                var marks=[];
                var i;
                for (i=0;i<this.users.length;i++){
                    if (this.users[i].uid===this.user.uid){
                        for (var thing in this.users[i].markers){
                            marks.push(this.users[i].markers[thing]);
                        }
                    }
                }
                return marks;
            }
        },
        
        userFavourites(){
            if (this.user){
                var faves=[];
                var i;
                for (i=0;i<this.users.length;i++){
                    if (this.users[i].uid===this.user.uid){
                        var j;
                        for (var thing in this.users[i].favourites){
                            if (this.users[i].favourites[thing]!=""){
                                faves.push(this.users[i].favourites[thing]);
                            }
                        }
                    }
                }
                return faves;
            }
        }
    },
    methods: {
        getUser () {
            return this.user;
        },
        setUser (user) {
             //logging out
            if (user===null){
                this.user = user;
                return this.signedOut();
            }
            
            if (user!=null){
                var found=false;
                this.signedIn=true;
                var id=user.uid;
                //looking for existing account
                var category;
                var colour;
                var admin;
                this.users.forEach(function(user) {
                    console.log(user);
                    if (user.uid===id){
                        found=true;
                        console.log("no need to add");
                        category=user.defaultCategory;
                        colour=user.backColour;
                        admin=user.admin;
                    }
                });
                if (found===true){
                    this.categ=category;
                    if (colour!="default"){
                        document.body.style.backgroundColor = colour;
                    }
                    if (admin===true){
                        this.admin=true;
                    }
                    var date=new Date();
                    var str=user.name+"("+user.email+") signed in on "+date;
            
                    db.ref("userActivity").child("activities").push(str)
                }
                //new account created
                if (found===false){
                    this.user = user;
                    return this.createAccount();
                }
            }
            
            
        },
        refreshSetUser(user){
            this.USACT=false;
            this.SEACT=false;
            this.searchAct=false;
            this.userAct=false;
            this.userStuff=false;
            this.user=user;
            this.signedIn=true;
            var category="";
            var colour="";
            var id=user.uid;
            usersRef.once("value").then((snapshot)=>{
                var categ1;
                var key=snapshot.key;
                var childKey = snapshot.child().key;
                snapshot.forEach(function(user){
                    var categ2;
                    var key2=user.key;
                    if (key2===id){
                        user.forEach(function(thing){
                            var categ3;
                            var keyy=thing.key;
                            var val =thing.val();
                            if (keyy==="backColour"){
                                console.log("backcolour is "+val)
                                var colour=val;
                                if (colour!="" && colour!="default"){
                                    document.body.style.backgroundColor = colour;
                                }
                            }
                        })
                    }
                })
            })
            //wow this is faster LOL
            usersRef.child(id).child("defaultCategory").once("value").then((snapshot)=>{
                console.log(snapshot.val());
                this.categ=snapshot.val();
            })
            
            usersRef.child(id).child("admin").once("value").then((snapshot)=>{
                console.log(snapshot.val());
                var admin=snapshot.val();
                if (admin===true){
                    this.admin=true;
                }
            })
            
            
        },
        
        createAccount(){
            var attempt=this.user.uid;
            usersRef.child(attempt).set({
                name: this.user.name,
                email: this.user.email,
                uid: this.user.uid,
                isAnonymous: this.user.isAnonymous,
                favourites: [""],
                calendarEvents: [""],
                markers: [""],
                defaultCategory: "All",
                backColour: "default",
                admin: "false"
            });
            console.log("logged new");
            
            var date=new Date();
            var str=this.user.name+"("+this.user.email+") created an account on "+date;
            
            db.ref("userActivity").child("activities").push(str);
        },
        
        signedOut(){
            this.activityUS=false;
            this.USACT=false;
            this.SEACT=false;
            this.searchAct=false;
            this.userAct=false;
            this.userStuff=false;
            this.signedIn=false;
            this.categDisplay=true;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=false; 
            this.admin=false;
            document.body.style.backgroundColor = "#F0F8F8";
            this.categ="All";
        },
        
        showActivity(){
            this.activityUS=true;
            this.categDisplay=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=false;
            this.displayFaves=false;
            this.normmodalOpen=true;
            this.displayResults=false;
            this.userStuff=false;

            db.ref("searchActivity").child("sactivities").once("value").then((snapshot)=>{
                console.log(snapshot.val());
                this.searchActivities=snapshot.val();
            });

            db.ref("userActivity").child("activities").once("value").then((snapshot)=>{
                this.userActivity=snapshot.val();
            });
            this.USACT=true;
            this.SEACT=true;
            
        },
        showUsers(){
            this.userStuff=true;
            this.activityUS=false;
            this.categDisplay=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=false;
            this.displayFaves=false;
            this.displayResults=false;
            this.USACT=false;
            this.SEACT=false;
            
        },
        
        makeAdmin(user){
            usersRef.child(user.uid).child("admin").set(true);
        },
        removeAdmin(user){
            usersRef.child(user.uid).child("admin").set(false);
        },
        
        openThemeOptions(){
            document.getElementById("themeM").style.display="block";
            
        },
        
        closeThemeModal(){
            this.themeModal=false;
            document.getElementById("themeM").style.display="none";
        },
        
        chooseTheme(){
            console.log(this.colourChoice);
            var setit=this.colourChoice;
            var id=this.user.uid;
            if (setit!=""){
                usersRef.child(id).child("backColour").set(setit);
                document.body.style.backgroundColor = setit;
                this.themeModal=false;
            }
            else{
                alert("Please select a colour!")
            }
            
        },
        cancelColour(){
            var id=this.user.uid;
            usersRef.child(id).child("backColour").set("default");
            document.body.style.backgroundColor = "#F0F8F8";
            this.themeModal=false;
        },
        
        eventClick(event){
            console.log(event.startDate.toISOString());
            this.eventClickStart=event.startDate.toISOString().substring(0,10);
            console.log(this.eventClickStart);
            this.eventClickEnd=event.endDate.toISOString().substring(0,10);
            this.eventClickTitle=event.title;
            //this.eventClickModal=true;
            this.clickedEvent=event;
            document.getElementById("eventClickModal").style.display="block";
        },
        closeEventModal(){
            this.eventClickModal=false;
            this.eventEdits=false;
            document.getElementById("eventClickModal").style.display="none";
        },
        editEvent(){
            this.eventEdits=true;
        },
        submitTitleEdit(){
            var title;
            if (this.newEventTitle!=""){
                title=this.newEventTitle;
                var name=this.eventClickTitle;
                var start=this.eventClickStart;
                var end=this.eventClickEnd;
                console.log(start);

                var id=this.user.uid;
                usersRef.once("value").then(function(snapshot){
                    var key=snapshot.key;
                    var childKey = snapshot.child().key;
                    snapshot.forEach(function(user){
                        var key2=user.key;
                        if (key2===id){
                            user.forEach(function(thing){
                                var keyy=thing.key;
                                var val =thing.val();
                                if (keyy==="calendarEvents"){
                                    thing.forEach(function(f){
                                        var key3=f.key;
                                        var val=f.val();
                                        if (name===val.title&&start===val.startDate){ usersRef.child(key2).child(keyy).child(key3).child("title").set(title);
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
            else {
                alert("Please submit a change");
            }
            this.eventClickTitle=this.newEventTitle;
            this.newEventTitle='';
        },
        submitStartEdit(){
            if (this.newEventStart!=""){
                var newstart=this.newEventStart;
                console.log(newstart);
                var name=this.eventClickTitle;
                var start=this.eventClickStart;
                var end=this.eventClickEnd;

                var id=this.user.uid;
                usersRef.once("value").then(function(snapshot){
                    var key=snapshot.key;
                    var childKey = snapshot.child().key;
                    snapshot.forEach(function(user){
                        var key2=user.key;
                        if (key2===id){
                            user.forEach(function(thing){
                                var keyy=thing.key;
                                var val =thing.val();
                                if (keyy==="calendarEvents"){
                                    thing.forEach(function(f){
                                        var key3=f.key;
                                        var val=f.val();
                                        if (name===val.title&&start===val.startDate){ usersRef.child(key2).child(keyy).child(key3).child("startDate").set(newstart);
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
            else {
                alert("Please submit a change");
            }
            this.eventClickStart=this.newEventStart;
            this.newEventStart='';
        },
        submitEndEdit(){
            if (this.newEventEnd!=""){
                var newend=this.newEventEnd;
                console.log(newend);
                var name=this.eventClickTitle;
                var start=this.eventClickStart;
                var end=this.eventClickEnd;
                console.log(start);

                var id=this.user.uid;
                usersRef.once("value").then(function(snapshot){
                    var key=snapshot.key;
                    var childKey = snapshot.child().key;
                    snapshot.forEach(function(user){
                        var key2=user.key;
                        console.log(key2);
                        if (key2===id){
                            user.forEach(function(thing){
                                var keyy=thing.key;
                                var val =thing.val();
                                console.log(keyy);
                                console.log(val);
                                if (keyy==="calendarEvents"){
                                    thing.forEach(function(f){
                                        console.log(f.key);
                                        var key3=f.key;
                                        var val=f.val();
                                        console.log(f.val());
                                        if (name===val.title&&start===val.startDate){ usersRef.child(key2).child(keyy).child(key3).child("endDate").set(newend);
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
            else {
                alert("Please submit a change");
            }
            this.eventClickEnd=this.newEventEnd;
            this.newEventEnd='';
        },
        doneChanges(){
            this.eventEdits=false;
            this.eventClickModal=false;
        },
        
        deleteClickedEvent(){
            var name=this.eventClickTitle;
            var start=this.eventClickStart;
            var end=this.eventClickEnd;
            console.log(start);

            var id=this.user.uid;
            usersRef.once("value").then(function(snapshot){
                var key=snapshot.key;
                var childKey = snapshot.child().key;
                snapshot.forEach(function(user){
                    var key2=user.key;
                    console.log(key2);
                    if (key2===id){
                        user.forEach(function(thing){
                            var keyy=thing.key;
                            var val =thing.val();
                            console.log(keyy);
                            console.log(val);
                            if (keyy==="calendarEvents"){
                                thing.forEach(function(f){
                                    console.log(f.key);
                                    var key3=f.key;
                                    var val=f.val();
                                    console.log(f.val());
                                    if (name===val.title&&start===val.startDate){
                                        usersRef.child(key2).child(keyy).child(key3).remove();
                                    }
                                })
                            }
                        })
                    }
                })
            })
            this.eventClickModal=false;
            document.getElementById("eventClickModal").style.display="none";
            
        },
        
        dateClick (date){
            console.log(date);
            var da=date.toISOString().substring(0,10);
            var check=prompt("If you would you like to add an event the following day: "+date+", Please add a name for the event:")
            if (check!=null){
                console.log(date);
                var toadd=usersRef.child(this.user.uid).child("calendarEvents");
                toadd.push({
                    title: check,
                    startDate: da
                });
            }
        },
        
        dateChange(date){
            console.log(date);
            this.showDate=date;
        },
        expand (){
            this.addTrip=true;
        },
        hide (){
            this.addTrip=false;
        },
        createTrip(){
            if (this.user){
                this.USACT=false;
                this.SEACT=false;
                this.activityUS=false;
                this.userStuff=false;
                if (this.planTrip===false){
                    this.categDisplay=false;
                    this.disMessage=false;
                    this.displayResults=false;
                    this.searchQs=false;
                    this.worldMap=false;
                    this.planTrip=true;
                    this.displayFaves=false;
                    this.normmodalOpen=true;
                }
            }
            else{
                alert("Sorry, you need to be logged in to create a Trip")
            }
            
        },
        seeCloseBy(){
            this.closeByResults=true;
            var i;
                var nearMarkers=[];
                for (i=0; i<this.userMarkers.length;i++){
                    if (this.userMarkers[i]!=""){
                        var j;
                        var mlongmax=Math.abs(this.userMarkers[i].position.lng)+2;
                        var mlongmin=Math.abs(this.userMarkers[i].position.lng)-2;
                        var mlatmax=Math.abs(this.userMarkers[i].position.lat)+2;
                        var mlatmin=Math.abs(this.userMarkers[i].position.lat)-2;
                        console.log(mlongmax+"and"+mlongmin);
                        var markercloses=[];
                        for (j=0; j<this.allHikes.length; j++){

                            var hlong=Math.abs(this.allHikes[j][0]);
                            console.log(hlong);
                            var hlat=Math.abs(this.allHikes[j][1]);
                            if (hlong<mlongmax && hlong>mlongmin && hlat<mlatmax && hlat>mlatmin){
                                    markercloses.push(this.allHikes[j]);
                                }
                        }
                        nearMarkers.push({
                                pin: this.userMarkers[i],
                                hike: markercloses
                        });
                        console.log(nearMarkers);
                        }
                    }
                    this.closeBy=nearMarkers;
        },
        
        collapseCloseBy(){
            this.closeByResults=false;
        },
        
        addMarker (event) {
            var toadd=usersRef.child(this.user.uid).child("markers");
            var name=prompt("Please enter a name for your marker:", "Ex. My Start Location");
            console.log(name);
            if (name!=null){
                toadd.push({
                    position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
                    name: name,
                    title: name
                });
                var i;
                var nearMarkers=[];
                for (i=0; i<this.userMarkers.length;i++){
                    if (this.userMarkers[i]!=""){
                        var j;
                        var mlongmax=Math.abs(this.userMarkers[i].position.lng)+2;
                        var mlongmin=Math.abs(this.userMarkers[i].position.lng)-2;
                        var mlatmax=Math.abs(this.userMarkers[i].position.lat)+2;
                        var mlatmin=Math.abs(this.userMarkers[i].position.lat)-2;
                        console.log(mlongmax+"and"+mlongmin);
                        var markercloses=[];
                        for (j=0; j<this.allHikes.length; j++){

                            var hlong=Math.abs(this.allHikes[j][0]);
                            console.log(hlong);
                            var hlat=Math.abs(this.allHikes[j][1]);
                            if (hlong<mlongmax && hlong>mlongmin && hlat<mlatmax && hlat>mlatmin){
                                    markercloses.push(this.allHikes[j]);
                                }
                        }
                        nearMarkers.push({
                                pin: this.userMarkers[i],
                                hike: markercloses
                        });
                        console.log(nearMarkers);
                        }
                    }
                    this.closeBy=nearMarkers;
                }
            
        },
        showMarker(m){
            document.getElementById("markerModal").style.display="block";
            this.clickedMarker=m;
            this.clickedMarkerName=m.name;
            this.clickedMarkerLat=m.position.lat;
            this.clickedMarkerLon=m.position.lng;
            
        },
        
        closeMarkerModal(){
            this.markerModal=false;
            document.getElementById("markerModal").style.display="none";
        },
        
        deleteMarker(){
            var name=this.clickedMarkerName;
            var lat=this.clickedMarkerLat;
            var long=this.clickedMarkerLon;
            var id=this.user.uid;
            usersRef.once("value").then(function(snapshot){
                var key=snapshot.key;
                var childKey = snapshot.child().key;
                snapshot.forEach(function(user){
                    var key2=user.key;
                    console.log(key2);
                    if (key2===id){
                        user.forEach(function(thing){
                            var keyy=thing.key;
                            var val =thing.val();
                            console.log(keyy);
                            console.log(val);
                            if (keyy==="markers"){
                                thing.forEach(function(f){
                                    console.log(f.key);
                                    var key3=f.key;
                                    var val=f.val();
                                    console.log(f.val());
                                    if (name===val.name&&lat===val.position.lat&&long===val.position.lng){
                                        usersRef.child(key2).child(keyy).child(key3).remove();
                                    }
                                })
                            }
                        })
                    }
                })
            })
            
        },
        
        addTrailEvent(trail){
            this.addEvent=true;
            this.addHikeObj=trail[2].name;
        },
        
        addTrailEventFromCircle(trail){
            this.addEvent=true;
            this.addHikeObj=trail.text; 
        },
        
        cancelAdd(){
            this.addHikeObj='';
            this.newStartDate='';
            this.newEndDate='';
            this.addEvent=false;
        },
        cancelAddTrip(){
            this.newTripName='';
            this.newTripStartDate='';
            this.newTripEndDate='';
            this.addTrip=false;
        },
        
        addHiketoCalendar() {
            var toadd=usersRef.child(this.user.uid).child("calendarEvents");
            console.log(toadd);
            if (this.newEndDate!==''){
                toadd.push({
                    title: this.addHikeObj,
                    startDate: this.newStartDate,
                    endDate: this.newEndDate,
                });
            }
            else {
                toadd.push({
                    title: this.addHikeObj,
                    startDate: this.newStartDate,
                });
            }
            console.log("added");
            this.newStartDate='';
            this.newEndDate='';
            this.addHikeObj='';
            this.addEvent=false;
        },
        
        addTriptoCalendar(){
            var toadd=usersRef.child(this.user.uid).child("calendarEvents");
            console.log(toadd);
            console.log("addtrip");
            console.log(this.newTripStartDate);
            toadd.push({
                title: this.newTripName,
                startDate: this.newTripStartDate,
                endDate: this.newTripEndDate
            });
            this.events.push({
                title: this.newTripName,
                startDate: this.newTripStartDate,
                endDate: this.newTripEndDate
            });
            this.newTripName='';
            this.newTripStartDate='';
            this.newTripEndDate='';
            this.addTrip=false;
        },
//        zoomed() {
//            d3.select("svg").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//        },
        
        showMap(){
            this.USACT=false;
            this.SEACT=false;
            this.activityUS=false;
            this.userStuff=false;
            this.categDisplay=false;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.planTrip=false;
            this.worldMap=true;
            this.displayFaves=false;
            this.normmodalOpen=true;
            
            var svg = d3.select("svg");
            var projection = d3.geoMercator();
                
            var path = d3.geoPath()
              .projection(projection);
            console.log("here3");
            
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
                    .attr("r", "2px")
                    .attr("fill", "darkgreen")
                  //make hover so that will display info to the right
                    .on("mouseover", function(d){
                        console.log(d[2]);
                        d3.select("#info").text("Trail Name: "+d[2].name);
                        d3.select("#location").text("Location: "+d[2].city);
                        d3.select("#activity").text("Activity Type: "+d[2].activity);
                        d3.select("#length").text("Length: "+d[2].length+" miles");
                        d3.select("#description").selectAll("div").remove();
                        var l=d3.select("#description").append('div').html(d[2].description);
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
            this.USACT=false;
            this.SEACT=false;
            this.activityUS=false;
            this.userStuff=false;
            console.log(this.users)
            this.categDisplay=true;
            this.disMessage=false;
            this.displayResults=false;
            this.searchQs=false;
            this.worldMap=false;
            this.planTrip=false;
            this.displayFaves=false;
            this.normmodalOpen=true;
        },
        
        closeModal(){
            //this.hikeModal=false;
            document.getElementById("hikeM").style.display="none";
        },
        
        openModal(trail){
            //this.hikeModal=true;
            this.infoModal=trail[2].name;
            this.locationModal=trail[2].city;
            this.activityModal=trail[2].activity;
            this.urlModal=trail[2].url;
            var el=document.createElement('div');
            el.innerHTML=trail[2].description;
            document.getElementById("descriptionModal").innerHTML="";
            document.getElementById("descriptionModal").append(el);
            this.lengthModal=trail[2].length;
            this.imgModal=trail[2].pic;
            console.log(trail[2].pic)
            if (trail[2].pic!=null){
                console.log("not null");
                document.getElementById("picModal").alt=("trail pic")
            }
            this.trailModal=trail;
            
            if (this.user){
                this.signedIn=true;
            }
            document.getElementById("hikeM").style.display="block";
        },
        
        addToFaves(){
            var toadd=usersRef.child(this.user.uid).child("favourites");
            toadd.push(this.trailModal);
            alert("Added to Favourites!");
            
        },
        removeFave(trail){
            console.log(this.userFavourites);
            //remove trail
            var id=this.user.uid;
            //usersRef.child(id).child(favourites)
            console.log(id);
            usersRef.once("value").then(function(snapshot){
                var key=snapshot.key;
                var childKey = snapshot.child().key;
                snapshot.forEach(function(user){
                    var key2=user.key;
                    console.log(key2);
                    if (key2===id){
                        user.forEach(function(thing){
                            var keyy=thing.key;
                            var val =thing.val();
                            console.log(keyy);
                            console.log(val);
                            if (keyy==="favourites"){
                                thing.forEach(function(f){
                                    console.log(f.key);
                                    var key3=f.key;
                                    var val=f.val();
                                    console.log(f.val());
                                    if (trail[0]===val[0]&&trail[1]===val[1]&&trail[2].id===val[2].id){
                                        usersRef.child(key2).child(keyy).child(key3).remove();
                                    }
                                })
                            }
                        })
                    }
                })
            })

        },
        
        displayFavourites(){
            //this.searchAct=false;
            //this.userAct=false;
            this.USACT=false;
            this.SEACT=false;
            this.activityUS=false;
            this.userStuff=false;
            console.log("here")
            this.categDisplay=false;
            this.displayFaves=true;
            this.normmodalOpen=false;
            if (this.userFavourites.length===0){
                console.log("here");
                this.nofaves=true;
            }
            else{
                this.nofaves=false;
            }
            
        },
        
        defaultCategory(){
            console.log(this.categ);
            var setit=this.categ;
            var id=this.user.uid;
            usersRef.child(id).child("defaultCategory").set(setit);
            alert("Default category set to: "+this.categ);
        },
        
        search(){
            //this.searchAct=false;
            //this.userAct=false;
            this.USACT=false;
            this.SEACT=false;
            this.activityUS=false;
            this.userStuff=false;
            this.categDisplay=false;
            this.searchQs=true;
            this.worldMap=false;
            this.planTrip=false;
            this.displayFaves=false;
            this.normmodalOpen=true;
        },
        
        searchCriteria(){
            this.disMessage=false;
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
            console.log(criteria);
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
            
            var s="";
            var activity=[];
            var i;
            for (i=0;i<criteria.length;i++){
                if (criteria[i]!=0){
                    if (i==0){
                        s=s+"Country: "+criteria[i]+" ";
                    }
                    if (i==1){
                        s=s+"City: "+criteria[i]+" ";
                    }
                    if (i==2){
                       s=s+"State: "+criteria[i]+" ";
                    }
                    if (i==3){
                        s=s+"Activity: "+criteria[i]+" ";
                    }
                    if (i==4){
                        s=s+"Trail Name: "+criteria[i]+" ";
                    }
                    if (i==5){
                        s=s+"Trail Length: "+criteria[i];
                    }
                    
                }
            }
            var date=new Date();
            if (this.user){
                s=this.user.name+" searched: "+s+" ("+date+")";
                console.log(s);
                db.ref("searchActivity").child("sactivities").push(s);
            }
        },
        
        clearUserAct(){
            db.ref("userActivity").child("activities").set([""]);
            this.USACT=false;
        },
        clearSearchAct(){
            db.ref("searchActivity").child("sactivities").set([""]);
            this.SEACT=false;
        }
    }
}
</script>


<style lang="scss">
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }

    h1 {
      font-weight: 500;
        font-size: 33pt;
        border: solid thin black;
        max-width: 40%;
        text-align: center;
        margin: 0 auto
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
    
    #navbarr{
        background-color: antiquewhite;
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
        background-color: aliceblue;
        overflow: scroll;
        border: solid thin black;
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
        color: black;
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
        z-index: 100;
        color: black;
        background-color: #E1FEE3;
        border-style: solid;
        border-width: thin;
        border-color: black;
    }
    #svg{
        border-style: solid;
        border-width: thin;
        border-color: black;
    }
    
    .nameClick:hover{
        cursor: pointer;
    }
    .calendar-view {
        border-style: groove;
        border-width: thin;
        border-color: black;
    }
    button{
        border-style: solid;
        border-color: black;
    }
    catLabel{
        background-color: white;
    }
    catLabel:hover{
        background-color: darkgrey;
        cursor: pointer; 
    }
    button:hover{
        background-color: darkgrey;
        cursor: pointer;
    }
    input{
        border-style: solid;
        border-color: black;
    }
    select{
        border-radius: 0px;
    }
    .event{
        z-index: 1000;
    }
    div .event .offset2{
        z-index: 200;
    }
    .calendar-view{
        margin: 5px;
    }
    .calendar-view .header{
        background-color: lightgray;
    }
    .calendar-view .header button{
        background-color: white;
    }
    .calendar-view .week .event{
        background-color: #C2ECF9;
    }
    .calendar-view .weeks{
        height: 30em;
        overflow: scroll;
        background-color: #F6F7F7;
    }
    
    #trailDisplayList{
        justify-content: space-around;
    }
    .nameClick{
        border-style: double;
        border-width: thin;
        border-color: black;
        margin: 2px;
        background-color: #EEFBFA;
    }
    .imgDisplay{
        max-width: 30%;
    }
    #userdisplay{
        border-style: groove;
        border-width: thin;
        border-color: black;
        width: 50%;
        margin: 0 auto;
        padding: 4px;
    }
    #pic{
        max-width: 50%;
    }
    .searchQ{
        font-size: 13pt;
        font-weight: 500;
        background-color: aliceblue;
        border: solid thin black;
        text-decoration: underline;
    }
    .searchQ:hover{
        background-color: aliceblue;
    }
    .navbar-right{
        background-color: aliceblue;
        position: absolute;
        right: 0;
        top: 0;
    }
    #firebaseui-auth-container{
        position: fixed;
        z-index: 100;
    }
    .firebaseui-title{
        font-size: 13pt;
        text-align: center;
        border: none;
        margin: auto;
    }
    
    header{
        background-image: url("assets/grass2.jpg");
        background-size: cover;
        height: 200px;
    }
    .extraButtons{
        position: absolute;
        top: 0;
        left: 0;
    }
    .categButtons{
        background-color: azure;
    }
    body{
        background-color: #F0F8F8;
    }
    #qrow{
        justify-content: center;
    }
    .clickTrail{
        font-weight: 500;
    }
    .clickTrail:hover{
        cursor: pointer;
        background-color: lightblue;
    }
    
    .noClick:hover{
        cursor: default;
    }
    #resultsCol{
        max-width: 50%;
        margin: 0 auto;
    }
    .results{
        margin: 10px;
        border: solid thin black;
        background-color: gainsboro;
    }
    .results:hover{
        background-color: azure;
        cursor: pointer;
    }
    
    .closePinTrail{
        font-size: 14pt;
        font-weight: 500;
    }
    .title{
        font-weight: bold;
    }
    select{
        border: solid thin black;
    }
    #colourWheel{
        width: 30%;
    }
    #addToFaves{
        float: right;
    }
    #infoModal{
        text-align: center;
    }
</style>
