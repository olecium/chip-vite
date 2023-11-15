import { FS_USERS_PATH } from "../../common/constants/FireStorePaths";
import { IUserInfo } from "../../common/interfaces/IUserInfo";
import { db } from "../../firebase";
import { doc, getDoc } from 'firebase/firestore';

export const getUserInfo = async (uid: string): Promise<Readonly<IUserInfo> | undefined> => {
    const docRef = doc(db, FS_USERS_PATH, uid);

    // const q = query(usersRef, where(documentId(), '==', uid));
    //const doc = await db.doc(FS_USERS_PATH + uid).get(); //await collection(db, FS_USERS_PATH).doc(uid).get();

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const user = docSnap.data();

        if (user) {
            const result: IUserInfo = {
                admin: user.admin,
                email: user.email,
                name: user.name,
                userName: user.userName,
                orgs: user.orgs,
                uid: docSnap.id,
                type: user.type
            }
            return result;
        }
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        throw new Error(`getUser User: No user for with UID ${uid}`);
    }
};
