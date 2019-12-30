import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";
import {findItem} from "./finditem";

class RegisterDocuments {
    docs = [];
    loaded = false;

    updateDoc(doc) {
        let foundDoc = findItem(doc, this.docs);
        if (foundDoc !== -1) {
            this.docs[foundDoc] = doc
        } else {
            this.docs.push(doc)
        }
    }

    getDoc(id) {
        return new Promise(resolve => {
            if (this.loaded) {
                resolve(this.docs.find(o => {
                    return o.id === id
                }));
            }

        })

    }
}

decorate(RegisterDocuments, {
    docs: [persist("object"), observable],
    loaded: [persist("object"), observable],
    updateDoc: action,
    getDoc: action
});

export const registerDocuments = new RegisterDocuments();