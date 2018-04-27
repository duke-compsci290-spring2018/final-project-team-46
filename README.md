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

Error:
vue.esm.js?efeb:591 [Vue warn]: Duplicate keys detected: '7054'. This may cause an update error.

found in

---> <App> at src/App.vue
       <Root>

Anna Munro adm58

used: bootstrap, vue (map, calendar), d3, firebase

Likewise, make the data from your site available to others in JSON format so they do not need to scrape your web site.

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

