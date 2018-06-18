'use strict';
/* global store cuid, Item*/
const store = (function() {
  const items = [
    {id:cuid(), name:'apples',checked:false},
    {id:cuid(), name:'bananas', checked:false},
    {id:cuid(), name:'porgs',checked:true},
  ];
  return {items};
}());