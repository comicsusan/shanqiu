//山模型;
let mimg;
let ging;
let mounInfos=[];
let moun0;
let moun1;
let moun2;



//about grass
let num, g=[];

//about tree
let level =5; // This sketch is highly consuming processing power. Depending on your PC graphics card capability set it higher (more speed and details) or lower.
let t=[];
let treeInfos=[];

let cloudInfos=[];


//用户坐标
var clat=0 ;
var clon=0 ;
var zom =14;


let font;


var viwe;
var islandPois;
var mountainsPois;
var valleyPois;


function preload() {
  navigator.geolocation.getCurrentPosition((position) => {
    clat = position.coords.latitude;
    clon = position.coords.longitude;
  }
  );
 

  //获取中心坐标设定范围内景物坐标
 loadJSON('https://restapi.amap.com/v3/geocode/regeo?location='+
    clon+
    ','+
    clat+
    '&key=a3786df8344a3ac3779726effc973a94&radius=3000&poitype=岛屿|山|丘陵|山地|山脉&extensions=all', gotData);


  mimg = loadImage('picture/019.png');
  gimg = loadImage('picture/022.png');
  moun0=loadModel('mountain_Mode/mou_005.obj');
  moun1=loadModel('mountain_Mode/mou_006.obj');
  moun2=loadModel('mountain_Mode/mou_007.obj');
  
  font = loadFont('picture/inconsolata.otf');
  //let ms=[,'mountain_Mode/mou_006.obj','mountain_Mode/mou_007.obj']
}

let mounMod=[];

function gotData(data) {
  viwe=data;
  // console.log(viwe);
}



function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  normalMaterial();
  describe('Camera orbits around a box when mouse is hold-clicked & then moved.');
  
  
 


  //about mountain
  generateMounInfos();
  mounMod[0]=moun0;
  mounMod[1]=moun1;
  mounMod[2]=moun2;

  //about grass
  num = min(width, height)/2;
  for (let i = 0; i < 500; i++) {
    g.push(new grass(i))
  }

  //aboout tree
  generateTreeInfos();
  randomize();
  t= new Node(sl, ss, rr, 0);

  generateCloudInfos();
  
  
}

function draw() {
  
  ambientLight(255, 255, 255);
  background('#a0947a');
  orbitControl(1, 0, 1);
  //orbitControl();
  
  //position
  textFont(font);
  textSize(32);
  textAlign(RIGHT, TOP);
  fill(0);
  text('Current position: ' + nf(clat,2,2) + ' ' + nf(clon,2,2), -width*0.3, -height*0.5);
 


  translate(0, 60, 0);
  rotateX(PI/2);
  //plane(3000,3000);
  texture(gimg);
  noStroke();
  //normalMaterial(255);
  plane(5000, 5000);



  var cx = mercX(clon);
  var cy = mercY(clat);
  //fill(0,0,255,200);
  //box(50);



  //

  var mountainsCount=viwe.status;

  if (mountainsCount==1) {
    var mountainsPois=viwe["regeocode"].pois;
    for (var m=0; m<mountainsPois.length; m++) {
      var mountainsLonlat=mountainsPois[m].location.split(',');
      var mountainsLon=mountainsLonlat[0];
      var mountainsLat=mountainsLonlat[1];
      var mx=mercX(mountainsLon) - cx;
      var my=mercY(mountainsLat) - cy;

      //about mount
      push();
      translate(mx, my);
      drawMoun(mounInfos[m]);
      pop();

      //about tree
      push();
      rotateX(PI*-0.5);
      translate(mx, 0, my);//rotateX(PI*-0.5);
      for (var j=0; j<2; j++) {
        drawTree(treeInfos[j]);
        translate(sin(j)*50, 0, cos(j)*50);
      }
      pop();


      //about grass
      push();
      rotateX(3*PI/2);
      //rotateY(PI/2);
      translate(mx, -20, my);
      for (let i = 0; i < 500; i++) {
        g[i].draw()
      }
      pop();

      //about cloud
      push();
      translate(mx, my);
      for (let i=0; i<500; i++) {
        drawCloud(cloudInfos[i]);
      }
      pop();

    }
  } else {
    console.log("nomountains");
  }

}

function drawMoun(infoObj){
  push();
  //translate(infoObj.x, 0,infoObj.z);
  translate(0,0, -infoObj.height);
  rotateX(PI/2);
  rotateY(PI*infoObj.t);
  texture(mimg);
  //scale(1);
  model(mounMod[infoObj.t]);
  pop();
}

function genMounInfo(){
  return{
    //x:random(800),
    //y:0,
    //z:random(500),
    width:random (20,50),
    height:random(50,50),
    depth:random(20,80),
    t:int(random(-1,3))
  };
}

function  generateMounInfos(){
  for(var i=0;i<20;i++){
    mounInfos.push(genMounInfo());
  }
}

function grass(i) {
  this.n = random(width /50, width/15 )
  this.draw = function() {
  let x = cos(TAU / num * i  ) * this.n
    let y = 0
    let z = sin(TAU / num * i ) * this.n
    //rotateX(PI/2);
    
    push()
   
    //fill(0, map(z, -width / 3.2, width / 3.2, 24, 216), 0)
    noFill();
    translate(x, y, z);
    scale(0.5);
    stroke('#23e15d');
    strokeWeight(0.1);
    curve(100, 30,0, 50, 30,0, -10, 80,0, 100, 50,0);
    curve(30, 20,0, 70, 26,0, 30, 70,0, 50, 100,0);
    //triangle(-this.w / 2, 0, this.w / 2, 0, map(sin(this.a ), -1, 1, -this.w, this.w), -this.h)
    pop()
  }
}

