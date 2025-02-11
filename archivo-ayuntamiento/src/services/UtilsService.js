// utilsService.js (o utilsService.ts)
export const findNextId = (ids) => {
    const idSet = new Set(ids); 
    let newId = 1; 

    while (idSet.has(newId)) {
        newId++;
    }
    
    return newId;
}
