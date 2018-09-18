# vue-metro-tile

<p align="center">
  <img width="150" height="150" src="https://user-images.githubusercontent.com/6414178/45662644-3a441000-bb35-11e8-8e72-e6ed618a733d.png">
</p>

## Preview
Vue Metro Tile is a Vue component for building Windows 10 like metro layout in modern browser.

View [Demo](https://yuanfux.github.io/vue-metro-tile/)

> The demo is empowered by `vue-metro-tile` & `vue-grid-layout`
## Install
```
npm install vue-metro-tile --save
```
or
```
yarn add vue-metro-tile
```
## Import
> support both cjs and umd
```js
import MetroTile from 'vue-metro-tile';
```
or
```js
 <script src="/path/to/vue-metro-tile.umd.min.js"></script>
```


## Usage
>  A blue metro tile with simple texts on 4 faces
```html
<MetroTile
    @click="handleClick($event)" 
    faceStyle="{'background-color': 'blue'}"
    >
  <div slot="front">
    front
  </div>
  <div slot="back">
    back
  </div>
  <div slot="top">
    top
  </div>
  <div slot="bottom">
    bottom
  </div>
</MetroTile>
```


## Props

```typescript
// style object for all 6 faces
// has a lower priority than specific face style
faceStyle?: object;
// style object for front face
frontStyle?: object;
// style object for back face
backStyle?: object;
// style object for left face
leftStyle?: object;
// style object for right face
rightStyle?: object;
// style object for top face
topStyle?: object;
// style object for bottom face
bottomStyle?: object;

// the width of square prism in px
width?: number = 200;
// the height of square prism in px
height?: number = 200;
// current showing face
frontFace?: 'front' | 'back' | 'top' | 'bottom' = 'front';
// the perspective of square prism container in px
perspective?: number = 750;
// the max tilt angle in degree along X axis
maxTiltX?: number = 20;
// the max tilt angle in degree along Y axis
maxTiltY?: number = 10;
// the initial glare size when clicking 
clickGlareSize?: number = 90;
// the glare opacity when clicking
clickGlareOpacity?: number = 0.15;
// the glare opacity when hovering
hoverGlareOpacity?: number = 0.3;
```

## Slots

 - `front`
 - `back`
 - `left`
 - `right`
 - `top`
 - `bottom`

##  Events

 - `click` 
 
## License
MIT
