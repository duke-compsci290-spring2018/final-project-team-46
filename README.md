# trails

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

Description:

My application includes a lot of what I explained in my introductions. Basically I have the main site that opens right away. You have a world map, search for trails, view trails by category and create a trip all in the navbar. The world map is a d3 visualization of a map with points on it representing trails. If you hover over a point, the trail info displays to the right. The negative part about this is that the data I'm using is not completely filled in, so some hikes don't have pictures or descriptions etc. Also, the descriptions were hard to parse through, I managed to basically parse through it all except for some descriptions had <br>...<br/>, but the br end tag does not exist, so I was unable to parse out any <br/>, which looks bad when you open up those certain ones. The search for trails is a type of relaxed query, where it only requires you to put the country in. The problem is the majority of the data is in the USA, so realistically searches for other countries will show up with hardly anything. The search allows you to put whatever you want in and it will give you the closest results it can. (Ex. If you search hikes in USA, California, San Diego--it may not have any hikes in San Diego and just display hikes that are in USA, California). Viewing trails by category just displays the lists of hikes. For search results and this display, you can click on the trails to view more information about them. To use the rest of the site, it's required that you login. 

Once you login, you can have a few preferences. You can set a theme background colour for you site. You can set a display of hikes as a default category, so next time you login that's the category that will show. (Ex I really like long hikes, every time I login in I want it to display the long hikes, so I set long hikes as the default category). You can also now add hikes to your list of favourites. If you open a hike, think you might like it, you can click add to favourites. You can then go and view your favourite hikes and remove them if necessary. You can now create a trip. So, you can go ahead and add to your calendar. You can add to the calendar in 4 ways. 1) You can click on a day and add an event to that day. 2) You can add a trip to your calendar with a start and end date. 3) You can click on a hike circle that is on the map and add that hike to your calendar as an event (only need start date). 4) You can see hikes that are close to your pins, and add them as an event to your calendar from there. Once you have added the events to your calendar, you can click on them to edit their details, or delete them. You can interact with the map by hovering over circles to see the hike names and by dropping pins where you think you might be interested in going. Once you drop your pin you can view hikes that are near that pin. You can click on the marker to view the name, latitude and longtitude, and you can delete it if necessary. 

Finally, if you login as an admin, you can also view site activity. This shows who has logged in and when, and the searches that have been made and when. You can also view users. This shows a list of users and their information, you have the power to make other people administrators, or remove them from being an administrator. (Right now, there is only one admin, and I gave the login info below).

What makes your application useful-I think my application is useful because there are definitely sites out there that display hike data, but most of those sites won't also include a way to plan a trip and add that hike data to a calendar. I think the planning a trip part is more what makes the application unique. It is helpful to be able to search hikes and view the data multiple ways, but planning a trip and dropping pins makes it more interactive.

Special instructions needed to set up, run, access, or use your application (like user passwords you have set up, command line utilities, or external programs that need to be run)-For this website you can just create an account to sign in. To get access to the admin account it is: 

                email: a.munro222@gmail.com
                password: tatertot
                    
                -if you would like your account to be admin you can simply create your account, logout and login to the above admin account and make yourself an admin.

The API keys are in secret.js and nothing else should need to be set up. 

references for your data that establishes its authenticity-the data comes from the Mashape Trail API

discuss both the pros and the cons of different framework possibilities you considered and why you made the decision you did (including choosing not to use any framework)
-used: bootstrap, vue (map, calendar), d3, firebase
I used vue as my main framework because I felt most familiar with it, and as I was planning for the project I could imagine what I wanted to do and how I would do it with vue. I knew how I would use it for the various features I wanted to make. I wanted to use d3 to visualize a map, I figured that it would be good to use d3 for the visualization and then google map component for the pins. I wanted to use d3 for the visualization because d3 is obviously made for visualizations and I thought it would work to make a good display of the map with the different hikes on it. However, I decided d3 is not my favourite framework, it was confusing to learn and I had difficulty doing what I thought would be more simple. (I would have liked to, for example, be able to zoom in on the map). Using vue for the map worked well too because I had practice working with the map from the mash-up lab and then I was also able to use the vue calendar component, which worked really well for creating the calendar. I used bootstrap for my styling because it creates nice grids, columns, lists and makes the styling and responsiveness of the site work well. I used firebase for my data since we I had used that for trello and knew that it would work well for what I wanted to do. Plus, it was really helpful to use firebase authentication. However, though firebase is great for pushing and changing data, I find it frustrating having to use a snapshot everytime I want to view data that is stored. 

Anna Munro adm58

Likewise, make the data from your site available to others in JSON format so they do not need to scrape your web site.

export json data from firebase

Regarding security, any API keys or passwords you use must be checked into your GitHub repository

Your application must be accessible from GitHub Pages at all times

w3schools
vue.js
stackoverflow

d3 STUFF:
d3 projection types https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md
tutorial for getting json data geometries : https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
resource for getting geometry data: http://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/
looked at mashape for changing shape files into json: http://mapshaper.org/
help for where to get data and where i found mashape as tool: https://hackernoon.com/how-to-convert-and-prepare-topojson-files-for-interactive-mapping-with-d3-499cf0ced5f
learning about d3 paths: https://github.com/d3/d3-geo
help for displaying map: http://bl.ocks.org/almccon/fe445f1d6b177fd0946800a48aa59c71
more d3 info: https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md
help for adding data points to a map: http://bl.ocks.org/phil-pedruco/7745589
trail data: https://catalog.data.gov/dataset/trails
lat and lon fix: https://stackoverflow.com/questions/20026640/d3-mercator-function-nan
mouse events: http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774

Vue Calendar HELP
https://vuejsexamples.com/simple-vue-component-to-show-a-month-grid-calendar-with-events/
https://github.com/richardtallent/vue-simple-calendar/blob/master/src/CalendarView.vue
https://github.com/richardtallent/vue-simple-calendar#props
https://www.npmjs.com/package/vue-simple-calendar

DUVALL:
-mash up lab
-firebase authentication

TODO:
*administrator
    *login activity
    *trail search activity??
    *make others admin
*STYLE LITERALLY EVERYTHING
*parse d3 descriptions


*refresh FIXED
*be able to remove trails from favourites
*remove marker
*remove event
*edit event details
*administrator
    *login activity
    *trail search activity??
*work on default category/background colour
*work on user sign in troubles
*click on event to see details


*fix select button to say View categories
display lists of hikes pretty
*close by trails update right away
*calendar two events at same day
*circles on google map better
*administrator?
*weird key error for map

SIGN IN STUFF:
login to:
    *have favourite trails
    *have default category
    *create a trip
    *view favourite trails

DATABASE:
*user authentication
   * email 
    *password
   * calendar events

CALENDAR:
*click on event to see details
*edit details
*click on day to add event
*add hike scrolls you up?? or opens as modal

extras:
-similar hikes?
-add image etc to a hike
-drag and drop?
-zoom in on d3

