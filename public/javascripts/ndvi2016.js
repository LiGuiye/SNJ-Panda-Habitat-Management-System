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
var url1 = 'http://47.106.158.161:6060/geoserver/Lake_fth/wms'
const rs_fth_2016 = L.tileLayer.wms(url1, {
	layers: 'Lake_fth:rs_SNJ_Slope',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "坡度 © 2018 Hubu Liguiye"
});
rs_fth_2016.addTo(map);
// http://47.106.158.161:6060/geoserver/Lake_fth/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lake_fth%3Ars_SNJ_Slope&bbox=166021.4430960765%2C0.0%2C833978.556903922%2C9329005.182450451&width=330&height=768&srs=EPSG%3A32649&format=application/openlayers
//卷帘
var left = rs_fth_2016;
var right = imgm;
L.control.sideBySide(left, right).addTo(map);
