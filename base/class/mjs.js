export default class {
  Base = {
    default: (o, main) => {
      if(o.class) main.className = o.class;
      if(o.classes) main.className = o.classes.filter(e => e).join(' ');
      if(o.id) main.id = o.id;
      if(o.text) main.textContent = o.text;
      if(o.inner) main.insertAdjacentHTML(o.inner[0], o.inner[1]);
      if(o.title) main.title = o.title;
      if(o.attr) main.setAttribute(o.attr[0], o.attr[1]);
      if(o.attrs) o.attrs.forEach(e => e && e.length && main.setAttribute(e[0], e[1]));
      if(o.tab) main.tabIndex = o.tab;
      if(o.name) main.setAttribute('name', o.name);
      if(o.editable) main.setAttribute('contenteditable', true);
      if(o.style) main.style = o.style;
    },
    label: (o, main) => {
      if(o.classL) main.className = o.classL;
      if(o.classesL) main.className = o.classesL.filter(e => e).join(' ');
      if(o.idL) main.id = o.idL;
      if(o.textL) main.textContent = o.textL;
      if(o.innerL) main.insertAdjacentHTML(o.innerL[0], o.innerL[1]);
      if(o.titleL) main.title = o.titleL;
      if(o.attrL) main.setAttribute(o.attrL[0], o.attrL[1]);
      if(o.attrsL) o.attrsL.forEach(e => e && e.length && main.setAttribute(e[0], e[1]));
      if(o.tabL) main.tabIndex = o.tabL;
      if(o.nameL) main.setAttribute('name', o.nameL);
      if(o.editableL) main.setAttribute('contenteditable', true);
      if(o.styleL) main.style = o.styleL;
    }
  };
  Append = {
    default: (o, main) => {
      if(o.replace) o.replace.replaceWith(main);
      if(o.replaceChildren) o.replaceChildren();
      o.insert ? o.path.insertAdjacentElement(o.insert, main) : o.path.appendChild(main);

      if(o.func) o.func(main);
      if(o.focus) main.focus();
      if(o.rtn) return main;
    },
    selection: (o, main) => {
      let label;
      if(o.label) label = this.Build.Label({
        ...o
      }, main);
      console.log(label)

      this.Base.default(o, main);
      label && this.Base.label(o, label);

      this.Append.label(o, main, label);

      // !label && this.Append.default(o, main);
      // label && this.Append.default(o, main);

      if(o.rtn) return main;
      if(o.rtnL) return label;
    },
    label: (o, main, label) => {
      if(o.replaceL) o.replace.replaceWith(label);
      if(o.replaceChildrenL) o.replaceChildren();
      // o.insertL ? main.insertAdjacentElement(o.insertL, label) : main.appendChild(label);
      o.insertL ? o.path.insertAdjacentElement(o.insertL, label) : o.path.appendChild(label);
      o.insert ? label.insertAdjacentElement(o.insert, main) : label.appendChild(main);
      // o.insertL ? label.insertAdjacentElement(o.insertL, main) : label.appendChild(main);

      if(o.funcL) o.funcL(label);
      if(o.focusL) main.focus();
      return label;
      // if(o.rtnL) return main;
    }
  };
  Events = {
    default: (o, main) => {
      if(o.onclick) main.onmousedown = (e) => e.button === 0 && o.onclick(e);
      if(o.onrclick) main.oncontextmenu = o.onrclick;
      if(o.onkeyup) main.onkeyup = o.onkeyup;
      if(o.onkeydown) main.onkeydown = o.onkeydown;
      if(o.onwheel) main.onwheel = o.onwheel;
      if(o.onfocus) main.onfocus = o.onfocus;
      if(o.onfocusin) main.onfocusin = o.onfocusin;
      if(o.onfocusout) main.onfocusout = o.onfocusout;
      if(o.onblur) main.onblur = o.onblur;
      if(o.onpaste) main.onpaste = o.onpaste;
      if(o.onmouseenter) main.onmouseenter = o.onmouseenter;
      if(o.onpointerenter) main.onpointerenter = o.onpointerenter;
    },
    input: (o, main) => {
      if(o.oninput) main.oninput=o.oninput;
      if(o.onchange) main.onchange=o.onchange;
      if(o.onpaste) main.onpaste=o.onpaste;
    },
    selection: (o, main) => {
      if(o.onchange) main.onchange=o.onchange;
    },
    media: (o, main) => {
      if(o.onplay) main.onplay=o.onplay;
      if(o.onpause) main.onpause=o.onpause;
      if(o.onended) main.onended=o.onended;
    }
  };
  Attrs = {
    media: (o, main) => {
      if(o.url) main.src=o.url;
      if(o.autoplay) main.autoplay=o.autoplay;
      if(o.muted) main.muted=o.muted;
      if(o.loop) main.loop=o.loop;
      if(o.controls) main.controls=o.controls;
      o.preload ? main.preload=o.preload : main.preload='none';
    },
    img: (o, main) => {
      if(o.url) main.src=o.url;
      o.preload ? main.preload=o.preload : main.preload='none';
    },
    selection: (o, main) => {
      if(o.required) main.setAttribute('required', '');
      if(o.disabled) main.disabled=true;
      o.autocomplete ? main.autocomplete=autocomplete : main.autocomplete='off';
      this.Events.selection(o, main);
    },
    dialog: (o, main) => {
      if(o.autoclose && !o.onclose) main.onclose=() => main.remove();
    }
  };
  Funcs = {
    a: (o, main) => {
      this.Base.default(o, main);
      if(o.url) main.href=o.url;
      this.Events.default(o, main);
      this.Append.default(o, main);
    },
    list: (o, main) => {
      this.Base.default(o, main);
      this.Events.default(o, main);
      this.Build.List(o, main);
      // this.Append.default(o, main);
    },
    dialog: (o, main) => {
      this.Base.default(o, main);
      this.Attrs.dialog(o, main);
      this.Events.default(o, main);
      this.Append.default(o, main);

      if(o.show) main.open=true;
      if(o.showM) main.showModal();
    },
    select: (o, main) => {
      this.Base.default(o, main);
      this.Events.default(o, main);
      this.Build.Select(o, main);
    },
    img: (o, main) => {
      this.Base.default(o, main);
      this.Attrs.img(o, main);
      this.Events.default(o, main);
      this.Append.default(o, main);
    },
    video: (o, main) => {
      this.Base.default(o, main);
      if(o.poster) main.poster=o.poster;
      this.Attrs.media(o, main);
      o.pIp ? main.disablePictureInPicture=false : main.disablePictureInPicture=true;
      this.Events.media(o, main);
      this.Append.default(o, main);
    },
    audio: (o, main) => {
      this.Base.default(o, main);
      this.Attrs.media(o, main);
      this.Events.media(o, main);
      this.Append.default(o, main);
    },
    input: (o, main) => {
      this.Base.label(o, main);
      if(o.type) main.type=o.type;
      if(o.pattern) main.pattern=o.pattern;
      this.Attrs.selection(o, main);
      if(o.checked) main.checked=o.checked;
      if(o.value) main.value=o.value;
      if(o.accepted) main.accepted=o.accepted;
      if(o.placeholder) main.placeholder=o.placeholder;
      if(o.min) main.min=o.min;
      if(o.max) main.max=o.max;
      if(o.step) main.step=o.step;
      if(o.auto) main.autocomplete=o.auto;
      this.Events.default(o, main);
      this.Events.input(o, main);
      this.Append.selection(o, main);
    }
  }

  i = (type, o) => {
    const main=document.createElement(type);

    switch(type){
      case 'a': this.Funcs.a(o, main);
      break;
      case 'ul': this.Funcs.list(o, main);
      break;
      case 'dialog': this.Funcs.dialog(o, main);
      break;
      case 'select': this.Funcs.select(o, main);
      break;
      case 'img': this.Funcs.img(o, main);
      break;
      case 'video': this.Funcs.video(o, main);
      break;
      case 'audio': this.Funcs.audio(o, main);
      break;
      case 'input': this.Funcs.input(o, main);
      break;
      case 'select': this.Funcs.select(o, main);
      break;
      default: {
        this.Base.default(o, main);
        this.Events.default(o, main);
        this.Append.default(o, main);
      }
    }
    // this.Base(o, main);
    // this.Append.default(o, main);
  }

  Build = {
    Div: (o) => {
      const main=document.createElement('div');
      this.Base.default(o, main);
      this.Append.default(o, main);
    },
    Label: (o, main) => {
      const label=document.createElement('label');
      // this.Base.main(o, main);
      this.Base.label(o, label);
      // this.Append.label(o, main, label);
      // this.Append.label(o, main, label);
      return label;
    },
  
    P: (o) => {
      const main=document.createElement('p');
      this.Base.default(o, main);
      this.Append.default(o, main);
    },
    A: (o) => {
      const main=document.createElement('a');
      if(o.url) main.href=o.url;
      this.Base.default(o, main);
      this.Append.default(o, main);
    },
    List: (o, main) => {
      !main && (main=document.createElement('ul'));
      this.Base.default(o, main);
      // const main=document.createElement('ul');
      // this.Base.default(o, main);
      // this.Build.funcs.List.main(o);

      if(o.itemsHTML){
        o.itemsHTML.forEach(item => {
          console.log(item)
          this.Build.funcs.List.items.li({
            path: main,
            func: (l) => {
              this.Build[item.itype]({
                path: l,
                ...item
              });
            }
          })
        })
      };
      this.Append.default(o, main);
    },
    Select: (o, main) => {
      this.Base.default(o, main);
      if(o.options) o.options.forEach(item => {
        console.log(item);
        this.Build.funcs.Select.option({
          path: main,
          ...item
        });
      });
      this.Append.selection(o, main);
    },
    funcs: {
      Select: {
        option: (o) => {
          const main=document.createElement('option');
          this.Base.default(o, main);
          if(o.values){
            main.textContent=o.values[0];
            main.value=o.values[1];
          }
          this.Append.default(o, main);
        }
      },
      List: {
        // main: (o, main) => {
        //   !main && (main=document.createElement('ul'));
        //   if(o.itemsHTML){
        //     o.itemsHTML.forEach(item => {
        //       // console.log(item)
        //       this.Build.funcs.List.items.li({
        //         path: main,
        //         func: (l) => {
        //           this.Build[item.itype]({
        //             path: l,
        //             ...item
        //           });
        //         }
        //       })
        //     })
        //   };
    
        //   this.Base(o, main);
        // },
        items: {
          html: () => {},
          li: (o) => {
            const main=document.createElement('li');
            this.Base.default(o, main);
            this.Append.default(o, main);
    
            // if(o.func) o.func(main);
          }
        }
      }
    }
  };
}
