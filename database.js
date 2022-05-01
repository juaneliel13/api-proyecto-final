const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const db = getFirestore();

async function getAll(){
    let arr = []
    const snapshot = await db.collection('config').get()
    snapshot.forEach(res=>{
        arr.push(res.data())
    });
    return arr
}


async function getLevel(level){

    const levelRef = db.collection('remember').doc(level);
    const doc = await levelRef.get();
    if (!doc.exists) {
        return null
    } else {
        return doc.data()
    }

}

module.exports = {getAll,getLevel}