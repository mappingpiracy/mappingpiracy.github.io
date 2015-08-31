# mappingpiracy.net
Mapping Piracy Web Application - Formerly known as MPMAP

##General

This project is a tool that allows the user to filter, map, and see trends from a dataset of ~7000 maritime piracy incidents dating back to 1993.

##Up and running

If you need/want to work on this project, or just run it locally on your machine:

0. Requirements
  - Nodejs
  - A web browser
  - Internet connection
1. Clone or fork and clone this repository to your local machine.
2. Install the node packages:
  > npm install  

3. Launch the local development server:
  > gulp

4. (optional) To build the project (create templates, concatenate, minify, inject):
  > gulp build

5. Push/copy the project to any webserver that can serve static content.

##Implementation / Technical

###Tools - Frontend
This is essentially a front-end only app, in that it requires no server. The application is build using AngularJS, along with several other libraries:
  - [Angular UI Bootstrap](https://github.com/angular-ui/bootstrap) - used for controls, i.e. typeahead filtering
  - [jQuery](https://github.com/jquery/jquery) - required for UI Bootstrap
  - [Bootswatch.com](https://bootswatch.com/cosmo/) cosmo styles
  - [Leaflet](https://github.com/Leaflet/Leaflet) - used for mapping
  - [nvD3](https://github.com/novus/nvd3) - used for the specific line-chart graph for data analysis
  - [D3.js](https://github.com/mbostock/d3) - required by nvd3
  - [moment.js](https://github.com/moment/moment/) - used for date/time parsing, this will probably be taken out eventually
  - [modernizer](https://github.com/Modernizr/Modernizr) and [webshims](https://github.com/aFarkas/webshim) - used to polyfill the calendar-style date-selector in older browsers

###Tools - Data
This implementation of the application uses Google Docs Spreadsheets as its source for data. This is implemented with:
  - [SheetRock.js](https://github.com/chriszarate/sheetrock) - used to query publicly-shared Google Docs Spreadsheets
  - [Google Chart Query Language](https://developers.google.com/chart/interactive/docs/querylanguage#where)

###Application Structure
//TODO

###Adding Data Sources
//TODO

###Prior Implementations
This project is on its third iteration in terms of the technical implementation. The prior implementations have been phased out, but the source code is still available:
  - [MPMAP using Java Play Framework](https://github.com/mappingpiracy/mpmap) - phased out ~February 2015 b/c the Play Framework was complete overkill for this type of application.
  - [MPMAP using SailsJS](https://github.com/mappingpiracy/mpmap-sails) - phased out ~August 2015 to eliminate the need for a backend-server and make data updates and changes simpler via Google Docs Spreadsheets.
