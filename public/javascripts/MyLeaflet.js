//将地图内容与容器绑定
var map = L.map('map', {
	center: [31.58, 110.64906],
	zoom: 10,
	//默认图层
	//layers: [Geoq],
	zoomControl: false
});

//==========================定义地图和地图标注===================================
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
///////////////////////////////////////////////////////////
//地图服务地址WMS
var url1 = 'http://47.106.158.161:6060/geoserver/SNJ_panda/wms';
var url2 = 'http://47.106.158.161:6060/geoserver/Lake_fth/wms'
//构建地图服务连接串
// http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_Bamboo&bbox=109.932540893555%2C31.3487682342529%2C110.980827331543%2C31.8590564727783&width=768&height=373&srs=EPSG%3A4326&format=image%2Fpng
const shp_SNJ_Bamboo = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_Bamboo',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "竹林 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_Boundry_line&bbox=109.934262905906%2C31.2977172897807%2C110.975644879449%2C31.8640529524911&width=768&height=417&srs=EPSG%3A4326&format=image%2Fpng
const shp_SNJ_Boundry_line = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_Boundry_line',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "边界 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_Construction&bbox=109.960403442383%2C31.3185195922852%2C110.949836730957%2C31.850980758667&width=768&height=413&srs=EPSG%3A4326&format=image%2Fpng
const shp_SNJ_Construction = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_Construction',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "居民点 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_FarmLand&bbox=109.960403442383%2C31.3185195922852%2C110.949836730957%2C31.850980758667&width=768&height=413&srs=EPSG%3A4326&format=image%2Fpng
const shp_SNJ_FarmLand = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_FarmLand',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "耕地 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/SNJ_panda/wms?service=WMS&version=1.1.0&request=GetMap&layers=SNJ_panda%3Ashp_SNJ_road&bbox=109.970680236816%2C31.3335399627686%2C110.931999206543%2C31.8440418243408&width=768&height=407&srs=EPSG%3A4326&format=image%2Fpng
const shp_SNJ_road = L.tileLayer.wms(url1, {
	layers: 'SNJ_panda:shp_SNJ_road',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "道路 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/Lake_fth/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lake_fth%3Ars_SNJ_DEM&bbox=166021.4430960765%2C0.0%2C833978.556903922%2C9329005.182450451&width=330&height=768&srs=EPSG%3A32649&format=application/openlayers
const rs_SNJ_DEM = L.tileLayer.wms(url2, {
	layers: 'Lake_fth:rs_SNJ_DEM',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "DEM © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/Lake_fth/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lake_fth%3Ars_SNJ_Slope&bbox=166021.4430960765%2C0.0%2C833978.556903922%2C9329005.182450451&width=330&height=768&srs=EPSG%3A32649&format=application/openlayers
const rs_SNJ_Slope = L.tileLayer.wms(url2, {
	layers: 'Lake_fth:rs_SNJ_Slope',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "坡度 © 2018 Hubu Liguiye"
});
//http://47.106.158.161:6060/geoserver/Lake_fth/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lake_fth%3Ars_SNJ_Aspect&bbox=166021.4430960765%2C0.0%2C833978.556903922%2C9329005.182450451&width=330&height=768&srs=EPSG%3A32649&format=application/openlayers
const rs_SNJ_Aspect = L.tileLayer.wms(url2, {
	layers: 'Lake_fth:rs_SNJ_Aspect',
	format: "image/png",
	//		crs: L.CRS.EPSG3857,
	opacity: 1,
	transparent: true,
	attribution: "坡向 © 2018 Hubu Liguiye"
});
////////////////////////////////////////////////////////////////////
//右侧的图层控件
var baseLayers = {
	"智图": Geoq,
	"谷歌卫星影像": satelliteMap,
	"天地图卫星影像": imgm,
	"天地图路网": imga,

};
var overlayLayers = {
	"边界":shp_SNJ_Boundry_line,
	"居民点": shp_SNJ_Construction,
	"耕地": shp_SNJ_FarmLand,
	"道路": shp_SNJ_road,
	"坡度": rs_SNJ_Slope,
	"坡向": rs_SNJ_Aspect,
	"DEM": rs_SNJ_DEM,
	"竹林":shp_SNJ_Bamboo
	
};

// //右边的图层控件
L.control.layers(baseLayers,overlayLayers).addTo(map);
// L.control.layers('', overlayLayers, {
// 	position: 'topleft',
// 	autoZIndex: true
// }).addTo(map);


$('a.ajax').click(function() {
	$('#map').load(this.href);
	return false;
});
