let view;
let map;
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/layers/TileLayer",
  "esri/layers/GroupLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Home",
  "esri/layers/MapImageLayer",
  "esri/geometry/support/webMercatorUtils",
  "esri/request",
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/Print",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Polyline",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/widgets/BasemapToggle",
  "esri/layers/support/LabelClass",
  "esri/renderers/UniqueValueRenderer",
  "dojo/dom","dojo/domReady!"
  ],
  function(Map, MapView, FeatureLayer, Legend, TileLayer, GroupLayer, LayerList, Home, MapImageLayer, webMercatorUtils, esriRequest, Expand, Search, Print, SketchVM,
      Polyline, SimpleMarkerSymbol, Graphic, GraphicsLayer, SimpleRenderer, BasemapToggle, LabelClass, UniqueValueRenderer, dom) {

  //Plan for obtaining field information in use for popup:
    //1. obtain layer information from rest service as json
	//2. put url into a function that returns the template (object) that the popup needs (name and field info)
	//3. assign the template to the feature layer before adding it to the map/view

  function crtPopUpTemplate(basicURL, layerID, layerVName) {
	var url = basicURL+'/'+layerID.toString()+'?f=json';
	esriRequest(url, {responseType: "json"}).
	  then(function(response){
		Alldata = response.data;
		var titleLayer = Alldata.name;
		if (titleLayer.includes('_') == true) {
 			resultIf = titleLayer.replace(/_/g," ");
		} else {
		  resultIf = titleLayer;
		}

		let fieldInfosArray = [];
		for(let i=0; i<Alldata.fields.length; i++) {
		  fieldInfosArray[i] = {fieldName: Alldata.fields[i].name, label: Alldata.fields[i].alias}
		}

		template1 = {
		title: resultIf,
		content: [{
		 type: "fields",
		 fieldInfos: fieldInfosArray
		}]
		};
		layerVName.popupTemplate=template1;
	  });
  }



  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~Oil and Gas~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  var natGasL = new FeatureLayer({
    url: "http://services2.arcgis.com/VofPZYDe2pLxSP5G/arcgis/rest/services/CA_Natural_Gas_Pipeline/FeatureServer/0",
    id: "natgas",
	title: "CA Natural Gas Pipeline",
    opacity: 0.9,
    visible: true
  });
  console.log(natGasL.title);
  crtPopUpTemplate(natGasL.url, natGasL.layerId,natGasL);

  var GensL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Generator/FeatureServer/0",
    id: "gen",
    opacity: 0.9,
    visible: true
  });
  crtPopUpTemplate(GensL.url, GensL.layerId, GensL);

  var natgasStationsL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Natural_Gas_Station/FeatureServer/0",
    id: "ngstations",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(natgasStationsL.url, natgasStationsL.layerId,natgasStationsL);

  var powplantL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Power_Plant/FeatureServer/0",
    id: "pwrplant",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(powplantL.url, powplantL.layerId, powplantL);

  var ngpsL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA_Natural_Gas_Power_Stations/FeatureServer/0",
    id: "natgaspowStn",
    opacity: 0.9,
    visible: true
  });
  crtPopUpTemplate(ngpsL.url, ngpsL.layerId,ngpsL);

  var inj_wdwL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/1",
    id: "watdispWell",
    opacity: 0.9,
    visible: true,
    title: "Water Disposal Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_wdwL.url, inj_wdwL.layerId,inj_wdwL);

  var inj_gdwL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/2",
    id: "gasdispWell",
    opacity: 0.9,
    visible: true,
    title: "Gas Disposal Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_gdwL.url, inj_gdwL.layerId,inj_gdwL);

  var inj_pmwL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/3",
    id: "pressmaintWell",
    opacity: 0.9,
    visible: true,
    title: "Pressure Maintenance Disposal Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_pmwL.url, inj_pmwL.layerId,inj_pmwL);

  var inj_awL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/4",
    id: "airWell",
    opacity: 0.9,
    visible: true,
    title: "Air Injection Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_awL.url, inj_awL.layerId,inj_awL);

  var inj_sfL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/5",
    id: "stmfldWell",
    opacity: 0.9,
    visible: true,
    title: "Steam Flood Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_sfL.url, inj_sfL.layerId,inj_sfL);

  var inj_wfL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/6",
    id: "watfldWell",
    opacity: 0.9,
    visible: true,
    title: "Water Flood Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(inj_wfL.url, inj_wfL.layerId,inj_wfL);

  var gasStrgWL = new FeatureLayer({
    url: "https://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA_Gas_Storage_Wells_073113/FeatureServer/0",
    id: "gasStorageWell",
    opacity: 0.9,
    visible: true,
    title: "Gas Storage Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(gasStrgWL.url, gasStrgWL.layerId,gasStrgWL);

  var stimWL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CAStimulatedWells/FeatureServer/0",
    id: "stimulatedWell",
    opacity: 0.9,
    visible: true,
    title: "Stimulated Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(stimWL.url, stimWL.layerId,stimWL);

  var ogProdWL = new FeatureLayer({
    url: "https://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CAOilandGasProductionWells/FeatureServer/0",
    id: "oilgasProdWell",
    opacity: 0.9,
    visible: true,
    title: "Oil and Gas Production Wells",
	definitionExpression: "Latitude < 34.991367",
  });
  crtPopUpTemplate(ogProdWL.url, ogProdWL.layerId,ogProdWL);

  var offshoreOL = new FeatureLayer({
    url: "http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA_Offshore_Oil_Pipeline_100813/FeatureServer/0",
    id: "offshoreOPL",
    title: "Offshore Oil Pipeline",
    opacity: 0.9,
    visible: false,
  });
  crtPopUpTemplate(offshoreOL.url, offshoreOL.layerId,offshoreOL);

  var natgasPipesDL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Natural_Gas_Pipeline/FeatureServer/0",
    id: "natgaspipes_CEC",
    opacity: 0.9,
    visible: false,
  });
  crtPopUpTemplate(natgasPipesDL.url, natgasPipesDL.layerId,natgasPipesDL);

  var inundatedPipesL = new TileLayer({
    url: "http://tiles.arcgis.com/tiles/CEbkk5WeOgep1LWT/arcgis/rest/services/Los_Angeles_Natural_Gas_Pipelines_Inundated/MapServer/",
    visible: false,
	title: 'ICF International',
	definitionExpression: "Latitude < 34.991367",
  });


  //~~~~~~~~~~BELOW DOES NOT WORK!~~~~~~~~~~~~~~
  inundatedPipesL.watch("loaded", function() {
	var this_layer = inundatedPipesL.allSublayers.items[0];
    this_layer.popupTemplate = {

    title: "LA Natural Gas Pipelines - Inundated",
	content: [{
	  type: "text",
	  text: "No attributes to display..."
	}]
	};
    console.log(this_layer.popupTemplate);
    this_layer.popupEnabled = true;
  });


  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~Electric Layer~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  //california energy commission
  var substationsL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Substation/FeatureServer/0",
    id: "substations_CEC"
  });
  crtPopUpTemplate(substationsL.url, substationsL.layerId,substationsL);
  var transLinesL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/arcgis/rest/services/Transmission_Line/FeatureServer/0",
    id: "transmissionlines"
  });
  crtPopUpTemplate(transLinesL.url, transLinesL.layerId,transLinesL);
  var elecServiceAreaL = new FeatureLayer({
    url: "https://services3.arcgis.com/bWPjFyq029ChCGur/ArcGIS/rest/services/Electric_Service_Area/FeatureServer/0",
    id: "ServiceTerritory",
    opacity: 0.4,
  });
  crtPopUpTemplate(elecServiceAreaL.url, elecServiceAreaL.layerId,elecServiceAreaL);
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~Sanitation Layers~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  var fieldEventsL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/0",
	title: "Field Events"
  });
  crtPopUpTemplate(fieldEventsL.url, fieldEventsL.layerId,fieldEventsL);
  var facilitiesL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/1",
	title: "Facilities"
  });
  crtPopUpTemplate(facilitiesL.url, facilitiesL.layerId,facilitiesL);
  var manholesL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/2",
	title: "Manholes"
  });
  crtPopUpTemplate(manholesL.url, manholesL.layerId,manholesL);
  var JOSPipesL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/3",
	title: "JOS Pipes"
  });
  crtPopUpTemplate(JOSPipesL.url, JOSPipesL.layerId,JOSPipesL);
  var PipesL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/4",
	title: "Pipes"
  });
  crtPopUpTemplate(PipesL.url, PipesL.layerId,PipesL);
  var DistBoundsL = new FeatureLayer({
    url: "http://services6.arcgis.com/mfr5GsRh8UYwsJgO/arcgis/rest/services/LACSD_SewerSystem/FeatureServer/5",
	title: "District Boundaries"
  });
  crtPopUpTemplate(DistBoundsL.url, DistBoundsL.layerId,DistBoundsL);


  var OpsMapL = new FeatureLayer({
    url: "http://dpw.gis.lacounty.gov/dpw/rest/services/SMD_Sewer/MapServer/5",
    visible: false
  });
  crtPopUpTemplate(OpsMapL.url, OpsMapL.layerId,OpsMapL);
  var LAcity_SewerWyeL = new FeatureLayer({
    url: "http://maps.lacity.org/lahub/rest/services/Maps_and_Indices/MapServer/3",
    visible: false
  });
  crtPopUpTemplate(LAcity_SewerWyeL.url, LAcity_SewerWyeL.layerId,LAcity_SewerWyeL);

  //All part of sewer Info - la city

  var LACity_SewerInfo = new MapImageLayer({
	url: "http://maps.lacity.org/lahub/rest/services/Sewer_Information/MapServer",
	title: "LA City Sewer Information",
    visible: false
  });

  LACity_SewerInfo.watch("loaded", function() {
	  for (i=0;i<LACity_SewerInfo.allSublayers.length;i++) {
		var this_layer = LACity_SewerInfo.allSublayers.items[i];
		// if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
		if (this_layer.sublayers == null) {
		  crtPopUpTemplate(LACity_SewerInfo.url, this_layer.id,this_layer);
		}
		else {
			//console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
		}
	  }
  });

  /*
  Sewer: County of LA - DPW
  */
  var LACounty_SewerInfo = new MapImageLayer({
	url: "http://dpw.gis.lacounty.gov/dpw/rest/services/SMD_Sewer/MapServer",
	title: "LA County Sewer Information",

  });

  LACounty_SewerInfo.watch("loaded", function() {
	for (i=0;i<LACounty_SewerInfo.allSublayers.length;i++) {
		var this_layer = LACounty_SewerInfo.allSublayers.items[i];
		// if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
		if (this_layer.sublayers == null) {
		  crtPopUpTemplate(LACounty_SewerInfo.url, this_layer.id,this_layer);
		}
		else {
			//console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
		}
	}
  });

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MWD Data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  var mwdData = new MapImageLayer({
	 url: "https://sv07gdchprtl.ct.dot.ca.gov/server/rest/services/MWD_Data_Final_MIL1/MapServer",
     title: "Metropolitan Water District"
  });
  
  let realTitles = ["Structures", "EDMS Drawings", "Flow Meters", "Station Labels", "Waterlines"];
  let properCount = [4,3,2,1,0];
  
  function crtPopUpTemplate2(basicURL, layerID, layerVName) {
    var url = basicURL+'/'+layerID.toString()+'?f=json';
    esriRequest(url, {responseType: "json"}).
      then(function(response){
        Alldata = response.data;
        var titleLayer = Alldata.name;
		
        if (titleLayer.includes('_') == true) {
            resultIf = titleLayer.replace(/_/g," ");
        } else {
          resultIf = titleLayer;
        }
        template1 = {
        title: realTitles[layerID],
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "PopupInfo",
                label: "More Information"
            }]
        }]

        };
        layerVName.popupTemplate=template1;
      });
  }
  
  
  mwdData.watch("loaded", function() {
    for (i=0;i<mwdData.allSublayers.items.length;i++) {
        var this_layer = mwdData.allSublayers.items[i];
		console.log(i);
		console.log(this_layer.title);
		this_layer.title = realTitles[properCount[i]];
		this_layer.visible = false;
		
        // if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
        if (this_layer.title != "Waterlines") {
          crtPopUpTemplate2(mwdData.url,properCount[i],this_layer);
        } 
		else if (this_layer.title == "Waterlines") {
			crtPopUpTemplate(mwdData.url,properCount[i],this_layer);
		}
        else {
            //console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
        }
    }
  });
  
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Storm Drains~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  var reachesD7 = new MapImageLayer({
      url:"http://svgcdeawebgis4.ct.dot.ca.gov/dea_gis/rest/services/Stormwater/BaseMap_ReceivingWaters/MapServer",
      visible: true,
      title: "Caltrans Stormwater GIS Library",
  });

  reachesD7.watch("loaded", function() {
	for (i=0;i<reachesD7.allSublayers.length;i++) {
		var this_layer = reachesD7.allSublayers.items[i];
		// if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
		if (this_layer.sublayers == null) {
		  crtPopUpTemplate(reachesD7.url, this_layer.id,this_layer);
		}
		else {
			//console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
		}
		if (this_layer.title === "TMDL Boundaries Shaded") {
            this_layer.visible = false;
        }
	}
  });
  
  // problem with the symbology
  var fldMaintAreasL = new FeatureLayer({
    url: "http://dpw.gis.lacounty.gov/dpw/rest/services/sds_mobile/MapServer/39",
    id: "floodAreas",
    title: "Flood Maintenance Areas",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(fldMaintAreasL.url, fldMaintAreasL.layerId,fldMaintAreasL);
  var stormPipesL = new FeatureLayer({
    url: "https://maps.lacity.org/lahub/rest/services/Stormwater_Information/MapServer/10",
    id: "stormPipes",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(stormPipesL.url, stormPipesL.layerId,stormPipesL);
  var FireHydrantsL = new FeatureLayer({
    url: "http://services1.arcgis.com/p84PN4WZvOWzi2j2/arcgis/rest/services/FireHydrants/FeatureServer/0",
    id: "FireHydrants",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(FireHydrantsL.url, FireHydrantsL.layerId,FireHydrantsL);
  var CA_aquaductsL = new FeatureLayer({
    url: "http://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/California_Aqueducts/FeatureServer/0",
    id: "aquaducts",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(CA_aquaductsL.url, CA_aquaductsL.layerId,CA_aquaductsL);
  var SDInletsL = new FeatureLayer({
    url: "http://maps.lacity.org/lahub/rest/services/Stormwater_Information/MapServer/8",
    id: "StormDrainInlets",
    opacity: 0.9,
    visible: false
  });
  crtPopUpTemplate(SDInletsL.url, SDInletsL.layerId,SDInletsL);
  /*
  Last two layers are stand alone map servers with their own sublayers and layer groups
  */
  var LACountyStorms = new MapImageLayer({
	url: "http://dpw.gis.lacounty.gov/dpw/rest/services/sds_mobile/MapServer",
	title: "LA County Storm Drain Systems"
  });
  LACountyStorms.watch("loaded", function() {
	for (i=0;i<LACountyStorms.allSublayers.length;i++) {
		var this_layer = LACountyStorms.allSublayers.items[i];
		//this_layer.visible = false;
		// if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
		if (this_layer.sublayers == null) {
		  crtPopUpTemplate(LACountyStorms.url, this_layer.id,this_layer);
		}
		else {
			//console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
		}
	}
  });


  var CaltransStorms = new MapImageLayer({
	url: "http://sv07arcadvdev1:6080/arcgis/rest/services/Stormwater/MapServer",
	title: "Caltrans Storm Drain Systems",
    visible: false
  });


  CaltransStorms.watch("loaded", function() {
	for (i=0;i<CaltransStorms.allSublayers.length;i++) {
		var this_layer = CaltransStorms.allSublayers.items[i];
		// if the layer itself has no sublayers, then add the popup template, otherwise we will have to extract the sublayer's sublayer;
		if (this_layer.sublayers == null) {
		  crtPopUpTemplate(CaltransStorms.url, this_layer.id,this_layer);
		}
		else {
			//console.log("This layer has a sublayer");
			//In production mode, remove console.logs 
		}
	}
  });

  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */

  var binaryDisplay = {
  type: "unique-value",  // autocasts as new UniqueValueRenderer()
  field: "DIST",
  defaultSymbol: { type: "simple-fill", color: [0,0,0,0.7]},  // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: [{
    // All features with value of "7" will be clear
    value: "7",
    symbol: {
      type: "simple-fill",  // autocasts as new SimpleFillSymbol()
      color: [255,255,255,0],
	  outline: {color:"white",width:0}
    }
   }
  ]};

  var ct_districts = new FeatureLayer({
    url: "http://services2.arcgis.com/hvBNq5JdIeoqdAq9/arcgis/rest/services/CaltransDistricts/FeatureServer/0",
	title: "District 7",
    visible: true,
    renderer: binaryDisplay,
	legendEnabled: false
  });

  var postmilesurveyL = new FeatureLayer({
    url: "http://services1.arcgis.com/8CpMUd3fdw6aXef7/arcgis/rest/services/SURV_D07_PM/FeatureServer/0",
    id: "DS7 Survey",
	title: "Survey Postmile",
    visible: false
  });
  crtPopUpTemplate(postmilesurveyL.url, postmilesurveyL.layerId,postmilesurveyL);

  /*
  Group Layers
  */
  var group1_Wells = new GroupLayer({
    title: "Class II Injection Wells",
    visible: false,
    visibilityMode: "independent",
    layers: [inj_wdwL, inj_gdwL, inj_pmwL, inj_awL]
  });
  var group2_Wells = new GroupLayer({
    title: "Other Wells",
    visible: false,
    visibilityMode: "independent",
    layers: [inj_sfL, inj_wfL, gasStrgWL, stimWL, ogProdWL]
  });

  var AllWellsGroup = new GroupLayer({
    title: "Wells",
    visible: false,
    visibilityMode: "independent",
    layers: [group1_Wells, group2_Wells]
  });
  var AllStationsGroup = new GroupLayer({
    title: "Stations",
    visible: true,
    visibilityMode: "independent",
    layers: [GensL, natgasStationsL, powplantL, ngpsL]
  });
  var AllPipesGroup = new GroupLayer({
    title: "Pipelines",
    visible: true,
    visibilityMode: "independent",
    layers: [natGasL, offshoreOL, inundatedPipesL, natgasPipesDL]
  });

  var LACSD_SewerSystem = new GroupLayer({
    title: "LA County Sanitation Districts Sewer System",
    visible: false,
    visibilityMode: "independent",
    layers: [fieldEventsL, facilitiesL, manholesL, JOSPipesL, PipesL, DistBoundsL]
  });
  var AllStormDrains = new GroupLayer({
    title: "Storm Drains",
    visible: false,
    visibilityMode: "independent",
    layers: [fldMaintAreasL, stormPipesL, FireHydrantsL, CA_aquaductsL, SDInletsL, LACountyStorms, CaltransStorms, reachesD7]
  });
  var AllSanitation = new GroupLayer({
    title: "Sanitation",
    visible: false,
    visibilityMode: "independent",
    layers: [LACSD_SewerSystem, OpsMapL, LAcity_SewerWyeL, LACounty_SewerInfo, LACity_SewerInfo]
  });
  
  /*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~Utilities Groups
  //     1: Gas and Oil
  var majorUtilGrp1 = new GroupLayer({
    title: "Gas and Oil",
    visible: true,
    visibilityMode: "independent",
    layers: [AllPipesGroup, AllStationsGroup, AllWellsGroup]
  });
  //     2: Electric
  var majorUtilGrp2 = new GroupLayer({
    title: "Electric",
    visible: false,
    visibilityMode: "independent",
    layers: [substationsL, transLinesL, elecServiceAreaL]
  });
  
  //     4. Water
  var majorUtilGrp3 = new GroupLayer({
	title: "Water",
	visible: false,
	visibilityMode: "independent",
	layers: [mwdData]
	
  });
  // 	5. Sanitation
  var majorUtilGrp4 = new GroupLayer({
	title: "Sanitation",
	visible: false,
	visibilityMode: "independent",
	layers: [LACSD_SewerSystem, OpsMapL, LAcity_SewerWyeL, LACounty_SewerInfo, LACity_SewerInfo]
	
  });
  //	6. Storm Drains
  var majorUtilGrp5 = new GroupLayer({
	title: "Storm Drains",
	visible: false,
	visibilityMode: "independent",
	layers: [fldMaintAreasL, stormPipesL, FireHydrantsL, CA_aquaductsL, SDInletsL, LACountyStorms, CaltransStorms, reachesD7]
	
  });

//map constructor
  var map = new Map({
    basemap: "topo",
  });
  ct_districts.labelsVisible = false;
  map.add(postmilesurveyL)
  map.add(majorUtilGrp1)
  map.add(majorUtilGrp2)
  map.add(majorUtilGrp3)
  map.add(majorUtilGrp4)
  map.add(majorUtilGrp5)
  map.add(ct_districts)
	

  var view = new MapView({
    container: "viewDiv",
    map: map,
    scale: 700000,
    center: [-118.2457856,34.0521383]
  });

  view.ui.add(document.getElementById('streetv'));

  var homeButton = new Home({
    view: view
  });
  view.ui.add(homeButton, "top-left")

  //create actions in the layerlist.
  function defineActions(event) {
    var item = event.item;
    if (item.layer.type != 'group') {
        item.actionsSections = [[
          {
            title: "Layer information",
            className: "esri-icon-description",
            id: "information"
          }]
        ];
    }
  }

    //add layerList, with listItemreatedFunction property
    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: defineActions

    });

    //add event listener that fires each time an action is triggered
    layerList.on("trigger-action", function(event) {
        // Capture the action id.
        var id = event.action.id;
        console.log(event)

        if (id === "full-extent") {
            console.log(event.item);
            view.goTo(event.item.layer.fullExtent);

        } else if (id === "information") {
          //check the type of layer - if it's a feature service, then can add the layer id at the end of the url
          //if a map image service, then just take the url of the layer...but make sure it's not the top level map service url
          // if the information action is triggered, then
          // open the item details page of the service layer
          if (event.item.layer.title === "Metropolitan Water District") {
              window.open("http://www.mwdh2o.com/");
          } else if (event.item.layer.title === "Caltrans Stormwater GIS Library") {
              window.open("http://svgcdeawebgis4.dot.ca.gov/Stormwater_GIS_Library/");
          } else {
			  window.open(event.item.layer.url); 
		  }

        }
    });
    // Add widget to the top right corner of the view
    view.ui.add(layerList,"top-right");
    layerListExpand = new Expand({
      expandIconClass: "esri-icon-layers",
      expandTooltip: "Expand Layer List",
      view: view,
      content: layerList.domNode
    });
    view.ui.add(layerListExpand, "top-right");

  view.when(function() {
	view.on("pointer-move",showCoordinates);  
  });
  
  function showCoordinates(evt) {
	var point = view.toMap({x:evt.x,y:evt.y});
	var mp = webMercatorUtils.webMercatorToGeographic(point);
	dom.byId("info").innerHTML = mp.y.toFixed(4) + ", "+mp.x.toFixed(4);
  }

  var legend = new Legend({
    view: view
  });
  view.ui.add(legend,"top-left");

  legendExpand = new Expand({
	expandIconClass: "esri-icon-layer-list",
    expandTooltip: "Expand Legend",
	view: view,
	content: legend.domNode
  });
  view.ui.add(legendExpand,"top-left");

  var printButton = new Print({
	view: view,
	printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    templateOptions: {
	  legendEnabled: true
	}
  });
  view.ui.add(printButton, "top-left");
  console.log(printButton.templateOptions.legendEnabled);
  console.log(printButton);

  printButtonExpand = new Expand({
    expandIconClass:"esri-icon-printer",
    expandTooltip: "Expand Printing Options",
	view: view,
	content: printButton.domNode
  });
  view.ui.add(printButtonExpand, "top-left");



  var searchbar = new Search({
	view: view,
	//allPlaceholder: "Address/Location or County, Route, PM",
	sources: [{
	  featureLayer:{
		url: postmilesurveyL.url,
		outFields: ["*"],
		popupTemplate: {
		  title: "{Cnty} County, Route {Route} and Postmile {PMLabel}"
		},
		overwriteActions: true
	  },
	  searchFields: ["DYNSEGPM"],
	  suggestionTemplate: "{Cnty} Route: {Route} PM: {PMLabel}",
	  placeholder: "Cty, Rt and Pm (ie: LA 101 0.4)", //was: example: LA 101 0.4
	  exactMatch: false,
	  name: "County, Route, and PM"
	}],
	searchAllEnabled: false
  });
  view.ui.add(searchbar)
  
  var basemapToggle = new BasemapToggle({
	view: view,
	nextBasemap: "satellite"
  });
  
  view.ui.add(basemapToggle, "top-left");
  
  
  //add special labeling for the Postmile data
  var labelClass = new LabelClass({
	  
	labelExpressionInfo: {
	  expression: "$feature.DYNSEGPM" // Text for labels comes from cty route and PM field	
	},
	symbol: {
	  type: "text", // autocasts as new TextSymbol3DLayer()
	  color: 'dodgerblue',
	  haloColor: "white",
	  haloSize: "2px",
	  font: {
		family: "sans-serif",
		weight:	"bold",
		size: 10
	  }
	}
  });
  console.log(labelClass);
  postmilesurveyL.labelsVisible = true;
  console.log(postmilesurveyL);
  postmilesurveyL.labelingInfo = [ labelClass ];
  

  //Write a function that handles searching through layer list
  function siftLayers(oldGLayArray, keepFLayArray, keepTLayArray,keepMILayarray) {
	console.log(oldGLayArray);
	groupLList = [];
	for (i=0;i<oldGLayArray.length;i++) {
		console.log(oldGLayArray[0].layers.length, i);
		  for (j=0; j<oldGLayArray[i].layers.length;j++) {
              console.log(oldGLayArray[i].layers.items[j].title, oldGLayArray[i].layers.items[j].type, oldGLayArray[i].layers.items[j].visible);
			  if ( (oldGLayArray[i].layers.items[j].visible === true) && (oldGLayArray[i].layers.items[j].type === "group") ) {
				groupLList.push(oldGLayArray[i].layers.items[j]);
				console.log('This is a group layer');
			  }
			  else if ( (oldGLayArray[i].layers.items[j].visible === true) && (oldGLayArray[i].layers.items[j].type === "feature") ) {
				keepFLayArray.push(oldGLayArray[i].layers.items[j]);
                console.log('This is a feature layer');
			  }
              //tile layer
			  else if ( (oldGLayArray[i].layers.items[j].visible === true) && (oldGLayArray[i].layers.items[j].type === "tile") ) {
		        keepTLayArray.push(oldGLayArray[i].layers.items[j]);
                console.log('This is a another type of layer');
			  }
              else if ( (oldGLayArray[i].layers.items[j].visible === true) && (oldGLayArray[i].layers.items[j].type === "map-image") ) {
		        keepMILayarray.push(oldGLayArray[i].layers.items[j]);
                console.log('This is a map image layer');
			  }
			  else {
				console.log("Nothing is visible");
			  }
		  }
	  }

	return [keepFLayArray, keepTLayArray, groupLList, keepMILayarray];
  }

  proj4.defs([
  [
    "EPSG:4326",
    "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"],
  [
    "EPSG:4269",
    "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"],
  [
    "EPSG:3857",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],
  [
    "EPSG:26911",
	"+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
  [
	"EPSG:26945",
	"+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000 +y_0=500000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"],
  [
    "EPSG:2874",
	"+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +to_meter=0.3048006096012192 +no_defs"],
  [
    "EPSG:3310",
	"+proj=aea +lat_1=34 +lat_2=40.5 +lat_0=0 +lon_0=-120 +x_0=0 +y_0=-4000000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"],
  [
    "EPSG:2229",
	"+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs"]
  ]);

  //Download data layer to view extent: start with CA Natural Gas pipelines:
  view.ui.add(document.getElementById('dlButton'));
  //once the view loads...then define extent
  $("#dlButton").click(function () {
	ga('send', 'event', 'Button', 'Click','dlButton')
    view.when(function(){
      xmin=view.extent.xmin;
	  ymin=view.extent.ymin;
	  xmax=view.extent.xmax;
	  ymax=view.extent.ymax;
	  groupLList = [];
	  featureLayerList = [];
	  tileList = [];
      mapImageList = [];

	  for (i=0;i<view.map.layers.length;i++) {
		  //console.log(i);
		  if ( (view.map.layers.items[i].visible === true) && (view.map.layers.items[i].type === "group") ) {
			groupLList.push(view.map.layers.items[i]);
			console.log(view.map.layers.items[i].title, view.map.layers.items[i].type);
	      }
		  else if ( (view.map.layers.items[i].visible === true) && (view.map.layers.items[i].type === "feature") ) {
		    featureLayerList.push(view.map.layers.items[i]);
		  }
          //In the first layer list that is exposed, the highest hierarchy, the only types of layers are group and features
		  // else if ( (view.map.layers.items[i].visible === true) && (view.map.layers.items[i].type === "tile") ) {
		  //   otherTypeList.push(view.map.layers.items[i]);
		  // }
		  else {
			console.log("Nothing is visible for " +view.map.layers.items[i].title);
		  }
	  }
      console.log(groupLList)
      console.log(featureLayerList)
	  let arr1;
	  let arr2;
	  let arr3;
	  //check out if there are any more visible layers in the visible group layers
	  var AllOut = siftLayers(groupLList, featureLayerList, tileList, mapImageList);
	  arr1 = AllOut[0]; //feature layers
	  arr2 = AllOut[1]; //tile layers
	  arr3 = AllOut[2]; //group list
      arr4 = AllOut[3]; //map-image list

	  //I need to check the groupLayers one more time - there is one more hierarchical layer that exists...
	  var AllOut = siftLayers(arr3, arr1, arr2, arr4);
	  arr1 = AllOut[0]; //feature layers
	  arr2 = AllOut[1]; //tile layers
	  arr3 = AllOut[2]; //group list
      arr4 = AllOut[3]; //map image layer list

	  //Final Check...Only for: Gas and Oil --> Pipelines --> LA Nat Gas Pipelines Inundated
	  var AllOut = siftLayers(arr3, arr1, arr2, arr4);
	  arr1 = AllOut[0]; //feature layers
	  arr2 = AllOut[1]; //tile layers
	  arr3 = AllOut[2]; //group list
      arr4 = AllOut[3]; // map image layer list
	  
	  //Final FINAL Check...Only for: bottom most layers in Storm Drains and Sanitation
	  var AllOut = siftLayers(arr3, arr1, arr2, arr4);
	  arr1 = AllOut[0]; //feature layers
	  arr2 = AllOut[1]; //tile layers
	  arr3 = AllOut[2]; //group list
      arr4 = AllOut[3]; // map image layer list
      for (i=0; i<arr1.length;i++) {
          console.log(arr1[i].title);
      }
      for (i=0; i<arr4.length;i++) {
          console.log(arr4[i].title);
      }


      //Go through the map-image layers and extract the information necessary to download the data
      //for a map-image layer, the stored object in the array contains a allSublayers property which contains all the sublayers in that map-image
      //So I can just loop through those layers, and if they're visible and if the sublayers property is null, then can download the data.
      // 1.
      let mapimageL = [];
      let specLayer = [];
      for (i=0;i<arr4.length;i++) {
        mapimageL.push(arr4[i].allSublayers);
        let inSR = arr4[i].spatialReference.latestWkid;
        console.log(arr4[i].title, inSR)
        console.log(mapimageL)
        for (j=0;j<mapimageL[i].items.length;j++) {
          //check to see if each item in the allSublayers object is visible and that it's own sublayers field is null (not an object)
          if ( (mapimageL[i].items[j].visible === true) && (mapimageL[i].items[j].sublayers === null) && (mapimageL[i].items[j].parent.visible === true)) {
            console.log(mapimageL[i].items[j].title + ' is visible and should be downloaded')
            specLayer.push(mapimageL[i].items[j])
            console.log(inSR);
            //extract the url, layer id, and title to begin the downloading process.
            if (inSR != 3857) {
                console.log('EPSG:'+inSR.toString());
                var outproj = proj4.defs('EPSG:'+inSR.toString());
                var inproj = proj4.defs('EPSG:3857');
                env_LL = proj4(inproj,outproj,[xmin,ymin]); //lower left corner of the envelope
                env_UR = proj4(inproj,outproj,[xmax,ymax]); //upper right corner of the envelope
                console.log(xmin,ymin,xmax,ymax);
                console.log(env_LL,env_UR);
                var url2 = mapimageL[i].items[j].url + '/query/?f=geojson&geometryType=esriGeometryEnvelope&geometry='+env_LL[0]+','+env_LL[1]+','+env_UR[0]+','+env_UR[1]+'&returnGeometry=true&outFields=*';

            } else {
                //don't need to project envelope extent. Data is already in 3857.
                var url2 = mapimageL[i].items[j].url + '/query/?f=geojson&geometryType=esriGeometryEnvelope&geometry='+xmin+','+ymin+','+xmax+','+ymax+'&returnGeometry=true&outFields=*';
            }
            console.log(mapimageL[i].items[j].title);
            console.log(url2);

            downloadGeoJson(url2,mapimageL[i].items[j].title);
          }

        }

      }


      // 2.
	  //go through feature layers and download the data;
	  for (i=0; i<arr1.length;i++){
		var featLayer = arr1[i];
        console.log(arr1);
		if ( (featLayer.title === 'District 7') || (featLayer.title === 'Survey Postmile')){
			console.log('Skipping this layer...unnecessary');
		} else if (featLayer.url===null) {
			console.log('Skipping this layer...no url (probably uploaded layer)');
	    } else {
			//var url2 = featureLayerList[i].url+'/'+featureLayerList[i].layerId.toString() + '/query/?f=geojson&geometryType=esriGeometryEnvelope&geometry='+xmin+','+ymin+','+xmax+','+ymax+'&returnGeometry=true&outFields=*';
			//I don't think I can transform the data and query it by the envelope in one request. so taking away the parameter outSR=3857.
			//Transform the envelope extent to native
			//include the out spatial reference because the view is in this spatial reference. That way when I query by the extent of the view, the spatial references match. When I download the data are they all going to be in that output spatial reference (3857)? The native spatial reference of the Flood Maintenance areas, for example, is 102645 (2229) (CA State Plane Zone 5).
			console.log(featLayer.spatialReference.wkid);
			var inSR = featLayer.spatialReference.latestWkid;
            console.log(featureLayerList[i].url)
			//if the spatial ref of the layer is not 3857 (or 102100), then project the envelope extent to the native coor system of the dataset.

			if (inSR != 3857) {
				console.log('EPSG:'+inSR.toString());
				var outproj = proj4.defs('EPSG:'+inSR.toString());
				var inproj = proj4.defs('EPSG:3857');
				env_LL = proj4(inproj,outproj,[xmin,ymin]); //lower left corner of the envelope
				env_UR = proj4(inproj,outproj,[xmax,ymax]); //upper right corner of the envelope
				console.log(xmin,ymin,xmax,ymax);
				console.log(env_LL,env_UR);
				var url2 = featureLayerList[i].url+'/'+featureLayerList[i].layerId.toString() + '/query/?f=geojson&geometryType=esriGeometryEnvelope&geometry='+env_LL[0]+','+env_LL[1]+','+env_UR[0]+','+env_UR[1]+'&returnGeometry=true&outFields=*';

			} else {
				//don't need to project envelope extent. Data is already in 3857.
				var url2 = featureLayerList[i].url+'/'+featureLayerList[i].layerId.toString() + '/query/?f=geojson&geometryType=esriGeometryEnvelope&geometry='+xmin+','+ymin+','+xmax+','+ymax+'&returnGeometry=true&outFields=*';
			}
            console.log(featLayer.title);
            console.log(url2);
            // throw ' ';
			downloadGeoJson(url2,featLayer.title);
			console.log('Finished downloading one feature layer');
		}
	  }

  });
  });


  function downloadGeoJson(layerURL,layerTitle) {

    	esriRequest(layerURL,{responseType: 'geojson'}).then(function(results) {
            console.log(results);
            var newGJ = {};
    		var geoJsonFeats = {};
            geoJsonFeats = JSON.parse(results.data);
    		newGJ = JSON.parse(results.data); // now the data is a JS object
			console.log(geJsonFeats.features.length);
			throw '';
			
    		// if features exist in the map extent, then save that data as a shapefile
    		saveGJ_Shp(geoJsonFeats,newGJ,layerTitle);
        })
        .catch(function(error) {
            // console.log(error);

            //assume that the error is because i'm trying to pull geojson from the service, but it only allows json as an output format
            //find f=geojson,replace with f=JSON
            newUrl = layerURL.replace('f=geojson','f=json');
            console.log('Is a JSON download');
            esriRequest(newUrl,{responseType: 'json'}).then(function(results) {
                var newGJ = {};
        		var convGJ = {};
                // convert json to geojson!
                convGJ = convertGJ(results.data);
                newGJ = convGJ;

                // Now go through with conversion to shapefile. will be more simple than for typical case above
                // because all of these layers (that fail for a geojson output format) are in 3857 spatial reference frame
                saveGJ_Shp(convGJ,newGJ,layerTitle);

            });
        });
  }


  function convertGJ(jsonObj) {
      console.log(jsonObj, jsonObj.geometryType);
      //console.log(JSON.stringify(jsonObj));
      var FeatureCollection = {
        type: "FeatureCollection",
        crs: {
            type: "name",
            properties: {
                name: "EPSG:"+jsonObj.spatialReference.latestWkid.toString()
            }
        },
        features: []
    };
      //
      console.log(jsonObj.features[0]);
      for (i = 0; i < jsonObj.features.length; i++) {
        var feature = Terraformer.ArcGIS.parse(jsonObj.features[i]);
        feature.id = i;
        FeatureCollection.features.push(feature)
      };
      // console.log(FeatureCollection);
      return FeatureCollection
  }

  /*
    This function will take in a GeoJSON object and change the projection into State Plane Coordinate System Zone 5, and finally use the shpwrite tool to convert and download it as a shapefile
  */
  function saveGJ_Shp(GJObj,newGJObj,layname) {
      if (GJObj.features.length != 0) {
          console.log(layname);
          var fname = layname;
          fname = fname.replace(/\s/g,"_");
          let inputProj;
          let outputProj;

          //if the feature type is a point, then we need to be sure to grab both coordinates
          if (GJObj.features[0].geometry.type === "Point") {
              console.log(GJObj.features[0].geometry.type);
              for (i=0;i<GJObj.features.length;i++) {
                  var coords = GJObj.features[i].geometry.coordinates;
                  console.log('inside point type');
                  //console.log(coords);
                  inputProj = proj4.defs(newGJObj.crs.properties.name);
                  outputProj = proj4.defs('EPSG:2874');
                  outCoor = [];
                  outCoor = proj4(inputProj, outputProj, newGJObj.features[i].geometry.coordinates);
                  //console.log(outCoor);
                  newGJObj.features[i].geometry.coordinates = outCoor;
                  //console.log(newGJ)
              }
              //convert every coordinate to the new coordinate system
          } else if ( (GJObj.features[0].geometry.type === "LineString") || (GJObj.features[0].geometry.type === "MultiLineString")) {
              console.log(GJObj.features[0].geometry.type);
              for (i=0;i<GJObj.features.length;i++) {
                  var coords = GJObj.features[i].geometry.coordinates;
                  //console.log(i.toString() +': inside type ' + geoJsonFeats.features[i].geometry.type);

                  if (GJObj.features[i].geometry.type === "LineString") {
                      //if the feature type is a linestring then the following set up works:
                      for (j=0;j<GJObj.features[i].geometry.coordinates.length;j++) {
                        inputProj = proj4.defs(newGJObj.crs.properties.name);
                        outputProj = proj4.defs('EPSG:2874');
                        // console.log(inputProj);
                        // console.log(outputProj);
                        // console.log(newGJ.features[i].geometry.coordinates[j]);
                        newGJObj.features[i].geometry.coordinates[j] = proj4(inputProj, outputProj, newGJObj.features[i].geometry.coordinates[j]);
                        // console.log('number of cooordinates for line point is ' + newGJ.features[i].geometry.coordinates[j].length);

                        if (newGJObj.features[i].geometry.coordinates[j].length === 3) {
                            newGJObj.features[i].geometry.coordinates[j].pop(); //the last array element of null is not a proper format for the shapefile (or even geojson). Need
                        }
                      }
                  } else if (GJObj.features[i].geometry.type === "MultiLineString") {
                      console.log(GJObj.features[i].geometry.coordinates);
                      console.log(GJObj.features[i].geometry.coordinates.length);
                      //configure for multilinestring:
                      for (k=0;k<GJObj.features[i].geometry.coordinates.length;k++) {
                          var single_linePart = GJObj.features[i].geometry.coordinates[k];
                          console.log(single_linePart);
                          for (j=0;j<GJObj.features[i].geometry.coordinates[k].length;j++) {
                            inputProj = proj4.defs(newGJObj.crs.properties.name);
                            outputProj = proj4.defs('EPSG:2874');
                            newGJObj.features[i].geometry.coordinates[k][j] = proj4(inputProj, outputProj, newGJObj.features[i].geometry.coordinates[k][j]);

                            if (newGJObj.features[i].geometry.coordinates[k][j].length === 3) {
                                newGJObj.features[i].geometry.coordinates[k][j].pop(); //the last array element of null is not a proper format for the shapefile (or even geojson). Need
                            }
                          }
                      }
                  }
              }
          } else if ( (GJObj.features[0].geometry.type === "Polygon") || (GJObj.features[0].geometry.type === "MultiPolygon")) {
              console.log(GJObj);
              for (i=0;i<GJObj.features.length;i++) {
                  var coords = GJObj.features[i].geometry.coordinates;
                  if (GJObj.features[i].geometry.type ==='Polygon') {
                      for (j=0;j<GJObj.features[i].geometry.coordinates[0].length;j++) {
                        inputProj = proj4.defs(newGJObj.crs.properties.name);
                        outputProj = proj4.defs('EPSG:2874');
                        //console.log(newGJ.features[i].geometry.coordinates[j][0]);
                        newGJObj.features[i].geometry.coordinates[0][j] = proj4(inputProj, outputProj, newGJObj.features[i].geometry.coordinates[0][j]);
                      }
                  } else if (GJObj.features[i].geometry.type ==='MultiPolygon') {
                      console.log(GJObj.features[i].geometry.coordinates.length);
                      for (j=0;j<GJObj.features[i].geometry.coordinates.length;j++) {
                          for (k=0;k<GJObj.features[i].geometry.coordinates[j][0].length;k++) {
                              inputProj = proj4.defs(newGJObj.crs.properties.name);
                              outputProj = proj4.defs('EPSG:2874');
                              //console.log(newGJ.features[i].geometry.coordinates[j][0]);
                              newGJObj.features[i].geometry.coordinates[j][0][k] = proj4(inputProj, outputProj, newGJObj.features[i].geometry.coordinates[j][0][k]);
                          }
                      }
                  }
              }
          } else {
              console.log('type does not match');
          }

          //finally, the new projected geojson should have the epsg 2874 as the projection
          newGJObj.crs.properties.name = 'EPSG:2874';

          console.log(newGJObj);
          console.log(JSON.stringify(newGJObj));

          var options = {
              folder: fname.toString(),
              types: {
                point: 'points',
                polygon: 'polygons',
                line: 'lines'
              }
          };

          shpwrite.download(newGJObj,options);

      } else {
          //window.alert(layname + " does not contain any features in the current extent of the map.")
          console.log(layname + " does not contain any features.");
      }
  }

  view.ui.add(document.getElementById('upButton'));
  const fileSelect = document.getElementById("upButton");
  fileElem = document.getElementById("fileElem");

  fileSelect.addEventListener("click", function (e) {
	  ga('send', 'event', 'Button', 'Click','upButton')
      if (fileElem) {
          fileElem.click();
      }
    }, false);

  $('#fileElem').on('change', handleFiles);
  function handleFiles() {
    const file = this.files[0]; /* now you can work with the file list */
    console.log(file,typeof(file));
    thisFilename = file.name.slice(0,-4);
    const fileAsBlob = new Blob([file]);

    const reader = new FileReader();
    let data;
    reader.onloadend = function() {
         data = reader.result;
         console.log(data);
         //this works!
         shp(data).then(function(geojson){
             var GJArcObj = Terraformer.ArcGIS.convert(geojson);  //idAttribute="FID"
             console.log(GJArcObj);

             //Check whether the shapefile holds points, polylines, or polygons
             if (GJArcObj[0].geometry.x !== undefined) {
                 var geomType = 'point';
             } else if (GJArcObj[0].geometry.paths !== undefined) {
                var geomType = 'polyline';
             } else if (GJArcObj[0].geometry.rings !== undefined) {
                var geomType = 'polygon';
             }
             var graphics1 = [];

             GJArcObj.forEach(function(gr,i) {
               var newGraphic = {};
               if (geomType === 'point') {
                 newGraphic.geometry = {type: geomType, x: gr.geometry.x, y: gr.geometry.y};
               } else if (geomType === 'polyline') {
                 newGraphic.geometry = {type: geomType, paths: gr.geometry.paths};
               } else if (geomType === 'polygon') {
                 newGraphic.geometry = {type: geomType, rings: gr.geometry.rings};
               }
               newGraphic.attributes = gr.attributes;
               newGraphic.attributes['newOID'] = i;
               graphics1.push(newGraphic);
             });
			 
			 let r;
			 let g;
			 let b;
			 
			 r = Math.floor(Math.random()*250);
			 g = Math.floor(Math.random()*250);
			 b = Math.floor(Math.random()*250);
			 picker = Math.floor(Math.random()*5);
			 console.log(picker)
			 c_choices = ['red','black','blue','green','purple']
			 thisColor = c_choices[picker]
			 
             //create renderers for point, polyline, polygons
             if (geomType === 'point') {
                 var symbol = {
                     type: "simple-marker",
                     color: thisColor,
                     size: 6,
                     outline: {  // autocasts as new SimpleLineSymbol()
                       width: 0.5,
                       color: "white"
                     }
                 };
             } else if (geomType === 'polyline') {
                 var symbol = {
                     type: "simple-line",
                     color: thisColor,
                     width: 2
                 };
             } else if (geomType === 'polygon') {
                 var symbol = {
                     type: "simple-fill",
                     color: thisColor,
                 };
             }
             var simpleRenderer = {
                 type: "simple",  // autocasts as new SimpleRenderer()
                 symbol: symbol
              };

              //create a fields array with the name, alias (necessary?) and type
              //take attribute list of first feature...
              myfields = [];
              const allAtts = Object.keys(GJArcObj[0].attributes);

              for (i=0;i<(allAtts.length-1);i++) {
                  console.log(GJArcObj[0].attributes[allAtts[i]]);
                  typeOfValue = typeof(GJArcObj[0].attributes[allAtts[i]]);
                  if (typeOfValue === 'number') {
                      typeToUse = 'double';
                  } else if (typeOfValue === 'string') {
                      typeToUse = 'string';
                  }
                  fieldObj = {
                      name: allAtts[i],
                      type: typeToUse
                  };
                  // if (fieldObj.name === 'OBJECTID') {
                  //   fieldObj.type = 'oid';
                  // }
                  myfields.push(fieldObj);
              }

              //add newObjectID to list of fieldInfos
              myfields.push({name: 'newOID', type: 'oid'});

              //create popup template variable:
              var allFields = [];
              myfields.forEach(function(f){
                 allFields.push({fieldName: f.name, visible: true})
              });

              var thisTemplate = {
                title: "Uploaded Layer: "+thisFilename,
                content: [{
                    type: "fields",
                    fieldInfos: allFields
                }]
              };
              console.log(thisTemplate);

              var fl = new FeatureLayer({
                source: graphics1,
                fields: myfields,
                objectIdField: "newOID",
                geometryType: geomType,
                sptatialReference: {wkid: 4326},
                renderer: simpleRenderer,
                opacity: 0.6,
                title: thisFilename,
                popupTemplate: thisTemplate
              });

             map.add(fl);


         });
       };
    reader.readAsArrayBuffer(file);

    //Get projection information
    // let necItems = [];
    // JSZip.loadAsync(file).then(function(zip) {
    //
    //       zip.forEach(function (relativePath, zipEntry) {
    //           console.log(zipEntry.name,typeof(zipEntry.name));
    //           if (zipEntry.name.endsWith('prj')) {
    //               necItems.push(zipEntry);
    //           }
    //       });
    //       console.log(zip,typeof(zip));
    //       console.log(necItems);
    //
    //     }, function (e) {
    //          console.log("Error reading "+file.name +": "+ e.message);
    //
    //     });
  }






/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GOOGLE STREET VIEW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
  var prevx = 1;
  var thestreet;
  var streetcurs = "normal";
  /*
  $("[data-toggle='tooltip']").tooltip({
			trigger : 'hover',
			container: 'body'
	});
  */
  //document.getElementByID("streetv")
  $("#streetv").click(function () {
	  ga('send', 'event', 'Button', 'Click','streetv')

			if (streetcurs == "street"){
				$(document).unbind('mousemove');
				document.getElementById('image').style.display = "none";
				document.getElementById('image2').style.display = "none";
				streetcurs = "normal";
				$("#streetv").blur();
				thestreet.remove();
			} else {
				// Street view image following cursor
				$(document).mousemove(function(e){
					if (prevx > e.pageX ){
						document.getElementById('image').style.display = "block";
						document.getElementById('image2').style.display = "none";
						prevx = e.pageX;
					} else if (prevx < e.pageX)  {
					document.getElementById('image2').style.display = "block";
					document.getElementById('image').style.display = "none";
					}
					$("#image2").css({left:e.pageX - 20, top:e.pageY- 40});
					$("#image").css({left:e.pageX - 20, top:e.pageY- 40});
					prevx = e.pageX;
				});
				//////////////////////////////////////////////////////
				streetcurs = "street";

				thestreet=view.on("click", function(evt) {
					$("#streetv").blur();
					xycoor = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
					document.getElementById('image').style.display = "none";
					document.getElementById('image2').style.display = "none";
					
					Lati = xycoor.y.toFixed(5);
					Longi = xycoor.x.toFixed(5);
					streetviewurl = "http://maps.google.com/?cbll=" + Lati + "," + Longi + "&cbp=12,20.09,,0,5&layer=c";
					streetsideurl = "https://www.bing.com/maps?cp="+Lati+"~"+Longi+"&lvl=17&dir=134&pi=-0.284&style=x&v=2&sV=1";
					streetcurs = "normal";

                    console.log(Lati,Longi);
                    var url_to_GTIndex = "http://sv07gis5.ct.dot.ca.gov/link_google/index_2.html?lat=";
                    var comma = "&long=";
                    window.open(url_to_GTIndex.concat(Lati,comma,Longi),"Google Tools");
					
					$(document).off("mousemove");
					thestreet.remove();
					});

					}
});

//Get the modal
var modal = document.getElementById("myModal");
//Get the button that opens the modal
var btn = document.getElementById("helpBtn");

//Get the span element that closes the modal
var span = document.getElementsByClassName("close")[0];

//When user clicks on the btton, open the modal
btn.onclick = function() {
	modal.style.display = "block";
}

//When the user clicks on span (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

//When user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}



});
