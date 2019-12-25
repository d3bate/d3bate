import {action, decorate, observable} from "mobx";
import {persist} from "mobx-persist";

class Messages {
    messages = [];

    addMessage(message) {
        this.messages.push({
            id: this.messages.length - 1,
            title: message.title,
            body: message.body,
            category: message.category
        })
    }

    deleteMessage(id) {
        let message = this.messages.findIndex(o => {
            return o.id === id
        });
        this.messages.splice(message, 1);
    }
}

decorate(Messages, {
    messages: [persist("object"), observable],
    addMessage: action,
    deleteMessage: action
});

export const messages = new Messages();