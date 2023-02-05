export const createDom = (props: {
  tagName?: string;
  innerHTML?: string;
  attrs?: Record<string, any>;
  className?: string;
}) => {
  const { tagName = 'div', innerHTML = '', attrs = {}, className = '' } = props;
  const dom = document.createElement(tagName);
  dom.className = className;
  dom.innerHTML = innerHTML;
  Object.keys(attrs).forEach((item) => {
    const key = item;
    const value = attrs[item];
    if (tagName === 'video' || tagName === 'audio') {
      if (value) {
        dom.setAttribute(key, value);
      }
    } else {
      dom.setAttribute(key, value);
    }
  });
  return dom;
};

export function hasClass(el: HTMLElement, className: string) {
  if (!el) {
    return false;
  }

  if (el.classList) {
    return Array.prototype.some.call(
      el.classList,
      (item) => item === className,
    );
  } else if (el.className) {
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  } else {
    return false;
  }
}

export function addClass(el: HTMLElement, className: string) {
  if (!el) {
    return;
  }

  if (el.classList) {
    className
      .replace(/(^\s+|\s+$)/g, '')
      .split(/\s+/g)
      .forEach((item) => {
        item && el.classList.add(item);
      });
  } else if (!hasClass(el, className)) {
    el.className += ' ' + className;
  }
}

export function removeClass(el: HTMLElement, className: string) {
  if (!el) {
    return;
  }

  if (el.classList) {
    className.split(/\s+/g).forEach((item) => {
      el.classList.remove(item);
    });
  } else if (hasClass(el, className)) {
    className.split(/\s+/g).forEach((item) => {
      const reg = new RegExp('(\\s|^)' + item + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    });
  }
}

export function toggleClass(el: HTMLElement, className: string) {
  if (!el) {
    return;
  }

  className.split(/\s+/g).forEach((item) => {
    if (hasClass(el, item)) {
      removeClass(el, item);
    } else {
      addClass(el, item);
    }
  });
}

export function findDom(el = document, sel: string) {
  let dom: any;
  try {
    dom = el.querySelector(sel);
  } catch (e) {
    if (sel.indexOf('#') === 0) {
      dom = el.getElementById(sel.slice(1));
    }
  }
  return dom;
}
