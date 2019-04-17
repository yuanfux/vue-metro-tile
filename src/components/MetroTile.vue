<template>
  <div
    :style="sceneStyle"
    @mousemove="onMouseMove($event)"
    @mousedown="onMouseDown($event)"
    @mouseup="onMouseUp($event)"
    @mouseleave="onMouseLeave"
    @touchmove.prevent="onTouchMove($event)"
    ref="scene">
    <div :style="boxContainerStyle">
      <div :style="frontFaceStyle">
        <slot name="front"></slot>
      </div>
      <div :style="backFaceStyle">
        <slot name="back"></slot>
      </div>
      <div :style="topFaceStyle">
        <slot name="top"></slot>
      </div>
      <div :style="bottomFaceStyle">
        <slot name="bottom"></slot>
      </div>
      <div :style="rightFaceStyle">
        <slot name="right"></slot>
      </div>
      <div :style="leftFaceStyle">
        <slot name="left"></slot>
      </div>
    </div>
    <div :class="{border: isHover && !isMouseDown}" :style="glareBoundingBox">
      <div :style="hoverGlareStyle">
      </div>
      <div :class="{ripple: isAnimating }" :style="clickGlareStyle" @animationend="resetAnimation">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetroTile',
  props: {
    faceStyle: {
      type: Object
    },
    frontStyle: {
      type: Object
    },
    backStyle: {
      type: Object
    },
    rightStyle: {
      type: Object
    },
    leftStyle: {
      type: Object
    },
    topStyle: {
      type: Object
    },
    bottomStyle: {
      type: Object
    },
    rotateX: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 200
    },
    width: {
      type: Number,
      default: 250
    },
    perspective: {
      type: Number,
      default: 750
    },
    maxTiltX: {
      type: Number,
      default: 20
    },
    maxTiltY: {
      type: Number,
      default: 10
    },
    clickGlareSize: {
      type: Number,
      default: 90
    },
    clickGlareOpacity: {
      type: Number,
      default: 0.2
    },
    hoverGlareOpacity: {
      type: Number,
      default: 0.3
    }
  },
  data: function() {
    return {
      curTiltTransform: '',
      clickGlareTop: 0,
      clickGlareLeft: 0,
      glareScale: 5,
      hoverX: 0,
      hoverY: 0,
      mouseDownX: 0,
      mouseDownY: 0,
      isHover: false,
      isMouseDown: false,
      isAnimating: false
    }
  },
  computed: {
    sceneStyle: function() {
      return {
        position: 'relative',
        cursor: 'pointer',
        width: `${this.width}px`,
        height: `${this.height}px`,
        perspective: `${this.perspective}px`,
        overflow: 'hidden',
        'background-color': 'rgba(153,153,153,0.3)'
      }
    },
    curFaceTransform: function() {
      return `translateZ(-${this.height/2}px) rotateX(${this.rotateX}deg)`;
    },
    boxContainerStyle: function() {
      return {
        width: '100%',
        height: '100%',
        position: 'relative',
        'transform-style': 'preserve-3d',
        transition: 'transform 0.5s',
        transform: `${this.curTiltTransform} ${this.curFaceTransform}`,
        'will-change': 'transform'
      }
    },
    glareBoundingBox: function() {
      // translateZ mainly deals with the Safari z-index conflicting with transform issue
      // tilt cannot exceed the larger number of height/2 and length/2
      const translateZ = Math.max(this.height/2, this.width/2);
      // need to offset the scaling effect caused by translateZ
      const scaleOffset = this.perspective ? this.perspective / (this.perspective - translateZ) : 1;
      return {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
        overflow: 'hidden',
        'transform-style': 'preserve-3d',
        transform: `scale(${1/scaleOffset}, ${1/scaleOffset}) translateZ(${translateZ}px`,
        'pointer-events': 'none'
      }
    },
    hoverGlareStyle: function() {
      return {
        position: 'absolute',
        width: `${this.width*2}px`,
        height: `${this.height*2}px`,
        'background-image': `radial-gradient(circle at center, rgba(255,255,255, 0.7) 0%, rgba(255,255,255,0.1) 100%)`,
        transform: `translate(${this.hoverX-this.width/2}px, ${this.hoverY-this.height/2}px) translate(-${this.width/2}px, -${this.height/2}px)`,
        opacity: this.isHover ? this.hoverGlareOpacity : 0,
        'transform-style': 'preserve-3d',
        // 'will-change': 'transform'
      } 
    },
    clickGlareStyle: function() {
      const glareScaledsize = this.clickGlareSize * this.glareScale;
      // for Microsoft Edge compatibility issue, scale transform is banned
      // the width & height transform is not centered
      // offset is needed for centering the scale animation
      const glareScaledOffset = (glareScaledsize - this.clickGlareSize) / 2;
      const glareTop = this.clickGlareTop - this.clickGlareSize/2;
      const glareLeft = this.clickGlareLeft - this.clickGlareSize/2;
      return {
        position: 'absolute',
        width: `${this.clickGlareSize}px`,
        height: `${this.clickGlareSize}px`,
        opacity: 0,
        'border-radius': '50%',
        '--glare-top': `${glareTop}px`,
        '--glare-left': `${glareLeft}px`,
        '--glare-opacity': `${this.clickGlareOpacity}`,
        '--glare-scaled-size': `${glareScaledsize}px`,
        '--glare-scaled-top': `${glareTop - glareScaledOffset}px`,
        '--glare-scaled-left': `${glareLeft - glareScaledOffset}px`,
        'transform-style': 'preserve-3d',
        // 'will-change': 'transform opacity'
      }
    },
    frontFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.frontStyle,
        position: 'absolute',
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `translateZ(${this.height/2}px)`,
        outline: '1px solid transparent'
      }
    },
    backFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.backStyle,
        position: 'absolute',
        width: `${this.width}px`,
        height: `${this.height}px`,
        // use rotateZ to adjust back face position when rotating
        transform: `translateZ(-${this.height/2}px) rotateZ(180deg) rotateY(180deg)`,
        outline: '1px solid transparent'
      }
    },
    topFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.topStyle,
        position: 'absolute',
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `translateY(-${this.height/2}px) rotateX(90deg)`,
        outline: '1px solid transparent'
      }
    },
    bottomFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.bottomStyle,
        position: 'absolute',
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `translateY(${this.height-this.height/2}px) rotateX(-90deg)`,
        outline: '1px solid transparent'
      }
    },
    leftFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.leftStyle,
        position: 'absolute',
        width: `${this.height}px`,
        height: `${this.height}px`,
        transform: `translateX(-${this.height/2}px) rotateY(-90deg)`,
        outline: '1px solid transparent'
      }
    },
    rightFaceStyle: function() {
      return {
        ...this.faceStyle,
        ...this.rightStyle,
        position: 'absolute',
        width: `${this.height}px`,
        height: `${this.height}px`,
        transform: `translateX(${this.width-this.height/2}px) rotateY(90deg)`,
        outline: '1px solid transparent'
      }
    }
  },
  methods: {
    // get relative mouse position to the scene
    getRelativePos2Scene(pageX, pageY) {
      const boundingRect = this.$refs.scene.getBoundingClientRect();
      return {
        x: pageX - (boundingRect.left + window.scrollX),
        y: pageY - (boundingRect.top + window.scrollY)
      }
    },

    onMouseDown(event) {
      const relativePos = this.getRelativePos2Scene(event.pageX, event.pageY);
      this.mouseDownX = event.pageX;
      this.mouseDownY = event.pageY;
      this.tiltTile(relativePos);
      this.clickGlare(relativePos);
      this.setMouseDown(true);
    },

    onMouseUp(event) {
      // only emit click when mousedown and mouseup 
      // are at the same position
      if (
        this.mouseDownX === event.pageX &&
        this.mouseDownY === event.pageY
      ) {
        this.$emit('click', event);
      }
      this.recoverTile();
      this.setMouseDown(false);
    },

    onMouseMove(event) {
      const relativePos = this.getRelativePos2Scene(event.pageX, event.pageY);
      this.hoverGlare(relativePos);
    },

    onMouseLeave() {
      this.recoverTile();
      this.resetHover();
    },

    onTouchMove(event) {
      this.$emit('touchmove', event);
    },

    // tilt the tile based on relative mouse position
    tiltTile(relativePos) {
      const percentageX = relativePos.x / this.width;
      const percentageY = relativePos.y / this.height;
      const tiltX = ((0.5 - percentageY) * this.maxTiltX).toFixed(2);
      const tiltY = ((percentageX - 0.5) * this.maxTiltY).toFixed(2);
      this.curTiltTransform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    },

    // recover the tile from tilting
    recoverTile() {
      this.curTiltTransform = '';
    },

    // reset hover variable
    resetHover() {
      this.isHover = false;
    },

    // trigger glare effect when clicking
    clickGlare(relativePos) {
      this.clickGlareTop = relativePos.y;
      this.clickGlareLeft = relativePos.x;
      this.isAnimating = true;
    },

    // reset the click glare animation
    resetAnimation() {
      this.isAnimating = false;
    },

    // trigger glare effect when hovering 
    hoverGlare(relativePos) {
      this.isHover = true;
      this.hoverX = relativePos.x;
      this.hoverY = relativePos.y;
    },

    // set click variable
    setMouseDown(state) {
      this.isMouseDown = state;
    }
  }
}
</script>

<style>
.ripple {
  background-image: radial-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);
  filter: blur(5px);
  opacity: var(--glare-opacity);
  animation-name: ripple;
  animation-duration: 1.3s;
  animation-timing-function: ease-in;
}

@keyframes ripple {
  0% {
    transform: translate(var(--glare-left), var(--glare-top));
    opacity: var(--glare-opacity);
  }

  100% {
    width: var(--glare-scaled-size);
    height: var(--glare-scaled-size);
    transform: translate(var(--glare-scaled-left), var(--glare-scaled-top));
    opacity: 0;
  }

}

.border::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 2px solid rgba(255, 255, 255, 0.6);
}
</style>
