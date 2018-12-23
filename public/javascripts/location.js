//将地图内容与容器绑定
var map = L.map('Mymap', {
	center: [29.98859882, 114.30317402],
	zoom: 11,
	//默认图层
	// layers: [myLayer_21m],
	zoomControl: false
});
//==========================定义地图和地图标注==================================================
//智图
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
//////////////////////////////////控制线WFS服务//////////////////////////////////
var outline = "http://47.106.158.161:6060/geoserver/Lake_fth/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Lake_fth%3Ashp_boundary_line&maxFeatures=50&outputFormat=application%2Fjson";

var myLayer_outline = L.geoJSON(null, {});

$.ajax({
	url: outline, //WFS服务的完整路径
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(data) {
		myLayer_outline.addData(data);
	},
});
//完整路径
var url_21m =
	"http://47.106.158.161:6060/geoserver/Lake_fth/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Lake_fth%3Ashp_contourline_xn21&maxFeatures=50&outputFormat=application%2Fjson";
//GeoJSON图层
var myLayer_21m = L.geoJSON(null, {});
//ajax调用
$.ajax({
	url: url_21m, //WFS服务的完整路径
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(data) {
		myLayer_21m.addData(data);
		
	},
});


myLayer_21m.addTo(map);






////////////////////////////////////////////////////////////////////
//右侧的图层控件
var baseLayers = {
	"智图": Geoq,
	"谷歌卫星影像": satelliteMap,
	"天地图卫星影像": imgm,
	"天地图路网": imga,

};
var overlayLayers = {

	"行政边界": myLayer_outline,
	"斧头湖21米等高线":myLayer_21m

	
};

//右边的图层控件
L.control.layers(baseLayers,overlayLayers).addTo(map);


$('a.ajax').click(function() {
	$('#map').load(this.href);
	return false;
});
