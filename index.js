let cells = [0]
let curcel = 0
let script = ""

let bf = `++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
[
    >+
    >+
    >+
    >+
    >+
    <<<<<-
]
>.>.>.>.>.`
let bf_a = bf.split("")


let valids = ["+","-","[","]","*",".",",",">","<"]

let truepos

for(let i = 0; i < bf_a.length + 1; i++) {
    if(!bf_a[i]){
        console.log("Compilation Complete, breaking.")
        break;
    }
    let obj = bf_a[i]
    if(!valids.includes(obj)){
        console.log("Skipping comment " + obj)
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
                    console.log("Error on instruction " + i + " Negative Cell")
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
                console.log("SC PRINT")
            break;
            case '[':
                console.log("loop?")
                if(cells[curcel] != 0){
                    truepos = i
                    console.log("lol")
                }
            break
            case ']':
                console.log("LOOP END")
                if(cells[curcel] != 0){
                    i = truepos
                }
                console.log(`New instruc ${i}`)
            break
            //Custom instruction to make life easier
            case '*':
                script = script + "\n"
            break;
        }
    }
}

console.log(script)
console.log("OP")