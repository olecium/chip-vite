import React, { useEffect, useState } from 'react';
import './App.css'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { db } from './firebase';
import { MessageType } from './common/interfaces';
import { useAppDispatch } from './redux/hooks';
import { addMessage } from './redux/commonSlice';
import { useAuth } from './Login/hooks/useAuth';
import { useNavigate } from 'react-router';


export const uploadFileReturnUrl = async (file: File, storagePath: string): Promise<string> => {
    const storage = getStorage();
    const imageRef = ref(storage, storagePath);
    // uploadBytes(toStore, file).then((snapshot) => {
    //     console.log(`Uploaded a blob or file! ${photourl}`);
    // });
    // const snapshot: UploadResult = 
    await uploadBytes(imageRef, file);
    const url: string = await getDownloadURL(imageRef);

    //await snapshot.ref.getDownloadURL();
    return url;
}


const AddEmployee: React.FC = (): JSX.Element => {

    const { user } = useAuth();
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [active, setActive] = useState<boolean>(true);
    const [photo, setPhoto] = useState<File>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user]);

    const cleanForm = (): void => {
        setName('');
        setSurname('');
        setPhoto(undefined);
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        switch (name) {
            case "name": setName(value); break;
            case "surname": setSurname(value); break;
            case "active": setActive(!active); break;
        }
    };

    const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files !== null) {
            const file = e.target.files[0];
            setPhoto(file);
        }
    }

    const onEmployeeAdd = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        if (name && name.length > 0 &&
            surname && surname.length > 0) {

            try {
                const document = await addDoc(collection(db, "employees"), {});
                const documentRef = doc(db, "employees", document.id);


                // const storage = getStorage();
                const photoStoragePath = `/employees-pictures/${name}-${surname}`;
                // const photoRef = ref(storage, photourl);

                // const imageStoragePath: string = `books/covers/${bookId}-cover`;
                // 'file' comes from the Blob or File API
                let imageUrl = '';
                if (photo) {
                    imageUrl = await uploadFileReturnUrl(photo, photoStoragePath);
                    // uploadBytes(photoRef, photo).then((snapshot) => {
                    //     console.log(`Uploaded a blob or file! ${photourl}`);
                    // });
                }
                await updateDoc(documentRef, {
                    id: document.id,
                    name: name,
                    surname: surname,
                    photo: imageUrl,
                    active: active
                });

                if (document.id) {
                    dispatch(addMessage({ type: MessageType.success, text: 'New employee added successfully' }));
                }

                cleanForm();
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }

    };

    return (
        <div>
            <h1>Add Employee</h1>
            <div className="fieldset">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" onChange={onInputChange} value={name} />
            </div>
            <div className="fieldset">
                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname" onChange={onInputChange} value={surname} />
            </div>
            <div className="fieldset">
                <label htmlFor="active">Active</label>
                <input type="checkbox" name="active" onChange={onInputChange} checked={active} />
            </div>
            <div className="fieldset">
                <label htmlFor="photo">Photo</label>
                <input type="file" name="photo" onChange={handlePhotoFile} />
            </div>
            <button onClick={onEmployeeAdd} type="button" className="btn">Add employee</button>
        </div>
    );
};

export default AddEmployee;
