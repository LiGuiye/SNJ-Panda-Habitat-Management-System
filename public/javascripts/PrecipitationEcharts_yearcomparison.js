var myChart1 = echarts.init(document.getElementById('echarts1'));
var myChart2 = echarts.init(document.getElementById('echarts2'));
var year = 2011;
var month = 1;
var day = 1;
$(function() {
	$('#select_year').on('change', function() {
		var value1 = $(this).val();
		year = value1;
		// alert(year);
		// PrecipitationCharts(year);
	});
	$('#select_month').on('change', function() {
		var value2 = $(this).val();
		month = value2;
		PrecipitationCharts1(year, month);
		
	});
		$('#select_day').on('change', function() {
			var value3 = $(this).val();
			day = value3;
	
			PrecipitationCharts2(month, day);
		});

});

function PrecipitationCharts1(year, month) {

	$.ajax({
		url: '/PrecipitationYearMonth?year=' + year+'&month=' + month,
		type: 'get',
		dataType: 'json',
		outputFormat: 'text/javascript',
		success: function(result) {
			//测试是否返回数据
			//console.log(result);
			//第一个表
			if (result) {
				var day = [],
					max = [],
					min = [],
					average = [];
				for (var i = 0; i < result.data.length; i++) {    
					day.push(result.data[i].day);
				}
				for (var i = 0; i < result.data.length; i++) { 
					max.push(result.data[i].max);
				}
				for (var i = 0; i < result.data.length; i++) {
					min.push(result.data[i].min);
				}
				for (var i = 0; i < result.data.length; i++) {
					average.push(result.data[i].average);
				}

				//指定图表的配置项和数据
				var option1 = {
					title: {
						text: year + '年'+month+'月神农架林区天气数据波动情况'
					},
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: day
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name: 'max',
							type: 'line',
							stack: '总量',
							data: max
						},
						{
							name: 'min',
							type: 'line',
							stack: '总量',
							data: min
						},
						{
							name: 'average',
							type: 'line',
							stack: '总量',
							data: average
						}
					]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart1.setOption(option1);

				//清除上一次数据缓存
				myChart1.clear();
				//开始制图
				myChart1.setOption(option1);
			}
		},
		error: function(data) {
			alert('error::' + data[0] + '---图表请求数据失败');
		}
	});

}
function PrecipitationCharts2(month, day) {

	$.ajax({
		url: '/PrecipitationMonthDay?month=' + month+'&day=' + day,
		type: 'get',
		dataType: 'json',
		outputFormat: 'text/javascript',
		success: function(result) {
			//测试是否返回数据
			console.log(result);
			//第一个表
			if (result) {
				var year = [],
					max = [],
					min = [],
					average = [];
				for (var i = 0; i < result.data.length; i++) {
					//取出x轴--月份     
					year[i] = result.data[i].year;
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴1--年份     
					max[i] = result.data[i].max;
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴2--max数据
					min.push(result.data[i].min);
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴3--min数据
					average.push(result.data[i].average);
				}
				

				//指定图表的配置项和数据
				var option2 = {
					title: {
						text: month + '月'+day+'日神农架林区历年同期数据对比'
					},
					tooltip: {
						trigger: 'axis'
					},
					// 						legend: {
					// 							data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
					// 						},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: year
					},
					yAxis: {
						type: 'value'
					},
					series: [
						// 						{
						// 							name: 'area',
						// 							type: 'line',
						// 							stack: '总量',
						// 							data: yValue1
						// 						},
						{
							name: 'max',
							type: 'line',
							stack: '总量',
							data: max
						},
						{
							name: 'min',
							type: 'line',
							stack: '总量',
							data: min
						},
						{
							name: 'average',
							type: 'line',
							stack: '总量',
							data: average
						}
					]
				};
				myChart2.setOption(option2);

				//清除上一次数据缓存
				myChart2.clear();
				//开始制图
				myChart2.setOption(option2);
			}
		},
		error: function(data) {
			alert('error::' + data[0] + '---图表请求数据失败');
		}
	});
}


///////////////////////////////////////////////////////////////////
//将地图内容与容器绑定
var map = L.map('Mymap', {
	center: [31.58, 110.64906],
	zoom: 9,
	//默认图层
	//layers: [Geoq],
	zoomControl: false
});
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
shp_SNJ_Boundry_line.addTo(map);
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



///////////////////////////////////////////////////////////////

//打开时的默认页面,很蠢的写法，千万不要学
$.ajax({
		url: '/PrecipitationYearMonth?year=' + year+'&month=' + month,
		type: 'get',
		dataType: 'json',
		outputFormat: 'text/javascript',
		success: function(result) {
			//测试是否返回数据
			//console.log(result);
			//第一个表
			if (result) {
				var day = [],
					max = [],
					min = [],
					average = [];
				for (var i = 0; i < result.data.length; i++) {    
					day.push(result.data[i].day);
				}
				for (var i = 0; i < result.data.length; i++) { 
					max.push(result.data[i].max);
				}
				for (var i = 0; i < result.data.length; i++) {
					min.push(result.data[i].min);
				}
				for (var i = 0; i < result.data.length; i++) {
					average.push(result.data[i].average);
				}

				//指定图表的配置项和数据
				var option1 = {
					title: {
						text: year + '年'+month+'月神农架林区天气数据波动情况'
					},
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: day
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name: 'max',
							type: 'line',
							stack: '总量',
							data: max
						},
						{
							name: 'min',
							type: 'line',
							stack: '总量',
							data: min
						},
						{
							name: 'average',
							type: 'line',
							stack: '总量',
							data: average
						}
					]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart1.setOption(option1);

				//清除上一次数据缓存
				myChart1.clear();
				//开始制图
				myChart1.setOption(option1);
			}
		},
		error: function(data) {
			alert('error::' + data[0] + '---图表请求数据失败');
		}
	});

$.ajax({
		url: '/PrecipitationMonthDay?month=' + month+'&day=' + day,
		type: 'get',
		dataType: 'json',
		outputFormat: 'text/javascript',
		success: function(result) {
			//测试是否返回数据
			console.log(result);
			//第一个表
			if (result) {
				var year = [],
					max = [],
					min = [],
					average = [];
				for (var i = 0; i < result.data.length; i++) {
					//取出x轴--月份     
					year[i] = result.data[i].year;
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴1--年份     
					max[i] = result.data[i].max;
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴2--max数据
					min.push(result.data[i].min);
				}
				for (var i = 0; i < result.data.length; i++) {
					//取出y轴3--min数据
					average.push(result.data[i].average);
				}
				

				//指定图表的配置项和数据
				var option2 = {
					title: {
						text: month + '月'+day+'日神农架林区历年同期数据对比'
					},
					tooltip: {
						trigger: 'axis'
					},
					// 						legend: {
					// 							data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
					// 						},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: year
					},
					yAxis: {
						type: 'value'
					},
					series: [
						// 						{
						// 							name: 'area',
						// 							type: 'line',
						// 							stack: '总量',
						// 							data: yValue1
						// 						},
						{
							name: 'max',
							type: 'line',
							stack: '总量',
							data: max
						},
						{
							name: 'min',
							type: 'line',
							stack: '总量',
							data: min
						},
						{
							name: 'average',
							type: 'line',
							stack: '总量',
							data: average
						}
					]
				};
				myChart2.setOption(option2);

				//清除上一次数据缓存
				myChart2.clear();
				//开始制图
				myChart2.setOption(option2);
			}
		},
		error: function(data) {
			alert('error::' + data[0] + '---图表请求数据失败');
		}
	});