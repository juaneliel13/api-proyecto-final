const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue ,addDoc, updateDoc,doc} = require('firebase-admin/firestore');


const db = getFirestore();

async function getAll(){
    let arr = []
    const snapshot = await db.collection('level').get()
    snapshot.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}

async function getRemember(level){   
    const data = db.collection('level').doc(level);
    const doc = await data.get();
    if (!doc.exists) {
        return []
    } else {
        return doc.data().availableProducts
    }
    
}


async function getLevel(level){
    let arr = []
    const levelRef = await db.collection('level').doc(level).collection("shelves").get();
    levelRef.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}

async function setRemember(level,data){
    const levelRef = db.collection('level').doc(level);
    const res = await levelRef.update({availableProducts: data.remember});
    return res

}

async function createResult(data){
    const docRef = await db.collection("results").add({level:data.level,date:new Date(),name:data.name,tiempo:0,productos:FieldValue.arrayUnion({})});
    return docRef.id

}

async function updateResult(id,data){
    const docRef = db.collection("results").doc(id)

    console.log(data)

    if(data.percentage != null){
        let res = docRef.update({percentage:data.percentage});
        return res
    }else{
        let prod = {}
        if(data.productos){
            data.productos.forEach((x,index)=>{
                prod[index]=x.slice(0,x.indexOf("("))
            })
        }
        console.log(data);
        let res = docRef.update({date:Timestamp.now(),tiempo:data.time,productos:prod, tiempoEstimulo:data.stimulusTime});
        return res
    }
}


async function searchResults(name){
    let arr = []
    let docRef;
    if(name)
       docRef = await db.collection("results").where('name', '==', name).docs();
    else
    docRef = await db.collection("results").orderBy('date','desc').limit(10).get();    
    docRef.forEach(res=>{
        arr.push(res.data())
    });
    return arr;

}

async function updateLevel(level,shelf,products){
    let id = null
    //const levelExist = await (await db.collection('level').doc(level).get()).exists
    const docRef = await db.collection('level').doc(level).collection("shelves").where("gondola", "==", parseInt(shelf)).get()
    docRef.forEach(res=>{
        id = res.id
    });
    let arr = []
    let keys = Object.keys(products)
    for (let e of keys){
        if( products[e] > 0){
            let cant = await getCurrentProduct(e);
            if(!cant)
                cant = 1;
            for(let i = 0; i < products[e]; i++){
                arr.push(e+"-"+cant)
            }
            
        }
    }
    //if(arr.length != 0){
        await db.collection('level').doc(level).collection("shelves").doc(id).set({productos:arr},{merge: true});
  //  }
    
}

async function existsLevel(level){
    return (await db.collection('level').doc(level).get()).exists;
}


async function createLevel(level){
    await db.collection('level').doc(level).set({"dificultad":parseInt(level),"name":"Nivel "+level,availableProducts:[]})
    for(let i=1;i<=24;i++)
        await db.collection('level').doc(level).collection('shelves').add({gondola:i,productos:[]})
}

async function updateToRemember(level,products, newLevel){
    let set = new Set();
    let keys = Object.keys(products)
    let doc = (await db.collection('level').doc(level).get()).data()
    let productsList = {}

    keys.forEach(x =>{
        Object.keys(products[x]).forEach(y => {
           if(productsList.hasOwnProperty(y)){
                productsList[y] += parseInt(products[x][y])
           } else {
                productsList[y] = parseInt(products[x][y])
           }
        })
    });
    // Object.keys(productsList).forEach(x => {
    //     let prod = doc.availableProducts.find(y => y.nombre == x)
    //     if(prod){
    //          productsList[x] =  prod.cantidad > productsList[x] ? productsList[x] : prod.cantidad
    //     }
    // })

    console.log(newLevel,productsList);
    let result
    if(newLevel){
        result = Object.keys(productsList).filter(y => productsList[y] != 0).map(x => ({nombre:x,cantidad:0,max:productsList[x]}));
    } else {
        
        result = Object.keys(productsList).filter(y => productsList[y] != 0).map(x => {
            let prod = doc.availableProducts.find(y => y.nombre == x)
            if(prod){
                return {nombre:x,cantidad:prod.cantidad > productsList[x] ? productsList[x] :prod.cantidad,max:productsList[x]}
            } else {
                return {nombre:x,cantidad:0 ,max:productsList[x]}
            }
            }
        );
    }
    if(result.length != 0){
        await db.collection('level').doc(level).set({availableProducts:result},{merge: true});
    }
}

async function getCurrentProduct(name){
    let ref = await db.collection("products").where("name", "==", name ).get()
    let current;
    ref.forEach(res=>{
        current = res.data().current;
    });
    return current

}

async function getShelvesConfig(){
    let arr = []
    const levelRef = await db.collection('shelves').get();
    levelRef.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}

module.exports = {getAll,getLevel,getRemember,setRemember,createResult,updateResult,searchResults,updateLevel,existsLevel,createLevel,updateToRemember,getShelvesConfig}