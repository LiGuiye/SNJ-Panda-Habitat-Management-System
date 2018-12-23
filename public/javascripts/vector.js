var map = L.map('Mymap', {
	center: [29.98859882, 114.30317402],
	zoom: 12,
	//默认图层
	//layers: [Geoq],
	zoomControl: false
});
////////////////定义Icon颜色//////////////////////////////////////////
var yellowIcon = new L.Icon({
	iconUrl: '../MarkerImages/marker-icon-yellow.png',
	shadowUrl: '../MarkerImages/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
var greenIcon = new L.Icon({
	iconUrl: '../MarkerImages/marker-icon-green.png',
	shadowUrl: '../MarkerImages/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
var redIcon = new L.Icon({
	iconUrl: '../MarkerImages/marker-icon-red.png',
	shadowUrl: '../MarkerImages/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
var blueIcon = new L.Icon({
	iconUrl: '../MarkerImages/marker-icon-blue.png',
	shadowUrl: '../MarkerImages/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
////////////////////////////底图//////////////////////////////////////////////
var Geoq = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
		maxZoom: 18,
		minZoom: 5
	}),
	//谷歌卫星影像
	satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
		maxZoom: 18,
		minZoom: 5
	}),
	//天地图卫星影像
	imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
		maxZoom: 18,
		minZoom: 5
	}).addTo(map),
	//天地图路网
	imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
		maxZoom: 18,
		minZoom: 5
	});
// 				function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }
// 
// map.on('click', onMapClick);

/////////////////////////保护线服务地址WMS////////////////////////////////////
var url1 = 'http://47.106.158.161:6060/geoserver/Lake_fth/wms'
const myLayer_protectionline = L.tileLayer.wms(url1, {
	layers: 'Lake_fth:shp_protectionline_fth',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "保护线 © 2018 Hubu Liguiye"
});
const myLayer_controlline = L.tileLayer.wms(url1, {
	layers: 'Lake_fth:shp_controlline_fth',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "控制线 © 2018 Hubu Liguiye"
});
//////////////////////////////////控制线WFS服务//////////////////////////////////
var shp_controlline_pilepoint_fth =
	"http://47.106.158.161:6060/geoserver/Lake_fth/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Lake_fth%3Ashp_controlline_pilepoint_fth&maxFeatures=500&outputFormat=application%2Fjson";
var shp_protectionline_pilepoint_fth =
	"http://47.106.158.161:6060/geoserver/Lake_fth/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Lake_fth%3Ashp_protectionline_pilepoint_fth&maxFeatures=500&outputFormat=application%2Fjson";
var myLayer_controlline_pilepoint = L.geoJSON(null, {});
var myLayer_protectionline_pilepoint = L.geoJSON(null, {
	onEachFeature: onEachFeature
});
$.ajax({
	url: shp_controlline_pilepoint_fth, //WFS服务的完整路径
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(data) {
		myLayer_controlline_pilepoint.addData(data);
	},
});
$.ajax({
	url: shp_protectionline_pilepoint_fth, //WFS服务的完整路径
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(data) {
		myLayer_protectionline_pilepoint.addData(data);
	},
});

//点击地图要素事件回调函数
function onEachFeature(feature, marker) {
	//获取选中要素的行政区编码
	var code = feature.properties.num;
	var erweima = "url(../images/" + code + ".png)";
	//新建弹出窗体并设置大小
	var content = '<div style="width: 100px; height: auto;" id="popupwindow"></div>' +
		"桩点序号：" + feature.properties.num + '<br/>' + "经度：" + feature.properties.longitude + '<br/>' + "纬度：" + feature.properties
		.latitude;
	//点击弹出窗口，并设置最大宽度，因为默认宽度为301，不一定够一个Echart的正常显示
	marker.bindPopup(content, {
		maxWidth: 120,
	});
	///////////////////////////建议添加label显示序号
	//点击弹出信息窗口		
	marker.on('popupopen', function(e) {
		////////////如果增加了二维码，记得改这里/////////////////////////////
		if (code >= 42 && code <= 62) {
			document.getElementById("popupwindow").style.height = "100px";
		}
		document.getElementById("popupwindow").style.backgroundImage = erweima;
		document.getElementById("popupwindow").style.backgroundSize = "100px 100px";
	});

	// marker.enableTemporaryHighlight();


}
// var marker1 = L.marker([29.98859882, 114.30317402]).setIcon(yellowIcon).bindPopup('ssss').addTo(map);
// marker1.enableTemporaryHighlight();

