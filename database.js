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
    keys.forEach(e => {
        if(products[e]!=0)
            arr.push(e+"-"+products[e])
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
           // console.log(products[x][y]);
           if(productsList.hasOwnProperty(y)){
                productsList[y] += products[x][y]
           } else {
                productsList[y] = products[x][y]
           }
        })
    });
    // console.log(products[1]["cocaPlastico"]);
    console.log("resultado",productsList);

    // keys.forEach(x =>{
    //     Object.keys(products[x]).forEach(y => {
    //         if(products[x][y] != 0)
    //             set.add(y)
    //     })
    // });
    Object.keys(productsList).forEach(x => {
        console.log(x,productList[x]);
      //  let prod = doc.availableProducts.find(y => y.nombre == x)
      //  let cant = 0
      //  if(prod){
            //cant = prod[0].cantidad //falta ver si la cantidad que hay ahora es mayor o igual a esta
      //  }
      //      availableProducts.push({cantidad:prod.cantidad,nombre:x})
    })
       
    if(availableProducts.length != 0){
        await db.collection('level').doc(level).set({availableProducts:availableProducts},{merge: true});

    }
  //  set.add(Object.keys(products))
    //console.log(...set);
}
module.exports = {getAll,getLevel,getRemember,setRemember,createResult,updateResult,searchResults,updateLevel,existsLevel,createLevel,updateToRemember}