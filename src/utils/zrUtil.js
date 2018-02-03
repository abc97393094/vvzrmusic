export function singer(val) {
  if(typeof val ==='string'){
    return val;
  }else if(val instanceof Array){
    let singer = '';
    val.forEach((item,index)=>{
      index<val.length-1?singer += item.name+' / ':singer += item.name;
    });
    return singer;
  }
}
export function musicmin(time) {
  return parseInt(time/60)+":"+(parseInt(time%60) < 10?"0"+parseInt(time%60):parseInt(time%60))
}