//myLayer_protectionline.addTo(map);
//myLayer_protectionline_pilepoint.addTo(map);
///////////////////////////转移至数据库中的点///////////////////////////////////
var markernum = L.marker().openPopup();
var latitude = [],
	longitude = [],
	content = [],
	erweima = [];
$.ajax({
	url: '/protectionline_pilepoint',
	type: 'get',
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(result) {

		//测试是否返回数据
		console.log(result.data[61].location);
		//第一个表
		if (result) {
			for (var i = 1; i < result.data.length + 1; i++) {
				latitude[i] = result.data[i - 1].latitude;
				longitude[i] = result.data[i - 1].longitude;

				markernum[i] = L.marker([latitude[i], longitude[i]], {
					icon: blueIcon,
					opacity: 1,

				}).addTo(map);

				//新建弹出窗体并设置大小
				content[i] = '<div style="width: 100px; height: auto;" id="popupwindow"></div>' +
					"桩点序号：" + i + '<br/>' + "经度：" + longitude[i] + '<br/>' + "纬度：" + latitude[i]+ '<br/>' + "状态：" + result.data[i-1].location;
				erweima[i] = "url(../images/" + i + ".png)";
				markernum[i].bindPopup(content[i], {
					maxWidth: 120,
				});
				markernum[i].on('popupopen', function(e) {
					////////////如果增加了二维码，记得改这里/////////////////////////////
					if (i >= 42 && i <= 62) {
						document.getElementById("popupwindow").style.height = "100px";
					}
					document.getElementById("popupwindow").style.backgroundImage = erweima[i];
					document.getElementById("popupwindow").style.backgroundSize = "100px 100px";
				});
				if(result.data[i - 1].location == "已勘点"){
					ChangeGreen(i);
				}
				if(result.data[i - 1].location == "未勘点"){
					markernum[i].setIcon(blueIcon);
				}
				if(result.data[i - 1].location == "新增点"){
					markernum[i].setIcon(yellowIcon);
				}

			}
// 			if()
// 			for(var i = 42;i<=62;i++){
// 				
// 			}
			

			//CreatMarker(latitude, longitude, result.data.length);
		}
	}
});
// 


function CreatMarker(latitude, longitude, length) {
	for (var i = 1; i < length; i++) {
		markernum[i] = L.marker([latitude[i], longitude[i]], {
			icon: redIcon
		}).addTo(map);
		//好像因为不能写在ajax后面？
		// markernum[i].bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
	}
	//ChangeColor(222); //只能写在这儿？？智障吧
}


function ChangeGreen(id) {
	markernum[id].setIcon(greenIcon);
		//新建弹出窗体并设置大小
		var content = '<div style="width: 100px; height: auto;" id="popupwindow"></div>' +
			"桩点序号：" + id+ '<br/>' + "经度：" + longitude[id] + '<br/>' + "纬度：" + latitude[id]+ '<br/>' + "状态：已勘点";
		var erweima = "url(../images/" + id + ".png)";
		markernum[id].bindPopup(content, {
			maxWidth: 120,
		});		
		markernum[id].on('popupopen', function(e) {
			////////////如果增加了二维码，记得改这里/////////////////////////////
			if (id >= 42 && id <= 62) {
				document.getElementById("popupwindow").style.height = "100px";
			}
			document.getElementById("popupwindow").style.backgroundImage = erweima;
			document.getElementById("popupwindow").style.backgroundSize = "100px 100px";
		});
}


////////////////////////////////////////////////////////////////////
//右侧的图层控件
var baseLayers = {
	"天地图卫星影像": imgm,
	"天地图路网": imga,
	"智图": Geoq,
	"谷歌卫星影像": satelliteMap,
};
var overlayLayers = {
	//"myGroup": myGroup,
	"斧头湖规划保护线": myLayer_protectionline,
	"斧头湖规划保护线桩点": myLayer_protectionline_pilepoint,
	"斧头湖规划控制线": myLayer_controlline,
	"斧头湖规划控制线桩点": myLayer_controlline_pilepoint,

};
//右边的图层控件
L.control.layers(baseLayers).addTo(map);
L.control.layers('', overlayLayers, {
	position: 'topleft',
	autoZIndex: true
}).addTo(map);

$('a.ajax').click(function() {
	$('#map').load(this.href);
	return false;
});
