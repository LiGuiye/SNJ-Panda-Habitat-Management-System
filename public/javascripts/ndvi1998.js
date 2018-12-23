//将地图内容与容器绑定
var map = L.map('Mymap', {
center: [31.58, 110.4],
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
const rs_fth_1998 = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_Boundry_line',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "神农架行政区边界 © 2018 Hubu Liguiye"
});
rs_fth_1998.addTo(map);



// http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_Boundry_line&bbox=109.934262905906%2C31.2977172897807%2C110.975644879449%2C31.8640529524911&width=768&height=417&srs=EPSG%3A4326&format=image%2Fpng
// //卷帘
// var left = rs_fth_1998;
// var right = imgm;
// L.control.sideBySide(left, right).addTo(map);
