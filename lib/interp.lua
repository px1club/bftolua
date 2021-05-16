
    local cells = {10}
    local curcel = 1
    for i,v in pairs({">","+","+","+","+","+","+","+",">","+","+","+","+","+","+","+","+","+","+",">","+","+","+",">","+","<","<","<","<","-"}) do
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
    