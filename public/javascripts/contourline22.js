//将地图内容与容器绑定
var map = L.map('Mymap', {
	center: [31.58, 110.64906],
	zoom: 10,
	//默认图层
	//layers: [Geoq],
	zoomControl: false
});
//天地图卫星影像
var imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
	maxZoom: 18,
	minZoom: 5
}).addTo(map);
//ndvi
var url1 = 'http://47.106.158.161:6060/geoserver/SNJ_panda/wms'
const rs_fth_2016 = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_Bamboo',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "竹林 © 2018 Hubu Liguiye"
});
rs_fth_2016.addTo(map);

var left = rs_fth_2016;
var right = imgm;
L.control.sideBySide(left, right).addTo(map);


// http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_Bamboo&bbox=109.932540893555%2C31.3487682342529%2C110.980827331543%2C31.8590564727783&width=768&height=373&srs=EPSG%3A4326&format=image%2Fpng