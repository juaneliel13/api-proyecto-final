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

async function getRemember(level){
    let arr = []
    const snapshot = await db.collection('level').doc(level).get()

    const cityRef = db.collection('level').doc(level);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }

    snapshot.forEach(res=>{
        arr.push(res.data().availableProducts)
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

async function setRemember(level,data){
    const levelRef = await db.collection('level').doc(level);
    const res = await levelRef.update({availableProducts: data.remember});
    return res

}

module.exports = {getAll,getLevel,getRemember,setRemember}