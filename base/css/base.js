export default () => `
.flx {
  display: flex;
  min-width: 0;
  min-height: 0;

  &.hor {
    flex-direction: row;
  }
  &.ver {
    flex-direction: column;
  }
}

.inline {
  div, a {
    display: inline;
  }
}

[scroll] {
  &::-webkit-scrollbar-corner {
    background-color: unset;
  }

  &[scroll='lite']::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }
  &[scroll='mid']::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &[scroll='big']::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
`
