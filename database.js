const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const db = getFirestore();

async function getAll(){
    let arr = []
    const snapshot = await db.collection('level').get()
    snapshot.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}

async function getRemember(){
    let arr = []
    const snapshot = await db.collection('remember').doc(1).get()
    snapshot.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}


async function getLevel(level){
    let arr = []
    const levelRef = await db.collection('level').doc(level).collection("shelves").get();
    levelRef.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}

async function setRemember(level){
    const levelRef = await db.collection('level').doc(level).get();
    console.log(levelRef);
    // Set the 'capital' field of the city
  //  const res = await cityRef.update({capital: true});
}

module.exports = {getAll,getLevel,getRemember,setRemember}