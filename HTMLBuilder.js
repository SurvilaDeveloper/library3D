class HTMLElementBuilder {
    constructor(tagName, properties = {}, parentId, parentPlace) {
        this.element = document.createElement(tagName);
        this.parentId = parentId;
        this.parentPlace = parentPlace;

        this.setProperties(properties);
    }
    setProperties(properties) {
        for (const [key, value] of Object.entries(properties)) {
            this.element[key] = value;
        }
    }

    insert() {
        const parent = document.querySelector(this.parentId);

        if (parent) {
            switch (this.parentPlace) {
                case 'prepend':
                    parent.prepend(this.element);
                    break;
                case 'beforebegin':
                    parent.insertAdjacentElement('beforebegin', this.element);
                    break;
                case 'afterbegin':
                    parent.insertAdjacentElement('afterbegin', this.element);
                    break;
                case 'beforeend':
                    parent.insertAdjacentElement('beforeend', this.element);
                    break;
                case 'afterend':
                    parent.insertAdjacentElement('afterend', this.element);
                    break;
                default:
                    // Por defecto, append (al final)
                    parent.appendChild(this.element);
            }
        } else {
            console.error(`Parent element with selector '${this.parentId}' not found.`);
        }
    }
    destroy() {
        // Eliminar el elemento de su padre
        const parent = this.element.parentNode;
        if (parent) {
            parent.removeChild(this.element);
        }

        // Eliminar el elemento del DOM
        this.element = null;
    }
}
/*
// Ejemplo de uso
const pro = {
    id: 'myDiv',
    className: 'customDiv',
    innerHTML: 'Hola, este es un div personalizado.'
};
const myDiv = new HTMLElementBuilder('div', pro);

// Insertar antes del comienzo del body
myDiv.insertInto('body', 'afterbegin');
*/