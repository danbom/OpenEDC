import { getItems, getItemsWithCodeList, getCodeListItemsByItem } from "./metadatahelper.js";
import { getCurrentLocale } from "./languagehelper.js";

class AutocompleteElement {
    constructor(value, label) {
        this._value = value;
        this._label = label;
    }

    get value() {
        return this._value;
    }

    get label() {
        return this._label ? `${this._label} (${this._value})` : this._value;
    }
}

export const modes = {
    CONDITION: 1,
    ITEM: 2,
    ITEMWITHCODELIST: 3
}

const comparators = ["<", "<=", ">", ">=", "==", "!="];

let parts = {
    ITEM: 1,
    COMPARATOR: 2,
    VALUE: 3
}

let elements;
let currentMode;
let currentPart;
let currentInput;

export const enableAutocomplete = (input, mode) => {
    // Set the mode and adjust the input parts
    currentMode = mode;
    setParts();

    // Start autocomplete when element gets focus
    input.addEventListener("input", inputEventListener);
    input.addEventListener("click", inputEventListener);
    input.addEventListener("keydown", keydownEventListener);

    // Close the autocomplete list when the user clicks somewhere else
    document.addEventListener("click", closeLists);
}

export const disableAutocomplete = input => {
    input.removeEventListener("input", inputEventListener);
    input.removeEventListener("click", inputEventListener);
    input.removeEventListener("keydown", keydownEventListener);
    document.removeEventListener("click", closeLists);
    elements = null;
}

const setParts = () => {
    switch (currentMode) {
        case modes.CONDITION:
            // Keep all parts
            break;
        case modes.ITEM:
            // Remove comparator and code list values
        case modes.ITEMWITHCODELIST:
            delete parts.COMPARATOR;
            delete parts.VALUE;
    }
}

const inputEventListener = event => {
    closeLists();
    if (!event.target.value) return;

    setCurrentPartAndInput(event.target);
    const value = getExpressionParts(currentInput.value)[currentPart-1];

    const list = document.createElement("div");
    list.className = "autocomplete-list has-background-white-bis";
    event.target.parentNode.appendChild(list);

    setElements();
    const matchingElements = elements.filter(element => element.label.toLowerCase().includes(value.toLowerCase()));
    for (const element of matchingElements) {
        const option = document.createElement("div");
        option.className = "autocomplete-option is-clickable p-3";
        option.textContent = element.label;
        option.onclick = () => elementSelected(element);
        list.appendChild(option);
    }
}

const keydownEventListener = event => {
    if (event.key == "Enter") {
        const firstOption = event.target.parentNode.querySelector(".autocomplete-option");
        if (firstOption) firstOption.click();
    }
}

const setCurrentPartAndInput = input => {
    const part = input.value.substring(0, input.selectionStart).split(" ").length;
    if (part != currentPart || input != currentInput) elements = null;

    currentPart = part;
    currentInput = input;
}

const elementSelected = element => {
    let expressionParts = getExpressionParts(currentInput.value);
    expressionParts[currentPart-1] = element.value;

    let existingParts = expressionParts.filter(part => part);
    currentInput.value = existingParts.join(" ");

    closeLists();
    if (existingParts.length < Object.keys(parts).length) {
        currentInput.value += " ";
        currentInput.focus();
        currentInput.click();
    }
}

const getExpressionParts = expression => {
    return [
        expression.split(" ")[0],
        expression.split(" ").length > 1 ? expression.split(" ")[1] : null,
        expression.split(" ").length > 2 ? expression.split(" ")[2] : null
    ];
}

const closeLists = event => {
    document.querySelectorAll(".autocomplete-list").forEach(list => {
        if (event && event.target && (event.target == currentInput || event.target.className == "autocomplete-option")) return;
        list.remove();
    });
}

const setElements = () => {
    if (elements) return;

    console.log("Load autocomplete elements");
    switch (currentPart) {
        case parts.ITEM:
            elements = getItemElements();
            break;
        case parts.COMPARATOR:
            elements = getComparators();
            break;
        case parts.VALUE:
            elements = getCodeListValues();
            break;
        default:
            elements = [];
    }
}

const getItemElements = () => {
    const items = currentMode == modes.ITEMWITHCODELIST ? getItemsWithCodeList() : getItems();
    return items.map(item => new AutocompleteElement(
        item.getOID(),
        item.getTranslatedQuestion(getCurrentLocale())
    ));
}

const getComparators = () => {
    return comparators.map(comparator => new AutocompleteElement(
        comparator
    ));
}

const getCodeListValues = () => {
    const itemOID = getExpressionParts(currentInput.value)[0];
    const codeListItems = getCodeListItemsByItem(itemOID);
    return codeListItems.map(codeListItem => new AutocompleteElement(
        codeListItem.getCodedValue(),
        codeListItem.getTranslatedDecode(getCurrentLocale())
    ));
}
