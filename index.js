let cells = [0,0]
let curcel = 1
let script = ""

let bf = `+++++ +++++             initialize counter (cell #0) to 10
[                       use loop to set the next four cells to 70/100/30/10
    > +++++ ++              add  7 to cell #1
    > +++++ +++++           add 10 to cell #2 
    > +++                   add  3 to cell #3
    > +                     add  1 to cell #4
    <<<< -                  decrement counter (cell #0)
]                   
> ++ .                  print 'H'
> + .                   print 'e'
+++++ ++ .              print 'l'
.                       print 'l'
+++ .                   print 'o'
> ++ .                  print ' '
<< +++++ +++++ +++++ .  print 'W'
> .                     print 'o'
+++ .                   print 'r'
----- - .               print 'l'
----- --- .             print 'd'
> + .                   print '!'`
let bf_a = bf.split("")


//For loops
let inloop = false
let loop = []
const fs = require("fs")
const { execSync } = require("child_process")
function loophandler(lp){
    let lptab = []
    for(let i = 0; i < lp.length + 1; i++){
        if(!lp[i]){
            break;
        }
        lptab[lptab.length] = `"${lp[i]}"` 
    }
    let newcell = cells
    newcell.shift();
    fs.writeFileSync("./lib/interp.lua", `
    local cells = {${String(newcell)}}
    local curcel = ${String(curcel)}
    for i,v in pairs({${String(lptab)}}) do
        if v == "+" then
            cells[curcel] = cells[curcel] + 1
        elseif v == "-" then
            cells[curcel] = cells[curcel] - 1
        elseif v == ">" then
            curcel = curcel + 1
            if not cells[curcel] then
                cells[curcel] = 0
            end
        elseif v == "<" then
            curcel = curcel - 1
            if curcel < 1 then
                error("Instrunction "..i.." enters an invalid cell.")
            end
        end
    end
    local endcell = ""..cells[1]
    for i,v in pairs(cells) do
        if i > 1 then
            endcell = endcell..","..v
        end
    end
    file = io.open("./lib/temp.txt", "w")
    file:write(endcell)
    `)
    console.log("MADE IT THIS FAR")
    execSync("lua ./lib/interp.lua")
    let file = fs.readFileSync("./lib/temp.txt","utf-8")
    file = file.split(",")
    for(let i = 0; i < file.length + 1; i++){
        if(!file[i]){
            break;
        }
        file[i] = Number(file[i])
    }
    return file
}


let valids = ["+","-","[","]","*",".",",",">","<"]

for(let i = 0; i < bf_a.length + 1; i++) {
    if(!bf_a[i]){
        console.log("Compilation Complete, breaking.")
        break;
    }
    let obj = bf_a[i]
    if(!valids.includes(obj)){
        //console.log("Skipping comment " + obj)
    }else{
        if(inloop && obj != "]"){
            loop[loop.length] = obj
            console.log("Loop adding " + obj + " instruction " + i)
        }else{
            switch(obj){
                case '>':
                    curcel = curcel + 1
                    //@ts-ignore
                    if(typeof cells[curcel] != Number){
                        cells[curcel] = 0
                    }
                    console.log("Moved to cell" + curcel)
                break;
                case '<':
                    curcel = curcel - 1
                    if(curcel < 0){
                        console.log("Error on instruction " + i + "Negative Cell")
                    }
                    console.log("Moved to cell" + curcel)
                break;
                case '+':
                    cells[curcel] = cells[curcel] + 1
                    console.log("Cell" + curcel + "was added and is now " + cells[curcel])
                break;
                case '-':
                    cells[curcel] = cells[curcel] - 1
                    console.log("Cell" + curcel + "was subtracted and is now " + cells[curcel])
                    console.log(cells)
                break;
                case ',':
                    script = script + `local cell_${curcel} = io.read();`
                break
                case '.':
                    console.log(cells)
                    //console.log(curcel)
                    //console.log(cells[curcel])
                    script = script + `print("${String.fromCharCode(cells[curcel])}");`
                break;
                case '[':
                    /*
                        The plan is simple (not)
                        The loop never has to show on the export since everything will be made static.
                        We use an interp (remember to write one) and execute the loop. 
                        We then take the affected cells and their new bytes.
                        format: let idk = {
                            {
                                "Cell": 25,
                                "byte": 79
                            },
                            {
                                "Cell": 74,
                                "byte": 92
                            }
                        }
                        We now apply these changes and BANG loop made static.
                    */
                    inloop = true
                    console.log("Starting loop...")
                break
                case ']':
                    console.log("Ending loop...")
                    inloop = false
                    console.log(cells)
                    console.log(loop)
                    cells = loophandler(loop)
                    loop = {}
                    cells.unshift(0)
                    console.log("Staticized loop at instrunction " + i)
                break
                //Custom instruction to make life easier
                case '*':
                    script = script + "\n"
                break;
            }
        }
    }
}

console.log(script)