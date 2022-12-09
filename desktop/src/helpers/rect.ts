type MinRect = {
    left: number,
    top: number,
    width: number,
    height: number
}

export const getRect = (
    element: HTMLElement,
    wrapper: HTMLElement | MinRect = document.querySelector('.wrapper__content') as HTMLElement
): DOMRect => {
    const rect = element.getBoundingClientRect();
    const scroll = document.querySelector<HTMLElement>('.wrapper__content');

    if (!wrapper) {
        return new DOMRect(
            scroll.scrollLeft + rect.x,
            scroll.scrollTop + rect.y,
            rect.width,
            rect.height
        );
    }

    const wrapperRect = wrapper instanceof HTMLElement ? wrapper.getBoundingClientRect() : new DOMRect(wrapper.left, wrapper.top, wrapper.width, wrapper.height);

    return new DOMRect(
        scroll.scrollLeft + rect.x - wrapperRect.x,
        scroll.scrollTop + rect.y - wrapperRect.y,
        rect.width,
        rect.height
    );
}

export const absToRelative = (
    rect: MinRect,
    wrapper: HTMLElement | MinRect = document.querySelector('.wrapper__content') as HTMLElement
) => {
    const wrapperRect = wrapper instanceof HTMLElement ? wrapper.getBoundingClientRect() : new DOMRect(wrapper.left, wrapper.top, wrapper.width, wrapper.height);
    const scroll = document.querySelector<HTMLElement>('.wrapper__content');

    return {
        left: rect.left - wrapperRect.x,
        top: rect.top - wrapperRect.y,
        width: rect.width,
        height: rect.height
    };
}