export default (o) => `
@import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap');

[theme='dark'] {
  --bck-c: rgb(0 0 0);
  --bck-c-1: rgb(50 50 50);
  --bck-c-2: rgb(80 80 80);
  --col: rgb(255 255 255);
  --col-1: rgb(155 155 255);
  --col-2: rgb(55 155 255);

  --bor-c: rgb(255 255 255);
  --bor-c-1: rgb(120 120 120);

  --hover-bck-c: rgb(100 100 200);

  --hover-bck-c-1: rgb(120 120 120);

  --font-1: "Yanone Kaffeesatz", sans-serif;
  --font-2: "Inconsolata", monospace;
  --font-3: "Barlow Condensed", sans-serif;
  --font-4: "Share Tech", sans-serif;
  --font-5: "Smooch Sans", sans-serif;
  --font-6: "Josefin Sans", sans-serif;
  --font-7: "DM Sans", sans-serif;
  --font-8: "Mukta", sans-serif;
}

input {
  outline: none;
}

.adder {
  gap: 0 10px;
  
  .itm {
    gap: 0 5px;

    input {
      width: 40px;
    }

    .btn {
      padding: 0 5px 0 5px;
      aspect-ratio: 1/1;
      border: 1px solid rgb(0 0 0);
      border-radius: 10px;
    }
  }
}

.itt {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: red;

  .item-menu {
    position: absolute;
    padding: 5px;
    box-sizing: border-box;
    color: var(--col);
    background-color: var(--bck-c);
    width: 100%;

    .header {
      text-align: center;
    }
    .list {
      gap: 0px 0;
    }
  }
}

.li-item {
  flex-grow: 1;
  align-items: center;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1/1;
  text-align: center;
  justify-content: center;
  color: var(--col);
  background-color: var(--bck-c-1);
  border: 1px solid var(--bor-c-1);
}

.Gif-Widget {
  padding: 0;
  width: auto;
  max-width: ${o.main.width};

  .header {
    justify-content: center;
    justify-items: center;
    padding: 2px 0 6px 0;
    font-family: var(--font-7);
    text-transform: uppercase;
    color: var(--col);
    background-color: var(--bck-c);
  }

  .item-menu {
    position: absolute;
    padding: 5px;
    box-sizing: border-box;
    color: var(--col);
    background-color: var(--bck-c);
    width: 100%;
    outline: none;

    .header {
      text-align: center;
    }
    .list {
      gap: 0px 0;

      * {
        text-align: left;
        color: var(--col);
        background-color: var(--bck-c);
        cursor: pointer;

        &:nth-child(2n) {
          background-color: var(--bck-c-1);
        }

        &:hover {
          color: var(--col-1);
        }
      }
    }
  }

  .main-list {
    gap: 5px 0;
  }

  input {
    outline: none;
  }
  button {
    border: unset;
  }

  .preview {
    padding: 5px;
    width: 100%;
    height: ${o.preview.height};
    aspect-ratio: 1/0.5;
    box-sizing: border-box;
    background-color: var(--bck-c);

    .media {
      margin: auto;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .search-panel {
    padding: 5px;

    .btns {
      .btn {
        color: var(--col);
        background-color: var(--bck-c);

        &:hover {
          background-color: var(--hover-bck-c);
        }
      }
    }
  }

  .items-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 100%));
    gap: 5px 5px;
    padding: 5px;
    color: var(--col);
    background-color: var(--bck-c);

    &[search] {
      overflow-x: clip;
      overflow-y: auto;
      /* resize: unset; */
      /* width: 100%; */
      box-sizing: border-box;
    }

    &:empty {
      display: none;
    }

    .mask {
      position: relative;
      -width: 100px;
      aspect-ratio: 1/1;

      .panel {
        flex-grow: 1;
        flex-basis: 100%;
        gap: 0 5px;
        width: 100%;
        position: absolute;
        opacity: 0;
        background-color: var(--bck-c);

        .btn {
          border: 1px solid var(--bor-c-1);
          color: var(--col);
          background-color: var(--bck-c);

          &:hover {
            background-color: var(--hover-bck-c);
          }
        }

        &:hover {
          opacity: 1;
        }
      }

      .media {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .menu {
    min-width: 0;
    min-height: 0;
    background-color: var(--bck-c);

    .menu-header {
      color: var(--col);
    }

    .menu-items-list {
      padding: 5px;
      color: var(--col);
      background-color: var(--bck-c);
      height: auto;

      &:not(.flx) {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 100%));
        gap: 5px 5px;
      }
  
      .api {
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 1/1;
        color: var(--col);
        background-color: var(--bck-c-1);
        border: 1px solid var(--bor-c-1);
  
        &:hover {
          background-color: var(--hover-bck-c);
        }
      }
    }
  }

  .menu-header {
    .item {
      position: relative;
      font-weight: 500;
      font-family: var(--font-6);

      &[api] {
        &::after {
          position: absolute;
          top: -7px;
          right: -7px;
          vertical-align: super;
          font-size: x-small;
          font-family: var(--font-mini);
          font-weight: 400;
          color: var(--col);
          background-color: var(--bck-c);
        }

        &[api='def'] {
          &::after {
            content: 'DEF';
          }
        }

        &[api='tenor'] {
          &::after {
            content: 'TEN';
          }
        }
      }
    }
  }

  .address-bar {
    gap: 0 15px;
    background-color: var(--bck-c-1);

    .address-item {
      position: relative;
      color: var(--col);
      font-weight: 500;
      font-family: var(--font-4);
      background-color: var(--bck-c);
      outline: none;

      &[api] {
        &::after {
          position: absolute;
          top: -7px;
          right: -7px;
          vertical-align: super;
          font-size: x-small;
          font-family: var(--font-mini);
          font-weight: 400;
          color: var(--col);
          background-color: var(--bck-c);
        }

        &[api='def'] {
          &::after {
            content: 'DEF';
          }
        }

        &[api='tenor'] {
          &::after {
            content: 'TEN';
          }
        }
      }

      &:not(:first-child) {
        &::before {
          position: absolute;
          top: 0;
          left: -12px;
          font-family: var(--font-7);
          font-weight: 600;
          content: '>';
          color: var(--col);
        }
      }

      &:hover {
        background-color: var(--hover-bck-c);
      }
    }
  }

  .menu-btn {
    position: relative;
  
    &:hover {
      .s-menu {
        visibility: visible;
      }
    }
  
    .s-menu {
      padding: 5px;
      position: absolute;
      top: 100%;
      width: max-content;
      background-color: var(--bck-c);
      color: var(--col);
      visibility: collapse;
    
      .header {
        background-color: var(--bck-c-2);
      }
    
      .i-list {
        -position: absolute;
  
        .btn {
          &:hover {
            background-color: var(--bck-c-2);
          }
        }
      }
    }
  }
}
`
