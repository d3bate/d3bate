import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";

class RegisterDocuments {
    docs = [];

    updateDoc(doc) {
        let foundDoc = findItem(doc, this.docs);
        if (foundDoc !== -1) {
            this.docs[foundDoc] = doc
        } else {
            this.docs.push(doc)
        }
    }
}

decorate(RegisterDocuments, {
    docs: [persist("object"), observable],
    updateDoc: action
});

export const registerDocuments = new RegisterDocuments();