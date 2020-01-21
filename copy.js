const {ipcRenderer} =require('electron');
const selectDirBtn=document.getElementById("copy-directory")
selectDirBtn.addEventListener('click',(event)=>{
    ipcRenderer.send('copy-file-dialog')
})

ipcRenderer.on('copied-directory',(event,path)=>{
    layui.use('table',function(){
        var table=layui.table
        const fs = require('fs');
        const path_1= require('path');
        var data = JSON.parse(JSON.stringify(table.cache.demodemo))
        
        
        for (var i = 0; i < data.length; i++) {
            var fileName = data[i].name
          
        
            var sourceFile = path_1.join(path_1.dirname(fileName), path_1.basename(fileName));
            var destPath = path_1.join(`${path}`,  path_1.basename(fileName));
            
            var readStream = fs.createReadStream(sourceFile);
            var writeStream = fs.createWriteStream(destPath);
            readStream.pipe(writeStream);
           
        }
        
        alert("复制完成！")
    })


})