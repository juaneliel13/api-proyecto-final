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
    const docRef = await db.collection("results").add({level:data.level.name,date:new Date(),name:data.name,tiempo:0,productos:FieldValue.arrayUnion({})});
    return docRef.id

}

async function updateResult(id,data){
    const docRef = db.collection("results").doc(id)

    let prod = {}
    data.productos.forEach((x,index)=>{
        prod[index]=x.slice(0,x.indexOf("("))
    })
    let res = docRef.set({date:Timestamp.now(),tiempo:data.time,productos:FieldValue.arrayUnion(prod), percentage:data.percentage});
    return res
}


async function searchResults(name){
    let arr = []
    let docRef;
    if(name)
       docRef = await db.collection("results").where('name', '==', name).docs();
    else
    docRef = await db.collection("results").get();    
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
    keys.forEach(async e => {
        if( products[e] > 0){
            let cant = await getCurrentProduct(e);
            if(!cant)
                cant = 1;
            for(let i = 0; i < products[e]; i++)
                arr.push(e+"-"+cant)
        }
    })

    if(arr.length != 0){
        await db.collection('level').doc(level).collection("shelves").doc(id).set({productos:arr},{merge: true});
    }
    
}

async function existsLevel(level){
    return await (await db.collection('level').doc(level).get()).exists;
}


async function createLevel(level){
    await db.collection('level').doc(level).set({"dificultad":parseInt(level),"name":"Nivel "+level,availableProducts:[]})
    for(let i=1;i<=24;i++)
        await db.collection('level').doc(level).collection('shelves').add({gondola:i,productos:[]})
}

async function updateToRemember(level,products){
    let set = new Set();
    let keys = Object.keys(products)
    let doc = (await db.collection('level').doc(level).get()).data()
    let availableProducts = []

    let productsList = {}


    keys.forEach(x =>{
        Object.keys(products[x]).forEach(y => {
           if(productsList.hasOwnProperty(y)){
                productsList[y] += products[x][y]
           } else {
                productsList[y] = products[x][y]
           }
        })
    });
    Object.keys(productsList).forEach(x => {
        let prod = doc.availableProducts.find(y => y.nombre == x)
        let cant = 0
        if(prod){
            productsList[x] =  prod[0].cantidad > productsList[x] ? productsList[x] : prod[0].cantidad
        }
    })
    let result = Object.keys(productsList).filter(y => productsList[y] != 0).map(x => ({nombre:x,cantidad:productsList[x],max:productsList[x]}));
    if(result.length != 0){
        await db.collection('level').doc(level).set({availableProducts:result},{merge: true});
    }
}

async function getCurrentProduct(name){
    let ref = await db.collection("products").where("nombre", "==", name ).get()
    let current;
    ref.forEach(res=>{
        current = res.data().current;
    });
    return current

}

module.exports = {getAll,getLevel,getRemember,setRemember,createResult,updateResult,searchResults,updateLevel,existsLevel,createLevel,updateToRemember}