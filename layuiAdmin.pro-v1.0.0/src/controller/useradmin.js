/**

 @Name：layuiAdmin  会员管理
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,setter = layui.setter
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form
  ,laytpl = layui.laytpl;

  //用户管理-列表
  table.render({
    elem: '#LAY-user-manage'
   ,url: setter.http+'listVipPerson/'
   //,url: './json/useradmin/webuser.js' //模拟接口
   ,where: {
    access_token: layui.data('layuiAdmin').access_token
  }
    ,cols: [[
      {field: 'id', width: '8%', title: '会员ID', sort: true, align:'center'}
      ,{field: 'vip_name',width:'10%', title: '用户名', align:'center'}
      ,{field: 'vip_sex', width: '8%', title: '性别' ,sort: true, align:'center'}
      ,{field: 'vip_phone', width: '12%',title: '手机', align:'center'}
       ,{field: 'vip_person_point',width: '10%', title: '积分', sort: true, align:'center'}
      ,{field: 'vip_notes', width: '20%', title: '备注', align:'center'}
      ,{title: '操作', width: '28%',  minWidth:250, align:'center', toolbar: '#table-useradmin-webuser'}
    ]]
    ,page: true
    ,done:function (res) {
      if(res['code'] == '1001'){

        admin.exit();
      }
      data_len = res.data.length;
      if(data_len == 0){
        var s = $('.layui-none').html('无会员数据')

      }
    }
    //,height: 'full-320'
    ,text: '对不起，加载出现异常！'
  });


  form.render(null, 'layadmin-userfront-formlist');

  //监听搜索
  form.on('submit(LAY-user-front-search)', function(data){
    var field = data.field;
    console.log(field);

    //执行重载
    table.reload('LAY-user-manage', {
      where: field,
      page:1,
      done:function(res,curr,count){
         data_len = res.data.length;
      if(data_len == 0){
        var s = $('.layui-none').html('未查询到会员数据')

      }

      }
    });

  });


  //监听工具条 - 删除
  table.on('tool(LAY-user-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      var dic ={};
      dic['checkData'] =data['id']
      dic['access_token'] = layui.data('layuiAdmin').access_token
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        if(value =='111111'){
          layer.close(index);
          layer.confirm('确定删除吗？', function(index) {

          $.ajax({
             url: setter.http+'delVipPerson/',
             type: 'POST',
             data: dic ,
             error:function(request){
                layer.alert("删除失败",{icon: 2});
             },
             success:function(data){
                if(data['code'] == 0){

                  layer.msg('删除成功', {icon: 1});
                  table.reload('LAY-user-manage', {
                                page: {
                                    curr: deleteJumpPage(obj)
                                }
                             });
                }else if(data['code'] == 2){
                  layer.alert("会员存在未结算订单，无法删除!",{icon: 2});
                }else if(data['code'] == '1001') {

                 admin.exit()
                }else {
                  layer.alert("删除失败!",{icon: 2});
                }
              }
          });



          });
        }else{
          layer.close(index);
          layer.alert('密码错误',{icon:2})
        }

      });

  //监听工具条 - 编辑
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑用户'
        ,area: ['500px', '450px']
        ,id: 'LAY-popup-user-edit'
        ,success: function(layero, index){
          view(this.id).render('user/user/userform', data).done(function(){
            form.render(null, 'layuiadmin-form-useradmin');

            $('#id').val(data.id);
            $('#desc').val(data.vip_notes);
            //console.log(data);
            //监听提交
            form.on('submit(LAY-user-front-submit)', function(data){
              var field = data.field; //获取提交的字段
              field['access_token'] = layui.data('layuiAdmin').access_token
              //提交 Ajax 成功后，关闭当前弹层并重载表格
              $.ajax({
                url: setter.http+'editVipPerson/',
                type: 'POST',
                data:field,
                error:function(request){//请求失败之后的操作
                    layer.alert("更新失败",{icon: 2});
                },
                success:function(data){//请求成功之后的操作
                    if(data['code'] == 0){
                      layer.msg('更新成功', {icon: 1});
                      table.reload('LAY-user-manage'); //重载表格
                    }else if(data['code'] == 2){
                      layer.alert("手机号已存在,更新失败!",{icon: 2});
                    }else if(data['code'] == '1001') {
                      layer.close(index); //执行关闭
                      admin.exit()
                    }else {
                      layer.alert("更新失败!",{icon: 2});
                    }
                }
              });
              layer.close(index); //执行关闭
            });
          });
        }
      });

  //监听工具条 - 添加订单
    }else if(obj.event === 'add'){
      admin.popup({
        title:  '生成订单'
        ,area: ['800px', '550px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){

          view(this.id).render('app/workorder/dd', data).done(function(){
            console.log(data);
            form.render(null,'layuiadmin-form-dd');
             $('#vip_id').val(data.id);
             $('#vip_name').val(data.vip_name);
             $('#vip_phone').val(data.vip_phone);

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
                    layer.close(index); //执行关闭
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
                    layer.close(index); //执行关闭
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
                    layer.close(index); //执行关闭
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
                    layer.close(index); //执行关闭
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
                    layer.close(index); //执行关闭
                    admin.exit();
                }else{

                }
              }
            });




          });


        }
      });
    }
  });

  //表格上方添加和删除
  var active = {
    batchdel: function(){
      var checkStatus = table.checkStatus('LAY-user-manage')
      ,checkData = checkStatus.data; //得到选中的数据

      if(checkData.length === 0){
        return layer.msg('请选择数据',{icon:5});
      }

      var l= []
      for (var i =0;i<checkData.length; i++) {
          l.push(checkData[i]['id'])
      };
      var mycars=checkData[0]['id']

      var dic ={};
   //    for (var i=0;i<checkData.length;i++)
      // {
      //  mycars.push(checkData[i]['id'])
      // }
      dic['checkData'] = l.toString()
      dic['access_token'] = layui.data('layuiAdmin').access_token
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        if(value =='111111'){
          layer.close(index);
          layer.confirm('确定删除吗？', function(index) {

          //执行 Ajax 后重载
          $.ajax({
             url: setter.http+'delVipPerson/',
             type: 'POST',
             data: dic ,
             error:function(request){
                layer.alert("删除失败",{icon: 2});
             },
             success:function(data){
                if(data['code'] == 0){
                  layer.msg('删除成功', {icon: 1});
                    table.reload('LAY-user-manage', {
                                page: {
                                    curr: deleteDulJumpPage(checkStatus)
                                }

                    });
                }else if(data['code'] == 2){
                  layer.alert("会员存在未结算订单，无法删除!",{icon: 2});
                }else if(data['code'] == '1001') {

                 admin.exit()
                }else  {

                  layer.alert("删除失败!",{icon: 2});
                }
              }
            });
          });
        }else{
          layer.close(index);
          layer.alert('密码错误',{icon:2})
        }

      });
    }
    ,add: function(){
      admin.popup({
        title: '添加用户'
        ,area: ['500px', '450px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('user/user/userform').done(function(){
            form.render(null, 'layuiadmin-form-useradmin');

            //监听提交
            form.on('submit(LAY-user-front-submit)', function(data){
              var field = data.field; //获取提交的字段
              field['access_token'] = layui.data('layuiAdmin').access_token
              //console.log(field);
              //提交 Ajax 成功后，关闭当前弹层并重载表格
              $.ajax({
                url: setter.http+'addVipPerson/',
                type: 'POST',
                data:field,

                error:function(request){//请求失败之后的操作
                    layer.alert("添加失败",{icon: 2});
                },
                success:function(data){//请求成功之后的操作
                    if(data['code'] == 0){
                      layer.msg('添加成功', {icon: 1});
                      table.reload('LAY-user-manage'); //重载表格
                    }else if(data['code'] == 2){
                      layer.alert("手机号已存在,添加失败!",{icon: 2});
                    }else if(data['code'] == '1001'){
                      admin.exit()
                    }else {
                      layer.alert("添加失败!",{icon: 2});
                    }
                }

               });

              layer.close(index); //执行关闭
            });
          });
        }
      });
    }
  };

  $('.layui-btn.layuiadmin-btn-useradmin').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });


 function deleteJumpPage(obj){
        // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
        var curr = $('.layui-laypage-curr em:eq(1)').text();
        //console.log(curr);
        // 获取tr的data-index属性的值验证是否是当前页的第一条
        var s = $('.layui-table tbody tr').length;
        console.log(s);
        var dataIndex = $(obj.tr[0]).attr("data-index");
        // 如是当前页的第一条数据,curr-1
        if (dataIndex == 0 && s == 3 ) {
            curr = curr == 1 ? curr : curr - 1
        }
        //console.log(curr);
        return curr;
  }
   // 批量删除返回跳转
    function deleteDulJumpPage(checkStatus) {
    var curr = $('.layui-laypage-curr em:eq(1)').text(); // 获取当前页码
    //console.log(curr);// 获取行数据内容
    //console.log(checkStatus);
    //console.log(checkStatus.isAll)
    if (checkStatus.isAll) {
        curr = curr == 1 ? curr : curr - 1
    }
    return curr; // 返回curr
}

  exports('useradmin', {})
});

