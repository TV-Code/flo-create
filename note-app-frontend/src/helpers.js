export function outsideClickListener(element, callback) {
    return (event) => {
        if (!element.contains(event.target)) {
            callback();
        }
    };
}
