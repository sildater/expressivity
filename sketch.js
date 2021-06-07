let term_table, perf_table, pile_table;
let terms_array;
let term_objects = {};
let piles_array;
let pile_objects = {};
let perfs_array;
let perf_objects = {};

let perf_lines = [];
let pile_lines = [];
let term_lines = [];
let clicked_objects = [];

function preload() {
  term_table = loadTable("data/term_data.csv", 'csv', 'header');
  perf_table = loadTable("data/perf_data.csv", 'csv', 'header');
  pile_table = loadTable("data/pile_data.csv", 'csv', 'header');
}

function setup() {
  let canvas = createCanvas(1500, 800);
  canvas.mousePressed(checkclick);
  create_objects();
  noLoop();
  noStroke()

}

function draw() {
  background(255);
  
  for (var key in term_objects) {
    term_objects[key].display();
    }
  for (var key in pile_objects) {
    pile_objects[key].display();
    }
  for (var key in perf_objects) {
    perf_objects[key].display();
    }
  for (var key in pile_lines) {
    pile_lines[key].display();
      }
  for (var key in perf_lines) {
    perf_lines[key].display();
      }

  for (var key in term_lines) {
    term_lines[key].display();
      }
}




function create_objects() {
  // find the pile neighbors for each term
  terms_array = term_table.rows.map(parse_term_row);
  terms_array.map((term_object)=> {term_objects[term_object.id]=term_object;})
  piles_array = pile_table.rows.map(parse_pile_row);
  piles_array.map((pile_object)=> {pile_objects[pile_object.id]=pile_object;})
  perfs_array = perf_table.rows.map(parse_perf_row);
  perfs_array.map((perf_object)=> {perf_objects[perf_object.music_id]=perf_object;})
}


function parse_term_row(r){
  let row = r.arr;
  return new Term(parseFloat(row[6]), parseFloat(row[7]),
            str(row[4]), parseInt(row[5]),
            parseInt(row[0]), parseInt(row[1]),
            str(row[2]), str(row[3]),
            JSON.parse(row[8]),
            JSON.parse(row[9]),
            JSON.parse(row[10]),
              )
}

function parse_pile_row(r){
  // pile_idx,pile_name,pile_group,within_group_idx,term_idx
  let row = r.arr;
  return new Pile(str(row[1]), parseInt(row[0]),
            parseInt(row[2]), parseInt(row[3]),
            JSON.parse(row[4])
              )
}

function parse_perf_row(r){
  // perf_idx,within_perf_idx,perf_name,term_idx
  let row = r.arr;
  return new Performance(str(row[2]), parseInt(row[0]),
            parseInt(row[1]),
            JSON.parse(row[3])
              )
}



function create_pile_lines_from_pile(pile_id, term_idx){
  pile_lines=pile_lines.concat(term_idx.map((term_id)=>{return new Connection(pile_objects[pile_id].x_conn,
                                                              pile_objects[pile_id].y_conn,
                                                              term_objects[term_id].x,
                                                              term_objects[term_id].y,
                                                              pile_objects[pile_id].color)}))
}

function create_pile_lines_from_term(pile_idx, term_id){
  pile_lines=pile_lines.concat(pile_idx.map((pile_id)=>{return new Connection(pile_objects[pile_id].x_conn,
                                                              pile_objects[pile_id].y_conn,
                                                              term_objects[term_id].x,
                                                              term_objects[term_id].y,
                                                              pile_objects[pile_id].color)}))
}

function create_perf_lines_from_term(term_id, perf_idx){
  perf_lines=perf_lines.concat(perf_idx.map((perf_id)=>{return new Connection(perf_objects[perf_id].x_conn,
                                                              perf_objects[perf_id].y_conn,
                                                              term_objects[term_id].x,
                                                              term_objects[term_id].y,
                                                              color(20,140))}))
}

function create_perf_lines_from_perf(term_idx, perf_id){
  perf_lines=perf_lines.concat(term_idx.map((term_id)=>{return new Connection(perf_objects[perf_id].x_conn,
                                                              perf_objects[perf_id].y_conn,
                                                              term_objects[term_id].x,
                                                              term_objects[term_id].y,
                                                              color(20,140))}))
}


function create_term_lines_from_term(term_id_orig, term_idx, col){
  term_lines= term_lines.concat(term_idx.map((term_id)=>{return new Connection(term_objects[term_id_orig].x,
                                                              term_objects[term_id_orig].y,
                                                              term_objects[term_id].x,
                                                              term_objects[term_id].y,
                                                              col)}))
}



class Connection {
  constructor(x1,y1, x2,y2,color) {
    this.x1 = x1;
    this.y1 = y1; 
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
  }
  display () {
    push();
    fill(this.color);
    stroke(this.color);
    strokeWeight(2)
    line(this.x1, this.y1, this.x2, this.y2);
    pop();
  }
}









class Term {
  constructor(x,y,name, id, id_pile1, id_pile2, name_pile1, name_pile2, neighbors1, neighbors2, performances) {
    this.x = x*400+600;
    this.y = y*400+400;
    this.name = name;
    this.id = id;
    this.id_pile1 = id_pile1;
    this.id_pile2 = id_pile2;
    this.ids_pile = [id_pile1, id_pile2];
    this.name_pile1 = name_pile1;
    this.name_pile2 = name_pile2;
    this.neighbors1 = neighbors1;
    this.neighbors2 = neighbors2;
    this.perf_idx = performances;
  }

