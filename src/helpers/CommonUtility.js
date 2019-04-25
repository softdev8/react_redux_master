module.exports = {
  downloadFile(e){
    var link = document.createElement("a");
    var path = e.currentTarget.id
    var index = path.lastIndexOf("/");
    var name = path.substr(index+1);
    link.download = name;
    link.href = path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  checkImageExt(ext){
    let img_ext = ["png", "jpeg", "gif"];
    if(img_ext.includes(ext)){
      return true
    }
  }
}
