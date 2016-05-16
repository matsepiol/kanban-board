export default class dragDropHelper {
  
  constructor() {

  }

  handleDragStart(e) {
    //console.log(this);
    //this.style.opacity = 0.4;  
  }

  handleDragEnter(e) {
    console.log(this);
    this.classList.add('dragged');
  }

  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  handleDragLeave(e) {
    console.log(this);
    this.classList.remove('dragged');

    //this.style.opacity = 1;
  }

  handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    return false;
  }

}