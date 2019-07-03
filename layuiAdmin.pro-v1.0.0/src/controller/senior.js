/**

 @Name：layuiAdmin Echarts集成
 @Site：http://www.layui.com/admin/
 @License：GPL-2

 */


layui.define(function(exports){

  //区块轮播切换
  layui.use(['admin', 'carousel'], function(){
    var $ = layui.$
    ,admin = layui.admin
    ,carousel = layui.carousel
    ,element = layui.element
    ,device = layui.device();

    //轮播切换
    $('.layadmin-carousel').each(function(){
      var othis = $(this);
      carousel.render({
        elem: this
        ,width: '100%'
        ,arrow: 'none'
        ,interval: othis.data('interval')
        ,autoplay: othis.data('autoplay') === true
        ,trigger: (device.ios || device.android) ? 'click' : 'hover'
        ,anim: othis.data('anim')
      });
    });

  });


  //折线图
  layui.use(['echarts'], function(){
    var $ = layui.$
    ,echarts = layui.echarts;

    //标准折线图
    var echnormline = [], normline = [
      {
        title : {
          text: '本月成交单数',
          subtext: '8月'
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['轰趴','麻将','狼人杀包场']
        },
        calculable : true,
        xAxis : [
          {
            type : 'category',
            boundaryGap : true,

            data : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'
            ,'17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
          }
        ],
        yAxis : [

        ],
        series : [
          {
            name:'轰趴',
            type:'line',
            data:[1, 1, 5, 3, 2, 3, 3],
            markLine : {
              data : [{type : 'average', name: '平均值'}]
            }

          },
          {
            name:'麻将',
            type:'line',
            data:[1, 2, 2, 5, 3, 2, 0],
            markLine : {
              data : [{type : 'average', name : '平均值'}]
            }
          } ,{
            name:'狼人杀包场',
            type:'line',
            data:[12, 4, 1, 12, 2, 1, 0],

            markLine : {
              data : [{type : 'average', name: '平均值'}]
            }
          }
        ]
      }
    ]
    ,elemnormline = $('#LAY-index-normline2').children('div')
    ,rendernormline = function(index){
      echnormline[index] = echarts.init(elemnormline[index], layui.echartsTheme);
      echnormline[index].setOption(normline[index]);
      window.onresize = echnormline[index].resize;
    };
    if(!elemnormline[0]) return;
    rendernormline(0);

  });




  //柱状图
  layui.use(['echarts'], function(){
    var $ = layui.$
    ,echarts = layui.echarts,
    setter = layui.setter;

    var name = new Array();
    var count = new Array();
    $.ajax({
          url: setter.http + 'getPersonLoveTop/',
          type: 'GET',
          error: function(request) {
            layer.alert("获取热门商品失败", {
              icon: 2
            });
          },
          success: function(data) {
            console.log(data);
            if (data['code'] == 0) {
              name = data['data']['name'];
              count = data['data']['count']
              //标准柱状图
    var echnormcol = [], normcol = [
      {
        title : {
          text: '热门收藏Top10商品',
          subtext: '澳品汇'
        },
        tooltip : {
          trigger: 'axis'
        },
       
        calculable : true,
        xAxis : [
          {
            type : 'category',
            data : name
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'商品名',
            type:'bar',
            data: count,
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data : [{type : 'average', name: '平均值'}]
            }
          }
        ]
      }
    ]
    ,elemNormcol = $('#LAY-index-normline').children('div')
    ,renderNormcol = function(index){
      echnormcol[index] = echarts.init(elemNormcol[index], layui.echartsTheme);
      echnormcol[index].setOption(normcol[index]);
      window.onresize = echnormcol[index].resize;
    };
    if(!elemNormcol[0]) return;
    renderNormcol(0);
            } else if (data['code'] == '1001') {
              admin.exit();
            } else {
              layer.alert("获取热门商品失败!", {
                icon: 2
              });
            }
          }
        });
    



    //标准条形图
    var echnormbar = [], normbar = [
      {
        title : {
          text: '世界人口总量',
          subtext: '数据来自网络'
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['2011年', '2012年']
        },
        calculable : true,
        xAxis : [
          {
            type : 'value',
            boundaryGap : [0, 0.01]
          }
        ],
        yAxis : [
          {
            type : 'category',
            data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
          }
        ],
        series : [
          {
            name:'2011年',
            type:'bar',
            data:[18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name:'2012年',
            type:'bar',
            data:[19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      }
    ]
    ,elemNormbar = $('#LAY-index-normbar').children('div')
    ,renderNormbar = function(index){
      echnormbar[index] = echarts.init(elemNormbar[index], layui.echartsTheme);
      echnormbar[index].setOption(normbar[index]);
      window.onresize = echnormbar[index].resize;
    };
    if(!elemNormbar[0]) return;
    renderNormbar(0);

  });


  //地图
  layui.use(['echarts'], function(){
    var $ = layui.$
    ,echarts = layui.echarts;

    var echplat = [], plat = [
      {
        title : {
          text: '2011全国GDP（亿元）',
          subtext: '数据来自国家统计局'
        },
        tooltip : {
            trigger: 'item'
        },
        dataRange: {
            orient: 'horizontal',
            min: 0,
            max: 55000,
            text:['高','低'],           // 文本，默认为数值文本
            splitNumber:0
        },
        series : [
          {
            name: '2011全国GDP分布',
            type: 'map',
            mapType: 'china',
            mapLocation: {
                x: 'center'
            },
            selectedMode : 'multiple',
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
            data:[
                {name:'西藏', value:605.83},
                {name:'青海', value:1670.44},
                {name:'宁夏', value:2102.21},
                {name:'海南', value:2522.66},
                {name:'甘肃', value:5020.37},
                {name:'贵州', value:5701.84},
                {name:'新疆', value:6610.05},
                {name:'云南', value:8893.12},
                {name:'重庆', value:10011.37},
                {name:'吉林', value:10568.83},
                {name:'山西', value:11237.55},
                {name:'天津', value:11307.28},
                {name:'江西', value:11702.82},
                {name:'广西', value:11720.87},
                {name:'陕西', value:12512.3},
                {name:'黑龙江', value:12582},
                {name:'内蒙古', value:14359.88},
                {name:'安徽', value:15300.65},
                {name:'北京', value:16251.93, selected:true},
                {name:'福建', value:17560.18},
                {name:'上海', value:19195.69, selected:true},
                {name:'湖北', value:19632.26},
                {name:'湖南', value:19669.56},
                {name:'四川', value:21026.68},
                {name:'辽宁', value:22226.7},
                {name:'河北', value:24515.76},
                {name:'河南', value:26931.03},
                {name:'浙江', value:32318.85},
                {name:'山东', value:45361.85},
                {name:'江苏', value:49110.27},
                {name:'广东', value:53210.28, selected:true}
            ]
          }
        ]
      }
    ]
    ,elemplat = $('#LAY-index-plat').children('div')
    ,renderplat = function(index){
      echplat[index] = echarts.init(elemplat[index], layui.echartsTheme);
      echplat[index].setOption(plat[index]);
      window.onresize = echplat[index].resize;
    };
    if(!elemplat[0]) return;
    renderplat(0);
  });

    exports('senior', {})

});