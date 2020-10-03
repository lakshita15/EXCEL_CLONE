let $ = require("jquery");
let fs = require("fs");
let dialog = require("electron").remote.dialog;

$("document").ready(function(){
    let db; //database 
    let lsc;

$(".new").on("click" , function(){
    console.log("clicked new")
    db =[];
    let allrows = $(".cells .row"); 
    //console.log(allrows.length); //100 rows
    
    for(let i =0;i<allrows.length;i++){
        let row =[];
        let allcolsinrow = $(allrows[i]).find(".cell");
        for(let j = 0;j<allcolsinrow.length;j++){
            let address = getaddressfromcolid(i,j);  
    
            let cellobject ={
                    name: address ,
                    value: "",
                    formula: "",
                    parent :[] ,
                    childrens: [] ,
                    cellFormatting:{ bold:false , underline:false , italic:false , linethrough :false } , cellalignment: "center",fontsize: "16px",textcolor : "black",cellfont : "arial" ,background : "white"
                  };
                  row.push(cellobject);

                            /**********************
                             * Set the CSS property and value:
                            $(selector).css(property,value)
                        **************** */
     $(allcolsinrow[j]).html("");

    $(allcolsinrow[j]).css("font-weight", "normal");
    $(allcolsinrow[j]).css("text-align", "center");
    // $(allcolsinrow[j]).css("background", "white");
    $(allcolsinrow[j]).css("font-family", "cursive");
    $(allcolsinrow[j]).css("font-size", "16px");
    $(allcolsinrow[j]).css("text-decoration","none");
    $(allcolsinrow[j]).css("text-decoration-line", "none")
    $(allcolsinrow[j]).css("color"  , "black");
}
   db.push(row);
    }
 $(".address , .cell-formula").val("");   
 })

//open

$(".open").on("click", function(){
console.log("open clicked")
let paths = dialog.showOpenDialogSync();
let path = paths[0];
let data = fs.readFileSync(path);
// console.log(data);
data = JSON.parse(data);
// console.log(data);
db=data;
let allRows = $(".cells .row");
    for(let i=0 ; i<allRows.length ; i++){
      let allCellsInARow = $(allRows[i]).find(".cell");
      for(let j=0 ; j<allCellsInARow.length ; j++){
        let value = db[i][j].value;
        $(allCellsInARow[j]).html(value);
        $(allCellsInARow[j]).css("font-weight" , db[i][j].cellFormatting.bold ? "bold" : "normal");
        $(allCellsInARow[j]).css("font-style" , db[i][j].cellFormatting.italic ? "italic" : "normal");
        $(allCellsInARow[j]).css("text-decoration" , db[i][j].cellFormatting.underline ? "underline" : "none");
        $(allCellsInARow[j]).css("text-decoration-line" , db[i][j].cellFormatting.linethrough ? "line-through" : "none");
        $(allCellsInARow[j]).css("text-align" , `${db[i][j].cellAlignment}`);
        $(allCellsInARow[j]).css("font-size" , `${db[i][j].fontsize}`);
        $(allCellsInARow[j]).css("color" , `${db[i][j].textColor}`);
        // $(allCellsInARow[j]).css("background" , `${db[i][j].background}`);
        $(allCellsInARow[j]).css("font-family" , `${db[i][j].cellfont}`);
      }
    }

})


$(".save").on("click", function(){
    console.log("save clicked")

    let path = dialog.showSaveDialogSync();
    console.log(path);
    let data = JSON.stringify(db);
    fs.writeFileSync(path , data);
    alert("File Saved !!");
    })
$(".file").on("click", function(){
let check = $(".file-menu-options").hasClass("active");
if(check){
  $(".file-menu-options").removeClass("active");
  
  
}else{
  $(".file-menu-options").addClass("active");
}


})
$(".home").on("click", function(){
  let check = $(".home-menu-options").hasClass("home-active");
  if(check){
    $(".home-menu-options").removeClass("home-active");

  $(".content").css("height","calc(100vh - 147px )");

  }else{
    $(".home-menu-options").addClass("home-active");
    $(".content").css("height","calc(100vh - 177px )");
  }
  
})
// set height
$(".cell").on("keyup" , function(){
  let height  = $(this).height();
let rowid = Number($(this).attr("r-id"));
     let leftcol = $(".left-col-cell")[rowid];
     $(leftcol).height(height);
     console.log(height);

})
//cell alignment
$("#left").on("click" , function(){
  console.log("clicked left");
let object = getcellobject(lsc);
$(lsc).css("text-align","left");
object.cellAlignment= "left";
})

$("#center").on("click" , function(){
  console.log("clicked center");
let object = getcellobject(lsc);
$(lsc).css("text-align","center");
object.cellAlignment= "center";
})

$("#right").on("click" , function(){
  console.log("clicked right");
let object = getcellobject(lsc);
$(lsc).css("text-align","right");
object.cellAlignment= "right";
})

//cell style
$(".bold").on("click" , function(){
  let cellObject = getcellobject(lsc);
  $(lsc).css("font-weight" , cellObject.cellFormatting.bold ?  "normal"  : "bold" );
  cellObject.cellFormatting.bold = !cellObject.cellFormatting.bold;
})

$(".underline").on("click" , function(){
  let cellObject = getcellobject(lsc);
  $(lsc).css("text-decoration" , cellObject.cellFormatting.underline ?  "none"  : "underline" );
  cellObject.cellFormatting.underline = !cellObject.cellFormatting.underline;
})

$(".italic").on("click" , function(){
  let cellObject = getcellobject(lsc);
  $(lsc).css("font-style" , cellObject.cellFormatting.italic ?  "normal"  : "italic" );
  cellObject.cellFormatting.italic = !cellObject.cellFormatting.italic;
})
$("#linethrough").on("click" , function(){
  console.log("clicked strike")
  let cellObject = getcellobject(lsc);
  $(lsc).css("text-decoration-line" , cellObject.cellFormatting.linethrough? "none": "line-through");
  cellObject.cellFormatting.linethrough =! cellObject.cellFormatting.linethrough;
})

//cell-font
$("#cell-font").on("click" , function(){
  let cellobject = getcellobject(lsc);
   let currfont = $("#cell-font").val();
  $(lsc).css("font-family",currfont );
cellobject.cellfont= `${currfont}`;
// console.log(db);
})

//cell size
$("#size").on("click" , function(){

let cellobject = getcellobject(lsc);
let currsize = $("#size").val();
$(lsc).css("font-size", `${currsize}px`);
cellobject.fontsize =  `${currsize}px`;
// console.log(db);
})

//text color
$("#cell-background").on("click" , function(){
  let cellobject = getcellobject(lsc);
  console.log("hi");
  let currcolor = $("#cell-background").val();
  $(lsc).css("background-color" , currcolor);
  cellobject.background = `${currcolor}`;
})

$("#cell-text").on("click" , function(){
let cellobject = getcellobject(lsc);
let currtextcolor = $("#cell-text").val();
$(lsc).css("color" , currtextcolor);
cellobject.textcolor = `${currtextcolor}`;

})
   
 $(".cell").on("click" , function(){
    console.log("clicked cell");
    
    let rowid= Number($(this).attr("r-id"));
    let colid= Number($(this).attr("c-id"));
    
    let address =   String.fromCharCode(65 + colid) + (rowid+1);     
    $(".address").val(address);
    let cellobject  = getcellobject(this);
    $(".cell-formula").val(cellobject.formula);
})

$(".cell").on("blur" , function(){
    lsc = this;

    let  value =  Number($(this).text());
    let cellobject = getcellobject(this);
   if(value != cellobject.value){
        cellobject.value = value;
        if(cellobject.formula){ 
            removeFormula(cellobject);
            $(".cell-formula").val("");
        }
        updatechildren(cellobject);
    }
})

$(".cell-formula").on("blur" , function(){
    
    let formula = $(this).val(); 
    console.log(formula);
    let cellobject = getcellobject(lsc);
    if(formula){
        if( cellobject.formula != formula){
        removeFormula(cellobject);
        }
    
    if(addformula(formula)){
       alert("Cycle detection");
      }else{
        updatechildren(cellobject);

    }
  } 
                        
})
 

$(".content").on("scroll" , function(){
    let topOffset = $(this).scrollTop();
    let leftOffset = $(this).scrollLeft();

    $(".top-left-cell , .top-row").css("top" , topOffset+"px");
    $(".top-left-cell , .left-col").css("left" , leftOffset+"px");

})
 
//formula

function removeFormula(cellobject){
    
    cellobject.formula ="";
    for(let i=0 ; i<cellobject.parent.length ; i++){
        let parentname = cellobject.parent[i];
        let obj = getRowIdColIdFromAddress(parentname);
        let parentcellobject = db[obj.rowId][obj.colId];
        let newChildrensOfParent = parentcellobject.childrens.filter( function(child){
            return child != cellobject.name;
        })
        parentcellobject.childrens = newChildrensOfParent;
    }
   
    cellobject.parent = [];
}

/*************************************
 * ADD FORMULA CALC VALUE , ADD FORMULA  , UPDATE DB , UPDATE UI
 * *************************************/
function addformula(formula){
    let cellobject = getcellobject(lsc)
    cellobject.formula = formula;
    let formulaArray = formula.split(" ");

let children = cellobject.childrens;
for( let i = 0 ; i <children.length; i++ ){
    for( let j = 0 ; j < formulaArray.length ; j++){
        if(children[i] == formulaArray[j]|| formulaArray[j]== cellobject.name){
            console.log("1");
          return true;
        }
    }
}
console.log(cellobject.name);
console
for( let j = 0 ; j < formulaArray.length ; j++){
    if(formulaArray[j]== cellobject.name){
        console.log("2");
      return true;
    }
}
console.log(formula+"....",cellobject.address);
solveformula(cellobject);
    return false;
}

/************************************
 * formula solve 
 * ************************************/
function solveformula(cellobject){
    let formula = cellobject.formula;
    console.log(formula);
        
    let fcomps = formula.split(" "); 
    for(let i =0;i<fcomps.length;i++){
        let fcomp = fcomps[i];
        let cellName = fcomp[0];
        if (cellName >= "A" && cellName <= "Z") { 
            let {rowId , colId} = getRowIdColIdFromAddress(fcomp);
            let parentcellobject = db[rowId][colId];

            
            parentcellobject.childrens.push(cellobject.name);
            cellobject.parent.push(fcomp);
            let value = parentcellobject.value;
            formula = formula.replace( fcomp , value  );
        }
    }
    let value = eval(formula);
    cellobject.value = value;
    $(lsc).text(value);
}

/***********************************************
 * FUNCTION recalculate => ui, db update , fetch formula ; evaluate the formula
 * ***********************************************/
    function reCalculate(cellobject){
    let formula = cellobject.formula;
    // ( A1 + A2 )
    let fComps = formula.split(" ");
    for (let i = 0; i < fComps.length; i++) {
      let fComp = fComps[i];
      
      let cellName = fComp[0];
      if (cellName >= "A" && cellName <= "Z") {
        
        let {rowId , colId } = getRowIdColIdFromAddress(fComp);
        let parentCellObject = db[rowId][colId];
        let value = parentCellObject.value;
        formula = formula.replace( fComp , value  );
      }
    }
    // ( 10 + 20 )
    let value = eval(formula);
    cellobject.value = value;
    let {rowId , colId } = getRowIdColIdFromAddress(cellobject.name);
    $(`.cell[r-id=${rowId}][c-id=${colId}]`).text(value); 
   
  }

/***********************************************
 * FUNCTION UPDATE CHILDREN
 * ***********************************************/

    function updatechildren(cellobject){
      let childrens = cellobject.childrens;
      for( let i = 0; i< childrens.length ; i++){
           let childname = childrens[i];

            let {rowId , colId} = getRowIdColIdFromAddress(childname);
            let childobject = db[rowId][colId];
           reCalculate(childobject);
            updatechildren(childobject);
        }
    }

  function init(){
     $(".new").trigger("click");
   };
 init();

    function getaddressfromcolid(i,j){
        let row = i+1;
        let col = String.fromCharCode(65+j);
        let address = `${col}${row}`;

        return address;
    }

function getRowIdColIdFromAddress(address) {
    let row = Number(address.substring(1)) - 1;
    let col = address.charCodeAt(0) - 65;

    return {
        rowId : row,
        colId : col
    };
  }

function getcellobject(elem){

let rowid = Number($(elem).attr("r-id"));
let colid = Number($(elem).attr("c-id"));
let cellobject = db[rowid][colid];
   return cellobject;
}
});