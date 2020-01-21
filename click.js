exports.choose = function () {

    const { ipcMain, dialog } = require('electron')
    ipcMain.on('open-file-dialog', (event) => {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }, (files) => {
            if (files) {
                event.sender.send('text', files);
            }
        })
    })
}

function walk(dir) {
    var fs = require("fs")
    var children = []
    fs.readdirSync(dir).forEach(function (filename) {
        var path = dir + "\\" + filename
        var stat = fs.statSync(path)
        if (stat && stat.isDirectory()) {
            children = children.concat(walk(path))
        }
        else {
            children.push(path)
        }
    })


    return children

}
exports.walk = walk;


exports.createJSON = function (children) {
    var fs = require('fs')
    var path_1 = require('path')
    var data = []
    var path = document.getElementById("text").innerHTML + "\\info.json"
    console.log(path)
    for (var i = 0; i < children.length; i++) {
        if (children[i] != path) {
            var obj = {
                name: children[i],
                time: "",
                type: "",
                area1: "",
                area2: "",
                keyword: ""
            }
            data.push(obj)
        }
    }


    // filter(data)
    /*  var content=JSON.stringify(data)
       var file=path_1.join(__dirname,'info.json')
       fs.writeFile(file,content,function(err){
           if(err){
               alert(err)
           }
           alert("文件创建成功 ，地址："+file)
       })*/
    return data


}
function filter(objcArray) {
    for (var i = 0; i < objcArray.length; i++) {
        for (var j = i + 1; j < objcArray.length;) {
            if (objcArray[i].name == objcArray[j].name) { //通过id属性进行匹配；
                objcArray.splice(j, 1); //去除重复的对象；
            } else {
                j++;
            }
        }
    }
    return objcArray;


}

exports.insertJSON = function (params) {
    var fs = require('fs')
    var path_1 = require('path')
    var person = []

    fs.readFile("./resources/app/info.json", function (err, data) {
        if (err) {
            return console.error(err);
        }


        //将二进制的数据转换为字符串
        if (data == null) {
            data = '[]';
        }
        person = JSON.parse(data.toString());//将字符串转换为json对象
        for (var i = 0; i < params.length; i++) {
            person.push(params[i]);//将传来的对象push进数组对象
        }
        filter(person)
        var content = JSON.stringify(person)
        var file = path_1.join(__dirname, "info.json")
        fs.writeFile(file, content, function (err) {
            if (err) {
                alert(err)
            }
            //  window.close()
        })

    })





}

exports.saveToJSON = function () {
    var fs = require('fs')
    var path_1 = require('path')
    var person = []
    fs.readFile("./resources/app/info.json", function (err, data) {
        if (err) {
            return console.error(err)
        }
        person = JSON.parse(data.toString())
        var content = JSON.stringify(person)
        if (document.getElementById("text").innerHTML == "") {
            alert("请确保选择好文件夹后再进行保存！")
        } else {


            var file = document.getElementById("text").innerHTML + "//info.json"

            fs.writeFile(file, content, function (err) {
                if (err) {
                    alert(err)
                }
                alert("保存成功！可以在别的终端进行导入！")
            })
        }
    })

}

exports.editJSON = function (strs) {
    var fs = require('fs')
    var path_1 = require('path')
    var person = []
    fs.readFile("./resources/app/info.json", function (err, data) {
        if (err) {
            return console.error(err)
        }
        //  console.log(data.toString())
        person = JSON.parse(data.toString())
        for (var i = 0; i < person.length; i++) {
            if (strs[0] == person[i].name) {
                console.log("id一样")
                person[i].time = strs[1]
                person[i].type = strs[2]
                person[i].area1 = strs[3]
                person[i].area2 = strs[4]
                person[i].keyword = strs[5]
            }
        }
        var content = JSON.stringify(person)
        var file = path_1.join(__dirname, "info.json")
        fs.writeFile(file, content, function (err) {
            if (err) {
                alert(err)
            }

        })


    })

}
exports.importJSON = function () {

    (function () {
        $.ajax({
            url: "info.json",//向本地的json文件发送请求
            type: "GET",
            dataType: "json",
            success: function (data) {
                var i;

                document.getElementById("box").innerHTML = `      <tbody><tr>
  
							
                <th>文件</th>
                <th>时间</th>
                <th>文件类型</th>
                <th>一级行业</th>
                <th>二级行业</th>
                <th>关键字</th>
                <th>操作</th>
                
                
            </tr>
            </tbody>
            `
                console.log(data)
                var html = document.getElementById("box").innerHTML;

                for (i = 0; i < data.length; i++) { //用for循环遍历数组将数据存入html变量中

                    html += `<tr>
                            <td class="haha">${data[i].name}</td>
                            <td>${data[i].time}</td>
                            <td>${data[i].type}</td>
                            <td>${data[i].area1}</td>
                            <td>${data[i].area2}</td>
                            <td>${data[i].keyword}</td>
                            <td class="editfile"><a >编辑</a></td>
                            </tr>`;
                }
                document.getElementById("box").innerHTML = html;
                const { shell } = require('electron');
                $("td.haha").on("click", function (e) {

                    var path1 = $(e.target).text();

                    shell.openItem(path1);
                })



                $('td.editfile').on("click", function (e) {
                    var currentRow = $(this).parent().prevAll().length + 1;//行号
                    var storeID = document.getElementById('box')
                    var length = document.getElementById('box').rows.item(0).cells.length
                    var data = []
                    for (var n = 0; n < length - 1; n++) {
                        var text = storeID.rows[currentRow].cells[n].innerHTML
                        data.push(text)
                    }
                    console.log(data)
                    $("td.editfile").fancybox({

                        'width': 733,
                        'height': 530,
                        'type': 'iframe',
                        'hideOnOverlayClick': false,
                        'showCloseButton': true,
                        'onStart': function () {


                            window.location.href = "edit.html?name=" + data[0] + "&time=" + data[1] + "&type=" + data[2] + "&area1=" + data[3] + "&area2=" + data[4]
                        },
                        'onclosed': function () {
                            window.location.href = "house_edit.html"
                        }


                    });
                })
                /*
                const { BrowserWindow } = require('electron').remote
                const path = require('path')
                const url=encodeURI("edit.html?name="+data[0]+"&dutyon="+data[1]+"&type="+data[2]+"&state="+data[3])
                const modalPath = path.join('file://', __dirname, url)
                let win = new BrowserWindow({ width: 400, height: 320 })

                win.on('close', () => { win = null })
                win.loadURL(modalPath)
                win.show()
                 */






            },
            error: function () {
                alert('caonima')
            }
        })
    })();

    /*
        var i;
        document.getElementById("box").innerHTML=`      <tbody><tr>
      
                            	
        <th>文件</th>
        <th>承包单位</th>
        <th>文件类型</th>
        <th>状态</th>
        <th>操作</th>
        
        
    </tr>
    `
    
    
              
    
         var html=document.getElementById("box").innerHTML;    
    
        for (i = 0 ; i < data.length; i++) { //用for循环遍历数组将数据存入html变量中
                      html +=` <tr>
                              <td id="haha">${data[i]} </td>
                              <td> 66</td>
                              <td> 666</td>
                              <td> 66</td>
                              <td><a href="edit.html" class="edit">编辑</a></td>
                              </tr>`;
                  }
                  document.getElementById("box").innerHTML = html;
                  
                const {shell} = require('electron'); 
                $("td#haha").on("click",function(e){
                    
                    var path1 = $(e.target).text();
      
                    shell.openItem(path1);
                  // shell.openItem(path1);
    
                })
                
              */
}