  display() {
    push();
    //stroke(pile_objects[this.id_pile1].color);
    fill(pile_objects[this.id_pile1].color);
    circle(this.x, this.y, 20);
    pop();
    push();
    //stroke(pile_objects[this.id_pile2].color);
    fill(pile_objects[this.id_pile2].color);
    circle(this.x, this.y, 10);
    pop();
    //stroke(color(0));
    text(this.name, this.x, this.y);
  }

  tryclick() {
    if(Math.sqrt((mouseX-this.x)**2 + (mouseY-this.y)**2)<= 10){
  
     clicked_objects.push(this);
    }
  }
  click() {
    console.log("clicked term", this.name)
    create_perf_lines_from_term(this.id, this.perf_idx);
    create_pile_lines_from_term(this.ids_pile, this.id);
    create_term_lines_from_term(this.id, this.neighbors1, pile_objects[this.id_pile1].color);
    create_term_lines_from_term(this.id, this.neighbors2, pile_objects[this.id_pile2].color);

    }
}








class Pile {
  constructor(name, id, group, within_group_id, term_idx) {

    this.name = name;
    this.id = id;
    this.group = group;
    this.within_group_id = within_group_id;
    this.term_idx = term_idx;

    this.x = 10;
    this.yl = 800 /44;
    this.y = this.compute_y();
    this.xl = 200;
    this.x_conn = 210;
    this.y_conn = this.y + 0.5*this.yl;
    

    this.color = this.compute_color()

  }
  compute_y () {
    let offset = 0;
    
    if (this.group == 2) {
      offset = this.yl * 25;
    }
    let y = (this.within_group_id) * this.yl + offset;
    return y
  }
  compute_color() {
    if (this.group == 2) {
      let from = color(218, 0, 32, 150);
      let to = color(72, 218, 9, 150);
      colorMode(RGB); // Try changing to HSB.
      return lerpColor(from, to, this.within_group_id/18)
    }
    else if (this.group == 1) {
      let from = color(23, 244, 120, 100);
      let to = color(23, 23, 244, 100);
      colorMode(RGB); // Try changing to HSB.
      return lerpColor(from, to, this.within_group_id/24)
    }

  }



  display() {
    push()
    fill(this.color);
    //circle(this.x, this.y, 10);
    //stroke(this.color);
    rect(this.x, this.y, this.xl, this.yl-1, 10);
    //stroke(0,100)
    //strokeWeight(2)
    fill(0,200)
    text(this.name, this.x+50, this.y+0.8*this.yl);
    pop()
  }

  tryclick() {
    if(mouseX>=this.x && mouseX<this.x+this.xl && mouseY>=this.y && mouseY<this.y+this.yl){
     console.log("clicked pile", this.name);
     clicked_objects.push(this);
    }
  }
  click() {
    
     create_pile_lines_from_pile(this.id, this.term_idx);


     for(var i = 0; i < this.term_idx.length; i++){
       
       let connected_term = terms_array[this.term_idx[i]];
       create_perf_lines_from_term(connected_term.id, connected_term.perf_idx);
     }

    }
  



}






class Performance {
  constructor(name, music_id, within_id,term_idx) {

    this.name = name;
    this.music_id = music_id;
    this.within_id = within_id;
    this.term_idx = term_idx;

    this.x = 1090;
    this.yl = 800/45;
    this.y = this.compute_y();
    this.xl = 400;
    this.x_conn = 1090;
    this.y_conn = this.y + 0.5*this.yl;

    this.color = color(20,230);
    
    

  }

  compute_y () {
    let offset = 0;
    let y = (this.within_id) * this.yl + offset;
    return y
  }


  display() {
    push()
    fill(20,50);
    //circle(this.x, this.y, 10);
    //stroke(this.color);
    rect(this.x, this.y, this.xl, this.yl-1, 10);
    //stroke(0,100)
    //strokeWeight(2)
    fill(this.color)
    text(this.name, this.x+50, this.y+0.8*this.yl);
    pop()
 
  }
  tryclick() {
    if(mouseX>=this.x && mouseX<this.x+this.xl && mouseY>=this.y && mouseY<this.y+this.yl){
     console.log("clicked performance", this.name);
     clicked_objects.push(this);
    }
  }
  click() {
    create_perf_lines_from_perf(this.term_idx, this.music_id);
    for(var i = 0; i < this.term_idx.length; i++){
      console.log(this.term_idx[i])
      let connected_term = terms_array[this.term_idx[i]];
      create_pile_lines_from_term(connected_term.ids_pile, connected_term.id);
    }
     

    }
}













function checkclick() {
  if (mouseButton === LEFT) {
    perf_lines = [];
    pile_lines = [];
    term_lines = [];
    clicked_objects = [];
    for(var i = 0; i < piles_array.length; i++){
      piles_array[i].tryclick();
    }
    for(var i = 0; i < perfs_array.length; i++){
      perfs_array[i].tryclick();
    }
    for(var i = 0; i < terms_array.length; i++){
      terms_array[i].tryclick();
    }
    for(var i = 0; i < clicked_objects.length; i++){
      clicked_objects[i].click();
    }
    redraw();
  
  }
  else if (mouseButton === RIGHT) {
    perf_lines = [];
    pile_lines = [];
    term_lines = [];
    clicked_objects = [];
    } 
  }
