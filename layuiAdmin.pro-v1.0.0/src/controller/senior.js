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
            data : name,
            axisLabel: {
                interval:0,
                rotate:45, //代表逆时针旋转45度
            }
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'数量',
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
 });

    exports('senior', {})

});
  