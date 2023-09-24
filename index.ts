
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, 
  FALLING_STONE,
  BOX, 
  FALLING_BOX,
  KEY1, 
  LOCK1,
  KEY2, 
  LOCK2
}

interface Tile {
  isAir(): boolean;
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isFallingStone(): boolean;
  isKey1(): boolean;
  isLock1(): boolean;
  isKey2(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  isEdible(): boolean;
  isPushable(): boolean;
  moveHorizontal(dx: number): void;
  isBoxy(): boolean;
  isStony(): boolean;

}

class Air implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  isEdible() {
    return true;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  isAir() { return true; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Flux implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() {
    return true;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  isAir() { return false; }
  isFlux() { return true; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Unbreakable implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() {
    return false;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return true; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Player implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  isEdible() {
    return false;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return true; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Stone implements Tile {
  constructor(private readonly falling: FallingState) {}

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() {
    return false;
  }
  isPushable() {
    return true;
  }
  moveHorizontal(dx: number): void {
    if(this.isFallingStone() === false) {
      if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
        map[playery][playerx + dx + dx] = this;
        moveToTile(playerx + dx, playery);
      }
    } else if(this.isFallingStone() === true) {}
  }
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return true; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return this.falling.isFalling() }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return true; }
  isBoxy() { return false; }
  
}

class Box implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() {
    return false;
  }
  isPushable() {
    return true;
  }
  moveHorizontal(dx: number): void {
    if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return true; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return true; }
}
class FallingBox implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return true; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return true; }
}
class Key1 implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return true; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Lock1 implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return true; }
  isKey2() { return false; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Key2 implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return true; }
  isLock2() { return false; }
  isStony() { return false; }
  isBoxy() { return false; }
}
class Lock2 implements Tile {
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return true; }
  isStony() { return false; }
  isBoxy() { return false; }
}

enum Input {
  UP, DOWN, LEFT, RIGHT
}

interface Input2 {
  handle(): void;
}

class Right implements Input2 {
  handle() {
    moveHorizontal(1);
  }
}

class Left implements Input2 {
  handle() {
    moveHorizontal(1);
  }
}

class Down implements Input2 {
  handle() {
    moveHorizontal(1);
  }
}

class Up implements Input2 {
  handle() {
    moveHorizontal(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];
let inputs: Input2[] = [];

/**
 * @description 테스트 중에 모든 가능한 경우를 다 검사하고 빠짐없이 테스트하는 것을 의미
 */
function assertExhausted(x: never): never {
  throw Error("Unexpected object: " + x);
}

interface FallingState {
  isFalling(): boolean;
  isResting(): boolean;
}

class Falling implements FallingState {
  isFalling() {
    return true;
  }

  isResting() {
    return false;
  }
}

class Resting implements FallingState {
  isFalling() {
    return false;
  }

  isResting() {
    return true;
  }
}


function transform(title: RawTile) {
  switch(title) {
    case RawTile.AIR: return new Air();
    case RawTile.FLUX: return new Flux();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.PLAYER: return new Player();
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.BOX: return new Box();
    case RawTile.FALLING_BOX: return new FallingBox();
    case RawTile.KEY1: return new Key1();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.KEY2: return new Key2();
    case RawTile.LOCK2: return new Lock2();
    default: return assertExhausted(title);
  }
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transform(rawMap[y][x]);
    }
  }
}


function remove(tile: Tile) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === tile) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  if (map[playery][playerx + dx].isEdible()) {
    moveToTile(playerx + dx, playery);
  } else if ((map[playery][playerx + dx].isPushable())
    && map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey1()) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey2()) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
}

function moveVertical(dy: number) {
  if (map[playery + dy][playerx].isFlux()
    || map[playery + dy][playerx].isAir()) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}

function update() {
  handleInputs();

  updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTitle(x, y);
    }
  } 
}

function updateTitle(x: number, y: number) {
  if ((map[y][x].isStony()) && map[y + 1][x].isAir()) {
    map[y + 1][x].isFallingStone();
    map[y][x].isAir();
  } else if ((map[y][x].isBoxy()) && map[y + 1][x].isAir()) {
    map[y + 1][x].isFallingBox();
    map[y][x].isAir();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone(false);
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  console.log('gameLoop', sleep);
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

