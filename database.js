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
    const levelExist = await (await db.collection('level').doc(level).get()).exists
    console.log(levelExist);
    if(levelExist){
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
    } else {
        
    }
}


module.exports = {getAll,getLevel,getRemember,setRemember,createResult,updateResult,searchResults,updateLevel}