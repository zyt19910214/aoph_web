/**

 @Name：layuiAdmin 营销
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */


layui.define(['table', 'form', 'laydate'], function(exports) {
  var $ = layui.$,
    admin = layui.admin,
    setter = layui.setter,
    view = layui.view,
    table = layui.table,
    laydate = layui.laydate,
    layer = layui.layer,
    form = layui.form;
  

  //商品管理
  table.render({
    elem: '#LAY-app-content-list'
    ,url: setter.http+'listGood/'

     //url: './json/content/good.js' //模拟接口
    ,where: {
      access_token: layui.data('layuiAdmin').access_token
    }

    ,cols: [
      [{
        type: 'checkbox',
      },{
        field: 'id',
        width: 100,
        title: '商品ID',
        sort: true,
        align: 'center'
      }, {
        field: 'name',
        title: '商品名称',
        minWidth: 100,
        align: 'center'
      }, {
        field: 'avatar',
        title: '预览图',
        minWidth: 100,
        align: 'center',
        templet: '#imgTpl'
      }, {
        field: 'price',
        title: '商品价格(元)',
        minWidth: 100,
        align: 'center'
      }, {
        field: 'origin_price',
        title: '商品原价(元)',
        minWidth: 100,
        align: 'center'
      }, {
        field: 'type',
        title: '商品分类',
        align: 'center'
      }, {
        field: 'status',
        title: '商品状态',
        templet: '#buttonTpl',
        minWidth: 80,
        align: 'center'
      }, {
        field: 'uploadtime',
        width: 170,
        title: '添加时间',
        sort: true,
        align: 'center'
      }, {
        title: '操作',
        minWidth: 150,
        align: 'center',
        toolbar: '#table-content-list'
      }]
    ],
    page: true,
    limit: 10,
    limits: [10, 15, 20, 25, 30],
    done: function(res) {
      data_len = res.data.length;
      if (data_len == 0) {
        var s = $('.layui-none').html('无商品数据')
      }
    },
    text: '对不起，加载出现异常！'
  });

    $.ajax({
          //url: './json/content/tags.js', //模拟接口
          url: setter.http + 'listServer/',
          type: 'GET',
          dataType:"json",
          error: function(data) {
            layer.alert("分类获取失败！", {
              icon: 2
            });

          },
          success: function(data) {
            d_value = data['data']
            console.log(d_value);
            for(var i=0;i<d_value.length;i++){
               $("#sss").append('<option value="' +d_value[i].id+'">'+d_value[i].name+'</option>')
            }
            form.render();
            var category = 0;
            var categoryName = '';
            form.on('select(category)', function (data) {
                category = data.value;
                categoryName = data.elem[data.elem.selectedIndex].text;
                form.render('select');
            });
          }
        });


  //监听搜索
  form.on('submit(LAY-app-contlist-search)', function(data) {
    var field = data.field;

    //执行重载
    table.reload('LAY-app-content-list', {
      where: field,
      page: 1
    });
  });

  var active = {
    batchdel: function() {
      var checkStatus = table.checkStatus('LAY-app-content-list'),
        checkData = checkStatus.data; //得到选中的数据

      if (checkData.length === 0) {
        return layer.msg('请选择数据', {
          icon: 5
        });
      }
      var l = []
      for (var i = 0; i < checkData.length; i++) {
        if(checkData[i]['status'] == 1){
          l.push(checkData[i]['id'])
        }else{

        }

      };

      if(l.length==0){
        layer.alert("所有商品均已下架，无需重复下架！", {
              icon: 2
            });
        }else{
          var dic = {};
      //    for (var i=0;i<checkData.length;i++)
      // {
      //  mycars.push(checkData[i]['id'])
      // }
      dic['checkData'] = l.toString()
      dic['access_token'] = layui.data('layuiAdmin').access_token

      layer.confirm('确定下架所有商品吗？', function(index) {
        $.ajax({
          url: setter.http + 'delGood/',
          type: 'POST',
          data: dic,
          error: function(request) {
            layer.alert("所有商品下架失败", {
              icon: 2
            });
          },
          success: function(data) {
            if (data['code'] == 0) {
              layer.msg('所有商品下架成功', {
                icon: 1
              });
              table.reload('LAY-app-content-list', {
                page: {
                  curr: $('.layui-laypage-curr em:eq(1)').text()
                }
              });

            } else if (data['code'] == '1001') {
              admin.exit();
            } else {
              layer.alert("所有商品下架失败!", {
                icon: 2
              });
            }
          }
        });

      });
        }
      
    },
     batchground: function() {
      var checkStatus = table.checkStatus('LAY-app-content-list'),
        checkData = checkStatus.data; //得到选中的数据

      if (checkData.length === 0) {
        return layer.msg('请选择数据', {
          icon: 5
        });
      }
      var l = []
      for (var i = 0; i < checkData.length; i++) {
        if(checkData[i]['status'] == 2){
          l.push(checkData[i]['id'])
        }else{

        }

      };

      if(l.length==0){
        layer.alert("所有商品均已上架，无需重复上架！", {
              icon: 2
            });
        }else{
          var dic = {};
      //    for (var i=0;i<checkData.length;i++)
      // {
      //  mycars.push(checkData[i]['id'])
      // }
      dic['checkData'] = l.toString()
      dic['access_token'] = layui.data('layuiAdmin').access_token

      layer.confirm('确定上架所有商品吗？', function(index) {
        $.ajax({
          url: setter.http + 'groundGood/',
          type: 'POST',
          data: dic,
          error: function(request) {
            layer.alert("所有商品上架失败", {
              icon: 2
            });
          },
          success: function(data) {
            if (data['code'] == 0) {
              layer.msg('所有商品上架成功', {
                icon: 1
              });
              table.reload('LAY-app-content-list', {
                page: {
                  curr: $('.layui-laypage-curr em:eq(1)').text()
                }
              });

            } else if (data['code'] == '1001') {
              admin.exit();
            } else {
              layer.alert("所有商品上架失败!", {
                icon: 2
              });
            }
          }
        });

      });
        }
      
    }

    //添加
    ,
    add: function(othis) {
      admin.popup({
        title: '添加商品',
        area: ['850px', '750px'],
        id: 'LAY-popup-content-add',
        success: function(layero, index) {
          view(this.id).render('app/content/listform').done(function() {
            form.render(null, 'layuiadmin-app-form-list');

            //监听提交
            form.on('submit(layuiadmin-app-form-submit)', function(data) {
              var field = data.field; //获取提交的字段
              field['access_token'] = layui.data('layuiAdmin').access_token
                //layer.alert(JSON.stringify(field));
                //提交 Ajax 成功后，关闭当前弹层并重载表格
              $.ajax({
                url: setter.http + 'addGood/',
                type: 'POST',
                data: field,
                error: function(request) { //请求失败之后的操作
                  layer.alert("商品添加失败", {
                    icon: 2
                  });
                },
                success: function(data) { //请求成功之后的操作
                  if (data['code'] == 0) {
                    layer.msg('商品添加成功', {
                      icon: 1
                    });
                    table.reload('LAY-app-content-list'); //重载表格
                  } else if (data['code'] == 2) {
                    layer.alert("商品已存在,添加失败!", {
                      icon: 2
                    });
                  } else if (data['code'] == 3) {
                    layer.alert("售价低于原价,添加失败!", {
                      icon: 2
                    });
                  } else if (data['code'] == '1001') {
                    admin.exit();
                  } else {
                    layer.alert("商品添加失败!222", {
                      icon: 2
                    });
                  }
                }

              });

              layer.close(index); //执行关闭
            });
          });
        }
      });
    },
    add3: function(othis) {
      ad = $("#ad_add").val()
      console.log("ad:  "+ad)
      if(ad == ''){
         layer.msg('公告不能为空，请输入公告内容！', {
         icon: 2
        });
      }else{
        field={}
        field['ad'] =ad
        $.ajax({
              url: setter.http + 'addAd/',
              type: 'POST',
              data: field,
              error: function(request) { //请求失败之后的操作
                layer.alert("公告添加失败！", {
                  icon: 2
                });
              },
              success: function(data) { //请求成功之后的操作
                if (data['code'] == 0) {
                   $("#ad_add").val('');
                  $("#ad").html("当前公告：　"+ad)
                  layer.msg('公告添加成功！', {
                    icon: 1
                  });
     
                  

                } else {
                  layer.alert("公告添加失败！", {
                    icon: 2
                  });
                }
              }

            });
      }
      
    }
  };

  $('.layui-btn.layuiadmin-btn-list').on('click', function() {
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });



  //监听工具条 --删除和编辑
  table.on('tool(LAY-app-content-list)', function(obj) {
    var data = obj.data;
    if (obj.event === 'del') {
      var dic = {};
      //console.log(data)
      if(data['status'] != 1){
        layer.alert("商品已下架，无需重复下架！", {
              icon: 2
            });
      }else{
            dic['checkData'] = data['id']
        dic['access_token'] = layui.data('layuiAdmin').access_token
        layer.confirm('确定下架此商品？', function(index) {
          $.ajax({
            url: setter.http + 'delGood/',
            type: 'POST',
            data: dic,
            error: function(request) {
              layer.alert("商品下架失败", {
                icon: 2
              });
            },
            success: function(data) {
              if (data['code'] == 0) {

                layer.msg('商品下架成功', {
                  icon: 1
                });
                table.reload('LAY-app-content-list', {
                  page: {
                    curr: $('.layui-laypage-curr em:eq(1)').text()
                  }
                });
              } else if (data['code'] == '1001') {
                admin.exit();
              } else {
                layer.alert("商品下架失败!", {
                  icon: 2
                });
              }
            }
          });
          layer.close(index);
        });
      }
  
    } else if (obj.event === 'edit') {
      admin.popup({
        title: '编辑商品',
        area: ['550px', '550px'],
        id: 'LAY-popup-content-edit',
        success: function(layero, index) {
          view(this.id).render('app/content/listform', data).done(function() {
            //console.log(data);
            form.render(null, 'layuiadmin-app-form-list');

            //监听提交
            form.on('submit(layuiadmin-app-form-submit)', function(data) {
              var field = data.field; //获取提交的字段
              field['access_token'] = layui.data('layuiAdmin').access_token
                //layer.alert(JSON.stringify(field));
                //提交 Ajax 成功后，关闭当前弹层并重载表格
              if (parseInt(field['add_count']) < 0) {
                layer.msg("失败！上货数量不能为负数", {
                  icon: 2
                });
              } else {
                $.ajax({
                  url: setter.http + 'editGood/',
                  type: 'POST',
                  data: field,
                  error: function(request) { //请求失败之后的操作
                    layer.alert("更新失败", {
                      icon: 2
                    });
                  },
                  success: function(data) { //请求成功之后的操作
                    if (data['code'] == 0) {
                      table.reload('LAY-app-content-list'); //重载表格
                      layer.msg('更新成功', {
                        icon: 1
                      });
                    } else if (data['code'] == 2) {
                      layer.alert("商品已存在,更新失败!", {
                        icon: 2
                      });
                    } else if (data['code'] == 3) {
                      layer.alert("售价低于原价,请重新更新!", {
                        icon: 2
                      });
                    } else if (data['code'] == '1001') {
                      admin.exit();
                    } else {
                      layer.alert("更新失败!", {
                        icon: 2
                      });
                    }
                  }
                });

              }

              layer.close(index); //执行关闭
            });
          });
        }
      });
    }else if(obj.event === 'ground'){
      var dic = {};
      //console.log(data)
      if(data['status'] == 1){
        layer.alert("商品已上架，无需重复上架！", {
              icon: 2
            });
      }else{
        dic['checkData'] = data['id']
        dic['access_token'] = layui.data('layuiAdmin').access_token
        layer.confirm('确定上架此商品？', function(index) {
          $.ajax({
            url: setter.http + 'groundGood/',
            type: 'POST',
            data: dic,
            error: function(request) {
              layer.alert("商品上架失败", {
                icon: 2
              });
            },
            success: function(data) {
              if (data['code'] == 0) {

                layer.msg('商品上架成功', {
                  icon: 1
                });
                table.reload('LAY-app-content-list', {
                  page: {
                    curr: $('.layui-laypage-curr em:eq(1)').text()
                  }
                });
              } else if (data['code'] == '1001') {
                admin.exit();
              } else {
                layer.alert("商品上架失败!", {
                  icon: 2
                });
              }
            }
          });
          layer.close(index);
        });
      }

    }
  });


  //分类列表
  table.render({
    elem: '#LAY-app-content-comm',
    url: setter.http + 'listServer/'
      //,url: './json/content/server.js' //模拟接口
      ,
    where: {
      access_token: layui.data('layuiAdmin').access_token
    },
    cols: [
      [{
        type: 'checkbox',
      }, {
        field: 'name',
        title: '分类名称',
        minWidth: 100
      }, {
        field: 'sort',
        title: '分类排序'
      }, {
        title: '操作',
        minWidth: 150,
        align: 'center',
        toolbar: '#table-content-com'
      }]
    ],
    page: true,
    limit: 10,
    limits: [10, 15, 20, 25, 30],
    done: function(res) {
      data_len = res.data.length;
      if (data_len == 0) {
        var s = $('.layui-none').html('无分类数据')
      }
    },
    text: '对不起，加载出现异常！'
  });

  //监听工具条
  table.on('tool(LAY-app-content-comm)', function(obj) {
    var data = obj.data;
    if (obj.event === 'del') {
      var dic = {};
      dic['checkData'] = data['id']
      dic['access_token'] = layui.data('layuiAdmin').access_token
      layer.confirm('确定删除此分类？', function(index) {
        $.ajax({
          url: setter.http + 'delServer/',
          type: 'POST',
          data: dic,
          error: function(request) {
            layer.alert("分类删除失败", {
              icon: 2
            });
          },
          success: function(data) {
            if (data['code'] == 0) {

              layer.msg('分类删除成功', {
                icon: 1
              });
              table.reload('LAY-app-content-comm', {
                page: {
                  curr: deleteJumpPage(obj)
                }
              });
            } else if (data['code'] == '1001') {
              admin.exit();
            } else {
              layer.alert("分类删除失败!", {
                icon: 2
              });
            }
          }
        });
        layer.close(index);
      });
    } else if (obj.event === 'edit') {
      admin.popup({
        title: '编辑分类',
        area: ['400px', '250px'],
        id: 'LAY-popup-content-edit',
        success: function(layero, index) {
          view(this.id).render('app/typeInfo/listform', data).done(function() {
            console.log(data);
            form.render(null, 'layuiadmin-form-comment');


            //监听提交
            form.on('submit(layuiadmin-app-com-submit)', function(data) {
              var field = data.field; //获取提交的字段
              field['access_token'] = layui.data('layuiAdmin').access_token
                //layer.alert(JSON.stringify(field));

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              $.ajax({
                url: setter.http + 'editServer/',
                type: 'POST',
                data: field,
                error: function(request) {
                  layer.alert("分类修改失败", {
                    icon: 2
                  });
                },
                success: function(data) {
                  if (data['code'] == 0) {
                    layer.msg('分类编辑成功', {
                      icon: 1
                    });
                    table.reload('LAY-app-content-comm');
                  } else if (data['code'] == 2) {
                    layer.msg('无变化，无需更新', {
                      icon: 1
                    });
                  } else if (data['code'] == '1001') {
                    admin.exit();
                  } else {
                    layer.alert("分类编辑失败!", {
                      icon: 2
                    });
                  }
                }
              });
              layui.table.reload('LAY-app-content-comm'); //重载表格
              layer.close(index); //执行关闭
            });
          });
        }
      });
    }
  });
  //监听搜索
  form.on('submit(LAY-app-contcomm-search)', function(data) {
    var field = data.field;

    //执行重载
    table.reload('LAY-app-content-comm', {
      where: field,
      page: 1
    });
  });

  //点击事件
  var active2 = {
    batchdel2: function() {
      var checkStatus = table.checkStatus('LAY-app-content-comm'),
        checkData = checkStatus.data; //得到选中的数据

      if (checkData.length === 0) {
        return layer.msg('请选择数据');
      }
      var l = []
      for (var i = 0; i < checkData.length; i++) {
        l.push(checkData[i]['id'])
      };
      var mycars = checkData[0]['id']

      var dic = {};

      dic['checkData'] = l.toString()
      dic['access_token'] = layui.data('layuiAdmin').access_token
      layer.confirm('确定删除吗？', function(index) {

        $.ajax({
          url: setter.http + 'delServer/',
          type: 'POST',
          data: dic,
          error: function(request) {
            layer.alert("分类删除失败", {
              icon: 2
            });
          },
          success: function(data) {
            if (data['code'] == 0) {
              layer.msg('分类删除成功', {
                icon: 1
              });
              table.reload('LAY-app-content-comm', {
                page: {
                  curr: deleteDulJumpPage(checkStatus)
                }
              });

            } else if (data['code'] == '1001') {
              admin.exit();
            } else {
              layer.alert("分类删除失败!", {
                icon: 2
              });
            }
          }
        });
      });
    },
    add2: function(othis) {
      admin.popup({
        title: '添加分类',
        area: ['400px', '250px'],
        id: 'LAY-popup-content-add',
        success: function(layero, index) {
          view(this.id).render('app/typeInfo/listform').done(function() {
            form.render(null, 'layuiadmin-form-comment');

            //监听提交
            form.on('submit(layuiadmin-app-com-submit)', function(data) {
              var field = data.field; //获取提交的字段
              //layer.alert(JSON.stringify(field));
              field['access_token'] = layui.data('layuiAdmin').access_token
              $.ajax({
                url: setter.http + 'addServer/',
                type: 'POST',
                data: field,
                error: function(request) { //请求失败之后的操作
                  layer.alert("分类添加失败", {
                    icon: 2
                  });
                },
                success: function(data) { //请求成功之后的操作
                  if (data['code'] == 0) {
                    layer.msg('分类添加成功', {
                      icon: 1
                    });
                    table.reload('LAY-app-content-comm'); //重载表格
                  } else if (data['code'] == 2) {
                    layer.alert("分类或排序已存在，请修改后重新添加！", {
                      icon: 2
                    });
                  } else if (data['code'] == '1001') {
                    admin.exit();
                  } else {
                    layer.alert("分类添加失败!", {
                      icon: 2
                    });
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

  $('.layui-btn.layuiadmin-btn-comm').on('click', function() {
    var type = $(this).data('type');
    active2[type] ? active2[type].call(this) : '';
  });

  function deleteJumpPage(obj) {
    // 获取当前页码   console.log(obj.tr[0]);// 获取行数据内容
    var curr = $('.layui-laypage-curr em:eq(1)').text();
    //console.log(curr);
    // 获取tr的data-index属性的值验证是否是当前页的第一条
    var s = $('.layui-table tbody tr').length;
    console.log(s);
    var dataIndex = $(obj.tr[0]).attr("data-index");
    // 如是当前页的第一条数据,curr-1
    if (dataIndex == 0 && s == 3) {
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



  exports('contlist', {})
});