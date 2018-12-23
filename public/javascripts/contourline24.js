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

var url1 = 'http://47.106.158.161:6060/geoserver/SNJ_panda/wms'
const rs_fth_2016 = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_road',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "道路 © 2018 Hubu Liguiye"
});
rs_fth_2016.addTo(map);

var left = rs_fth_2016;
var right = imgm;
L.control.sideBySide(left, right).addTo(map);

// http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_road&bbox=109.970680236816%2C31.3335399627686%2C110.931999206543%2C31.8440418243408&width=768&height=407&srs=EPSG%3A4326&format=image%2Fpng