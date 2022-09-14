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
    
    const docRef = await db.collection("results").add({date:Timestamp.now(),name:data.name,tiempo:0,productos:FieldValue.arrayUnion({})});
    return docRef.id

}

async function updateResult(id,data){
    const docRef = db.collection("results").doc(id)

    let prod = {}
    data.productos.forEach((x,index)=>{
        prod[index]=x.slice(0,x.indexOf("("))
    })
    let res = docRef.set({date:Timestamp.now(),tiempo:data.time,productos:FieldValue.arrayUnion(prod)});
    return res
}


async function searchResults(name){
    let arr = []
    const docRef = db.collection("results").where('name', '==', name);
    docRef.forEach(res=>{
        arr.push("hola")
    });
    return arr;

}


module.exports = {getAll,getLevel,getRemember,setRemember,createResult,updateResult,searchResults}