//lood different 
 function drawTree(infoObj){
  push();
  //translate(infoObj.x, 0,infoObj.z);
  translate(0, -infoObj.height,0);
  scale(infoObj.s);
  rotateY(PI*infoObj.m);
  //texture(img);
  t[infoObj.m]=t.draw()
  pop();
}

function genTreeInfo(){
  return{
    //x:random(800),
    //y:0,
    //z:random(500),
    width:random (20,50),
    height:random(-10,30),
    depth:random(20,80),
    s:random(0.3,0.8),
    m:random(-1,10)
  };
}
  
function  generateTreeInfos(){
  for(var i=1;i<20;i++){
    treeInfos.push(genTreeInfo());
  }
}




function randomize() {
  ml = level // maximum level
  rsa = random(TWO_PI) // random start angle 
  //bgc = color(random(255), random(40, 70), 255) // background color
  //swc = color(random(255), random(40, 70), 255) // side walk color
  bhv = random(0, 100) // branch hue value
  lhv = random(0, 360) // leaf hue value
  lsv = random(0, 360) // leaf saturation value
  fhv = 70; // flower hue value
  while (fhv > 70 && fhv < 170) fhv = random(360)
  fc = color(fhv, random(0, 255), 255) // flower color
  rr = random(20, 80) // rotatian range
  sl = random(10, 50) // start length
  ss = random(2, 5) // start size
  rl = random(0.0, 0.5) // random length
  sd = random(0.5, 0.6) // size decay
  ld = map(sl, 10,30, 1.1, 0.85) // length decay
  ll = int(random(0, 5)) // leaf level
  bwr = random(0.01, 0.9) // bloom width ratio
  lsa = random(10, 15) // // leaf size average
  fw = random(2, 5) // flower width
  fh = random(5, 8) // flower height
}



class Node {
  constructor(_len, _size, _rot_range, _level) {
    this.z = random(-30, 30)
    this.len = _len
    this.size = _size
    this.rr = _rot_range // rotatian range
    this.level = _level
    this.lc = color(lhv, lsv, random(100, 255)) // leaf color
    this.len = this.len * (1 + random(-rl, rl))
    this.rot = radians(random(-this.rr, this.rr)) // main rotation
    this.ls = random(lsa * 0.7, lsa * 1.1) // leaf size
    this.lr = radians(random(-180, 180)) // leaf rotation
    this.fr = radians(random(-180, 180)) // flower rotation
    this.fs = random(0.8, 1.2) // flower scale
    this.fd = round(random(80, 160)) // flower delay
    this.ld = round(random(15, 60)) // leaf delay
    this.lsc = random(0.8, 1.2) // leaf scale
    this.bc = color(bhv, random(170, 255), random(100, 200)) // branch color
    this.lc = color(lhv, lsv, random(100, 255)); // leaf color
    this.fb = random(200, 255) // flower brightness
           
    if (this.level < ml) {
      this.n1 = new Node(
        this.len * ld,
        this.size * sd,
        this.rr,
        this.level + 1
      );
      this.n2 = new Node(
        this.len * ld,
        this.size * sd,
        this.rr,
        this.level + 1
      );
    }
  }

  draw() {  
    strokeWeight(this.size)
    //this.s += (1.0 - this.s) / (15 + this.level * 5)
   // if (this.level >= ll) stroke(this.bc)
    //else stroke(0)
    stroke('#2b3327');
    let rotation_offset = sin(noise( 0.000006 * (this.level)) * 100)
    let temp_rot
    if(this.level < 3) temp_rot = 0
    else temp_rot = this.rot
    
    //let x = cos(TAU/4  ) * this.rr
  // let y = height / 2
   // let z = sin(TAU /4 ) * this.rr
   // translate(0, 0, 0) 
    rotate(temp_rot + (rotation_offset * 0.1) )
    //push()
    
    line(0, 0, 0,  0, -this.len, this.z)
    translate(0, -this.len, this.z) 
    //pop()
    
    // draw leaves
      //if (this.ld < 0) {
       // push()
        //fill(0,50)
       // noStroke()
       // scale(this.lsc)
       // rotateY(this.lr)
       // translate(0, -this.ls / 2, this.z)
        //ellipse(0, 0, this.ls * bwr, this.ls)
       // pop()
     // } else {
       // this.ld--
     // }

    // draw flowers
    if (this.level > ml - 3) {
      if (this.fd < 0) {
        push()
        scale(this.fs)
        stroke(5,47,43,60)
        fill(0,50)
        translate(0, 0, this.z)
        ellipse(0, 0, fw, fh)
        rotateY(this.fr)
        ellipse(0, 0, fw, fh)
        rotateY(radians(this.fr))
        ellipse(0, 0, fw, fh)
        fill(this.bc)
        //ellipse(0, 0, 6, 6)
        pop()
      } else {
        this.fd--
      }
    }
    push()
    if (this.n1 != null) this.n1.draw()
    pop()
    push()
    if (this.n2 != null) this.n2.draw()
    pop()
  }
}

function drawCloud(infoObj){
  push();
  translate(infoObj.x, 0,infoObj.z);
  translate(0, -infoObj.height,0);
  rotateX(PI/2);
  rotateY(PI*infoObj.m);
  //texture(img);
  noStroke();
  fill(255,40);
  sphere(1,5,5);
  pop();
}

function genCloudInfo(){
  var xoff=0;
   xoff=xoff+0.05;
      
  return{
    x:randomGaussian(50,200),
    //y:0,
    z:randomGaussian(100,20),
    width:random (1,3),
    height:randomGaussian(50,20),
    depth:random(20,80),
    m:int(random(-1,3)),
    
  };
}

function  generateCloudInfos(){
  for(var i=0;i<6000;i++){
    cloudInfos.push(genCloudInfo());
    
  }
}

//将经纬坐标转成x，y坐标
function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}
