// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('map'));

var xValue = [],
	yValue1 = [],
	yValue2 = [],
	yValue3 = [],
	yValue4 = [],
	yValue5 = [],
	yValue6 = [],
	yValue7 = [];
$.ajax({
	url: '/PrecipitationYear?year=' + 1998,
	type: 'get',
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(result) {
		//测试是否返回数据
		console.log(result.data[0]);
		//请求成功时执行该函数内容，result即为服务器返回的json对象
		if (result) {
			for (var i = 0; i < result.data.length; i++) {
				//取出x轴--月份     
				xValue.push(result.data[i].month);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴1--area数据
				yValue1.push(result.data[i].area);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴2--max数据
				yValue2.push(result.data[i].max);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴3--min数据
				yValue3.push(result.data[i].min);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴4--mean数据
				yValue4.push(result.data[i].mean);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴5--range数据
				yValue5.push(result.data[i].range);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴6--std数据
				yValue6.push(result.data[i].std);
			}
			for (var i = 0; i < result.data.length; i++) {
				//取出y轴7--sum数据，但表格里没用，因为效果不好
				yValue7.push(result.data[i].sum);
			}
			// 指定图表的配置项和数据
			var option = {
				title: {
					text: '1998年'
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
					data: xValue
				},
				yAxis: {
					type: 'value'
				},
				series: [{
						name: 'area',
						type: 'line',
						stack: '总量',
						data: yValue1
					},
					{
						name: 'max',
						type: 'line',
						stack: '总量',
						data: yValue2
					},
					{
						name: 'min',
						type: 'line',
						stack: '总量',
						data: yValue3
					},
					{
						name: 'mean',
						type: 'line',
						stack: '总量',
						data: yValue4
					},
					{
						name: 'range',
						type: 'line',
						stack: '总量',
						data: yValue5
					},
					{
						name: 'std',
						type: 'line',
						stack: '总量',
						data: yValue6
					}
				]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);

			//清除上一次数据缓存
			myChart.clear();
			//开始制图
			myChart.setOption(option);
		}
	},
	error: function(data) {
		alert('error::' + data[0] + '---图表请求数据失败');
	}
});


$('a.ajax').click(function() {
	$('#map').load(this.href);
	return false;
});
