/**

 @Name：layuiAdmin 订单系统
 @Site：http://www.layui.com/admin/
 @License：GPL-2

 */


layui.define(['table', 'form', 'element'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,setter = layui.setter
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,table = layui.table
  ,slider = layui.slider
  ,form = layui.form
  ,element = layui.element;

  table.render({
     elem: '#LAY-app-workorder'
     ,url: setter.http+'listOrder/'
    //,url: './json/workorder/demo.js' //模拟接口
    ,where: {
      access_token: layui.data('layuiAdmin').access_token
    }
    ,cols: [[
      {type: 'numbers', fixed: 'left'}
      ,{field: 'order_serial_number', width: 150, title: '订单号', sort: true,align: 'center'}
      ,{field: 'name', width: 150, title: '订单人',align: 'center'}
      ,{field: 'phone', width: 150, title: '手机号',align: 'center'}
      ,{field: 'type', width: 100, title: '订单类型',align: 'center'}
      ,{field: 'all_value', width: 100, title: '结算费用',align: 'center'}
      //,{field: 'lay_value', width: 100, title: '延时费用',align: 'center'}
      //,{field: 'free_value', width: 100, title: '优惠费用',align: 'center'}
      ,{field: 'progress', title: '进度', width: 200, align: 'center', templet: '#progressTpl'}
      ,{field: 'notes', width: 160, title: '备注',align: 'center'}
      ,{field: 'state', width: 120,title: '订单状态', templet: '#buttonTpl', align: 'center'}
      ,{title: '操作', align: 'center', minWidth:350,fixed: 'right', toolbar: '#table-system-order'}
    ]]
    ,page: true
    ,limit: 10
    ,limits: [10, 15, 20, 25, 30]
    ,text: '对不起，加载出现异常！'
    ,done: function(res){
      element.render('progress');
      data_len = res.data.length;
      if (res['code'] == '1001'){
        admin.exit();
      }else{
        if(data_len == 0){
        var s = $('.layui-none').html('无订单数据')
      }
      }

    }
  });



  //监听工具条
  table.on('tool(LAY-app-workorder)', function(obj){
    var data = obj.data;
    if(obj.event === 'view'){
      admin.popup({
        title: '订单信息'
        ,id: 'LAY-popup-workorder-add'
        ,area: ['750px', '750px']
        ,success: function(layero, index){
          //console.log(data);
          view(this.id).render('app/workorder/listform').done(function(){
            $.ajax({
              //url: './json/workorder/dddetail.js'
              url: setter.http+'orderDetail/'
              ,type: 'get'
              ,data: {'order_serial_number':data['order_serial_number'],'access_token': layui.data('layuiAdmin').access_token}
              ,error:function(data){
                  layer.msg("获取订单详情失败",{icon:2});
              }
              ,success: function(res){
                if(res['code'] == 0){
                   //console.log(res);
                 form.render(null, 'layuiadmin-form-workorder');
                  $("#orderid").val(res['order_serial_number']);
                  $("#attr").val(res['name']);
                  $("#type").val(res['type']);
                  if(res['state']==0){
                     $("#status").val('待结账');
                  }else if(res['state']==1){
                     $("#status").val('已结账');
                  }else{
                     $("#status").val('已废弃');
                  }
                  $("#time").val(res['start_time']);
                  $("#end_time").val(res['end_time']);
                  $("#site_money").val(res['site_money']);
                  $("#money").val(res['money']);
                  $("#lay_value").val(res['lay_value']);
                  $("#free_value").val(res['free_value']);
                  $("#jf").val(res['integration']);
             /*     point = '<div class="layui-form-item">目前可用积分为：'+res['valid_point']+'分</div>'
                  $("#point").html(point);*/
                  $("#all").attr("style","display:none;")

                  var server = res.server
                  var good = res.good
                  //console.log(result);


                  if(server.length != 0){
                   var my_str='<table  class="layui-table" lay-size="sm" align="center"><th>服务名</th><th>单价</th><th>数量</th>';
                    for (var i=0;i<server.length;i++){
                    my_str += '<tr><td>'+server[i].name+'</td><td>'+server[i].price+'</td><td>'+server[i].server_count+'</td></tr>'
                    }
                    my_str += '</table>'

                  }else{
                    my_str = '<table  class="layui-table" lay-size="sm" align="center"><th>服务名</th><th>单价</th><th>数量</th><tr><td style="font-size:8px;" colspan = "3" align="center">未消费</td></tr></table>'
                  }

                  if(good.length !=0){
                    var my_str2 ='<table  class="layui-table" lay-size="sm"><th>商品名</th><th>单价</th><th>数量</th>';
                     for (var i=0;i<good.length;i++){
                      my_str2 += '<tr><td>'+good[i].name+'</td><td>'+good[i].price+'</td><td>'+good[i].good_count+'</td></tr>'
                    }
                    my_str2 += '</table>'
                  }else{
                    my_str2 = '<table  class="layui-table" lay-size="sm"><th>商品名</th><th>单价</th><th>数量</th><tr><td style="font-size:8px;" colspan="3" align="center">未消费</td><tr></table>'
                  }

                  $("#serverlist").html(my_str)
                  $("#goodlist").html(my_str2)

                }else if(res['code'] == '1001'){
                  admin.exit();
                }else{

                }


              }
            });


            form.on('submit(LAY-app-workorder-submit)', function(data){
              layer.close(index)
            });
          });
        }
      });
    }else if(obj.event === 'complete'){

      layer.prompt({
          formType: 1
          ,title: '敏感操作，请验证口令'
          }, function(value, index){
            if(value =='111111'){
          layer.close(index);
        admin.popup({
        title: '订单信息'
        ,id: 'LAY-popup-workorder-add'
        ,area: ['750px', '750px']
        ,success: function(layero, index){
          //console.log(data);
          view(this.id).render('app/workorder/listform').done(function(){

            $.ajax({
              //url: './json/workorder/dddetail.js'
              url: setter.http+'orderDetail/'
              ,type: 'get'
              ,data: {'order_serial_number':data['order_serial_number'],'access_token': layui.data('layuiAdmin').access_token}
              ,error:function(data){
                  layer.msg("获取订单详情失败",{icon:2});
              }
              ,success: function(res){
                //console.log(res);
                if(res['code'] == 0){
                  form.render(null, 'layuiadmin-form-workorder');

                  $("#orderid").val(res['order_serial_number']);
                  $("#attr").val(res['name']);
                  $("#type").val(res['type']);
                  if(res['state']==0){
                     $("#status").val('待结账');
                  }else if(res['state']==1){
                     $("#status").val('已结账');
                  }else{
                     $("#status").val('已废弃');
                  }
                  $("#time").val(res['start_time']);
                  $("#end_time").val(res['end_time']);
                  $("#site_money").val(res['site_money']);
                  $("#money").val(res['money']);
                  $("#lay_value").removeAttr('disabled');
                  $("#free_value").removeAttr('disabled');
                  $("#jf").val(res['integration']);
                  $("#end").val("结账");
                  point = '<div >目前可用积分为：'+res['valid_point']+'分</div>'
                  $("#point").html(point);
                  var server = res.server
                  var good = res.good
                  //console.log(result);


                  if(server.length != 0){
                   var my_str='<table  class="layui-table" lay-size="sm" align="center"><th>服务名</th><th>单价</th><th>数量</th>';
                    for (var i=0;i<server.length;i++){
                    my_str += '<tr><td>'+server[i].name+'</td><td>'+server[i].price+'</td><td>'+server[i].server_count+'</td></tr>'
                    }
                    my_str += '</table>'

                  }else{
                    my_str = '<table  class="layui-table" lay-size="sm" align="center"><th>服务名</th><th>单价</th><th>数量</th><tr><td style="font-size:8px;" colspan = "3" align="center">未消费</td></tr></table>'
                  }

                  if(good.length !=0){
                    var my_str2 ='<table  class="layui-table" lay-size="sm"><th>商品名</th><th>单价</th><th>数量</th>';
                     for (var i=0;i<good.length;i++){
                      my_str2 += '<tr><td>'+good[i].name+'</td><td>'+good[i].price+'</td><td>'+good[i].good_count+'</td></tr>'
                    }
                    my_str2 += '</table>'
                  }else{
                    my_str2 = '<table  class="layui-table" lay-size="sm"><th>商品名</th><th>单价</th><th>数量</th><tr><td style="font-size:8px;" colspan="3" align="center">未消费</td><tr></table>'
                  }

                  $("#serverlist").html(my_str);
                  $("#goodlist").html(my_str2);
                  if(res['valid_point'] == 0){
                      $("#point_type").attr("style","display:none;")
                    }else{
                      form.on('radio(gis)', function(data){
                    layer.msg('请在下方文本框中输入本次使用的积分');
                    $("#my_point").attr('style',"display:inline;width:250px;");
                    $("#my_point").attr('lay-verify',"required");
                    $("#my_point").attr('placeholder',"可用积分取整到10位数");

                  });
                    form.on('radio(gis1)', function(data){
                    $("#my_point").attr("style","display:none;")
                    $("#my_point").removeAttr('lay-verify')


                  });
                    form.on('radio(gis2)', function(data){
                    $("#my_point").attr("style","display:none;")
                     $("#my_point").removeAttr('lay-verify')

                  });

                    }
                  }else if(res['code'] == '1001'){

                    admin.exit();
                  }else {

                  }



              }
            });

            form.on('submit(LAY-app-workorder-submit)', function(res){
              console.log(data);
              field = res.field
              field['access_token'] = layui.data('layuiAdmin').access_token
              $.ajax({
              //url: './json/workorder/ddje.js'
              url: setter.http+'endOrder/'
              ,type: 'post'
              ,data: field
              ,error:function(data){
                  layer.msg("订单结算失败",{icon:2});
              }
              ,success: function(res){
                 if(res['code'] == 0){
                  layer.msg("结账成功",{icon:1});
                  table.reload('LAY-app-workorder');
                }else if(res['code'] == '1001'){
                  admin.exit();
                }else if(res['code'] == 2) {
                  layer.msg("可用积分不足",{icon:2});
                }else {
                  layer.msg("结账失败，请稍后重试",{icon:2});
                }

                   layer.close(index);

              }
          });

            });
          });
        }
      });



        }else{
          layer.close(index);
          layer.alert('密码错误',{icon:2})
        }

      });




    }else if(obj.event == 'new_add'){
         admin.popup({
        title:  '已有未结算订单时新增订单'
        ,area: ['800px', '600px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){

          view(this.id).render('app/workorder/new_dd', data).done(function(){
            //console.log(data);
            form.render(null,'layuiadmin-form-new-dd');
             $('#vip_id').val(data.person_id);
             $('#vip_name').val(data.name);
             $('#vip_phone').val (data.phone);
            //获取服务列表接口
             $.ajax({
               url: setter.http+'listServer/',
               type: 'GET',
               data:{'access_token':layui.data('layuiAdmin').access_token},
               error:function(data){
                  layer.msg("获取服务列表失败");
               },
               success:function(data){
                  //console.log(data);
                  if(data['code'] == 0){
                    var getTpl = demo.innerHTML
                    ,view = document.getElementById('server');
                    laytpl(getTpl).render(data, function(html){
                      view.innerHTML = html;
                    });
                    form.render('checkbox');
                  }else if(data['code'] == '1001'){
                    admin.exit();
                  }else{

                  }
                }
            });
//获取饮料列表接口
            $.ajax({
              url: setter.http+'listGood/',
              type: 'GET',
              data:{"title":"","label":"1",'access_token':layui.data('layuiAdmin').access_token}
              ,error:function(data){
                layer.msg("获取饮料列表失败");
              },
              success:function(data){
                //console.log(data);
                if(data['code'] == 0){
                  var getTpl = demo2.innerHTML
                  ,view = document.getElementById('drink');
                  laytpl(getTpl).render(data, function(html){
                    view.innerHTML = html;
                  });
                }else if(data['code'] == '1001'){
                    admin.exit();
                  }else{

                }
              }
            });

            //获取酒水列表接口
            $.ajax({
              url: setter.http+'listGood/',
              type: 'GET',
              data:{"title":"","label":"2",'access_token':layui.data('layuiAdmin').access_token}
              ,error:function(data){
                layer.msg("获取酒水列表失败");
              },
              success:function(data){
                //console.log(data);
                if(data['code'] == 0){
                  var getTpl = demo2.innerHTML
                  ,view = document.getElementById('wine');
                  laytpl(getTpl).render(data, function(html){
                    view.innerHTML = html;
                  });
                }else if(data['code'] == '1001'){
                    admin.exit();
                  }else{

                }
              }
            });

            //获取简餐列表接口
            $.ajax({
              url: setter.http+'listGood/',
              type: 'GET',
              data:{"title":"","label":"3",'access_token':layui.data('layuiAdmin').access_token}
              ,error:function(data){
                layer.msg("获取简餐列表失败");
              },
              success:function(data){
               //console.log(data);
                if(data['code'] == 0){

                  var getTpl = demo2.innerHTML
                  ,view = document.getElementById('snack');
                  laytpl(getTpl).render(data, function(html){
                    view.innerHTML = html;
                  });
                }else if(data['code'] == '1001'){
                    admin.exit();
                }else{

                }
              }
            });

            //获取火锅列表接口
            $.ajax({
              url: setter.http+'listGood/',
              type: 'GET',
              data:{"title":"","label":"4",'access_token':layui.data('layuiAdmin').access_token}
              ,error:function(data){
                layer.msg("获取火锅列表失败");
              },
              success:function(data){
                //console.log(data);

                if(data['code'] == 0){
                  var getTpl = demo2.innerHTML
                  ,view = document.getElementById('hot_pot');
                  laytpl(getTpl).render(data, function(html){
                    view.innerHTML = html;
                  });
                }else if(data['code'] == '1001'){
                    admin.exit();
                }else{

                }
              }
            });





          });

        }
      });

    }else if(obj.event == 'reback'){
       layer.prompt({
          formType: 1
          ,title: '敏感操作，请验证口令'
          }, function(value, index){
            if(value =='111111'){
          layer.close(index);
          layer.confirm('确定废弃该订单吗？', function(index) {

           $.ajax({
              //url: './json/workorder/ddje.js'
              url: setter.http+'delOrder/'
              ,type: 'get'
              ,data: {'order_serial_number':data['order_serial_number'],'access_token':layui.data('layuiAdmin').access_token}
              ,error:function(data){
                  layer.msg("订单废弃失败",{icon:2});
              }
              ,success: function(res){
                if(res['code'] == 0){
                  layer.msg("订单已废弃",{icon:1});
                  table.reload('LAY-app-workorder');
                }else if(res['code'] == '1001'){
                  admin.exit();
                }else{
                  layer.msg("订单废弃失败",{icon:2});
                }
                layer.close(index);

              }
          });


          });
        }else{
          layer.close(index);
          layer.alert('密码错误',{icon:2})
        }

      });
    }
  });

  exports('workorder', {})
});