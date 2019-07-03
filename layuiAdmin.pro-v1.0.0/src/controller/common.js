/**

 @Name：layuiAdmin 公共业务
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define(function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin

  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行

  //退出
  admin.events.logout = function(){
    /*//执行退出接口
    admin.req({
      url: './json/user/logout.js'
      ,type: 'get'
      ,data: {}
      ,done: function(res){ //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行

        //清空本地记录的 token，并跳转到登入页
        admin.exit();
      }
    });*/
    //执行退出接口执行退出接口
     $.ajax({
       url: setter.http+'managerLogout/',
       type: 'GET',
       data: {access_token: layui.data('layuiAdmin').access_token},
       error:function(res){
          layer.msg("异常,退出失败！");
       },
       success:function(res){
        if(res['code'] == '0'){
           admin.exit();
         }else{
          layer.msg("异常,退出失败！");
         }
        }
    });

  };

  //对外暴露的接口
  exports('common', {});
});