
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
  update(x: number, y: number): void;
  isAir(): boolean;
  isFlux(): boolean;
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
  moveVertical(dy: number): void;
  isFalling(): boolean;
  getBlockOnTopState(): FallingState;
}

class Air implements Tile {
  getBlockOnTopState() {
    return new Falling();
  }
  update() {}
  isFalling() {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  isEdible() {
    return true;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {
    player.move(dx, 0);
  }
  moveVertical(dy: number): void {
    player.move(0, dy);
  }
  isAir() { return true; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}
class Flux implements Tile {
  getBlockOnTopState() {
    return new Resting();
  }
  update() {}
  isFalling() {
    return false;
  }
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
    player.move(dx, 0);
  }
  moveVertical(dy: number): void {
    player.move(0, dy);
  }
  isAir() { return false; }
  isFlux() { return true; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}
class Unbreakable implements Tile {
  getBlockOnTopState() {
    return new Resting();
  }
  update() {}
  isFalling() {
    return false;
  }
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
  moveHorizontal(dx: number): void {
  }
  moveVertical(dy: number): void {
  }
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}

class Player {
  private x = 1;
  private y = 1;
  /**
   * getter 의 인라인화
   * player.getX(), player.getY() => this.x, this.y 로 변경
   */
  draw(g: CanvasRenderingContext2D) {
    g.fillStyle = "#ff0000";
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  pushHorizontal(tile: Tile, dx: number) {
    if (map[this.y][this.x + dx + dx].isAir() && !map[this.y + 1][this.x + dx].isAir()) {
      map[this.y][this.x + dx + dx] = tile;
      this.moveToTile(this.x + dx, this.y);
    }
  }
  move(dx: number, dy: number) {
    this.moveToTile(this.x + dx, this.y + dy);
  }
  moveToTile(newx: number, newy: number) {
    map[this.y][this.x] = new Air(); // 현재 위치 빈공간으로 변경
    map[newy][newx] = new PlayerTile(); // 새로운 위치에 player 이동
    this.x = newx;
    this.y = newy;
  }
  moveHorizontal(dx: number) {
    map[this.y][this.x + dx].moveHorizontal(dx);
  }
  moveVertical(dy: number) {
    map[this.y + dy][this.x].moveVertical(dy);
  }
}

class PlayerTile implements Tile {
  getBlockOnTopState() {
    return new Resting();
  }
  update() {}
  isFalling() {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  isEdible() {
    return false;
  }
  isPushable() {
    return false;
  }
  moveHorizontal(dx: number): void {
  }
  moveVertical(dy: number): void {
  }
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}
class Stone implements Tile {

  private fallStrategy: FallStrategy;
  
  constructor(private falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  getBlockOnTopState() {
    return new Resting();
  }
  update(x: number, y: number) {
    this.fallStrategy.update(x, y, this);
  }
  isFalling() {
    return this.falling.isFalling();
  }

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
    this.fallStrategy.moveHorizontal(this, dx);
  }
  moveVertical(dy: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return this.falling.isFalling() }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(private falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  getBlockOnTopState() {
    return new Resting();
  }
  update(x: number, y: number) {
    this.fallStrategy.update(x, y, this);
  }
  isFalling() {
    return this.falling.isFalling();
  }
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
    this.fallStrategy.moveHorizontal(this, dx);
  }
  moveVertical(dy: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return this.falling.isFalling(); }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private _1: boolean,
    private removeStrategy: RemoveStrategy
  ) {}
  // 해당 메서드는 문제가 되는 setter 가 아니다.
  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }
  setFillRect(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  is1() {
    return this._1;
  }
  removeLock() {
    remove(this.removeStrategy);
  }
}

class Key implements Tile {
  constructor(
    private keyConf: KeyConfiguration
  ) {}

  getBlockOnTopState() {
    return new Falling();
  }

  update() {}
  isFalling() {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    this.keyConf.setFillRect(g, x, y);
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {
    this.keyConf.removeLock();
    player.move(dx, 0);
  }
  moveVertical(dy: number): void {
    this.keyConf.removeLock();
    player.move(0, dy);
  }
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return true; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }

}

class LockC implements Tile {
  constructor(
    private keyConf: KeyConfiguration
  ) {}
  getBlockOnTopState() {
    return new Resting();
  }
  update() {}
  isFalling() {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    this.keyConf.setColor(g);
    this.keyConf.setFillRect(g, x, y)
  }
  isEdible() { return false; };
  isPushable() { return false; }
  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}
  isAir() { return false; }
  isFlux() { return false; }
  isFallingBox() { return false; }
  isFallingStone() { return false; }
  isKey1() { return false; }
  isLock1() { return this.keyConf.is1(); }
  isKey2() { return false; }
  isLock2() { return !this.keyConf.is1(); }
}

class FallStrategy {
  constructor(private falling: FallingState) {

  }
  moveHorizontal(tile: Tile, dx: number) {
    this.falling.moveHorizontal(tile, dx);
  }
  update(x: number, y:number, tile: Tile) {
    this.falling = map[y + 1][x].isAir() ? new Falling() : new Resting();
    this.falling.drop(tile, x, y);
  }
}

enum Input {
  UP, DOWN, LEFT, RIGHT
}

interface Input2 {
  handle(): void;
}

class Right implements Input2 {
  handle() {
    player.moveHorizontal(1);
  }
}

class Left implements Input2 {
  handle() {
    player.moveHorizontal(-1);
  }
}

class Down implements Input2 {
  handle() {
    player.moveVertical(1);
  }
}

class Up implements Input2 {
  handle() {
    player.moveVertical(-1);
  }
}

const player = new Player();
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
  moveHorizontal(tile: Tile, dx: number): void;
  /**
   * FallingStrategy 에서 옮긴 메서드
   * FallingStrategy.drop 에서 사용된 if 문이 FallingState 와 연관이 있어 옮김.
   * 옮기게 되면 삼항 연산자에서 사용된 else 문도 사라지게 됨. 
   */
  drop(tile: Tile, x: number, y: number): void;
}

class Falling implements FallingState {
  isFalling() {
    return true;
  }

  moveHorizontal() {}
  drop(tile: Tile, x: number, y: number) {
    map[y + 1][x] = tile; // 타일을 교체한 후
    map[y][x] = new Air(); // 새로 공기를 주입
  }
}

class Resting implements FallingState {
  isFalling() {
    return false;
  }

  moveHorizontal(tile: Tile, dx: number) {
    player.pushHorizontal(tile, dx);
  }

  drop() {}
}


function transformTile(title: RawTile) {
  const YELLOW_KEY = new KeyConfiguration("#ffcc00", true, new RemoveLock1());
  const BLUE_KEY = new KeyConfiguration("#00ccff", false, new RemoveLock2());

  switch(title) {
    case RawTile.AIR: return new Air();
    case RawTile.FLUX: return new Flux();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.PLAYER: return new PlayerTile();
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: return new Box(new Falling());
    case RawTile.KEY1: return new Key(YELLOW_KEY);
    case RawTile.LOCK1: return new LockC(YELLOW_KEY);
    case RawTile.KEY2: return new Key(BLUE_KEY);
    case RawTile.LOCK2: return new LockC(BLUE_KEY);
    default: return assertExhausted(title);
  }
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}




interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  player.moveToTile(newx, newy);
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
      updateTile(x, y);
    }
  } 
}

function updateTile(x: number, y: number) {
  map[y][x].update(x, y);
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
  player.draw(g);
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

