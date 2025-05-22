/* @pjs preload="5-banner-small.png,5-banner.png"; */
F f;
L l1, l2;
static final float DRAG = 0.95;

void setup() {
  size(1000,500);
  f = new F();
  l1 = new L("5-banner-small.png", 300, 120, 0.5);
  l1.addHotspot(new H(350,30,35,20,url[1]));
  l2 = new L("5-banner.png", 500, 0, 0.7);
}

void draw() {
  f.check();
  l1.update(f);
  l2.update(f);
  background(100,200,100,0);
  l1.paint();
  l2.paint();
//  stroke(128);
//  f.paint();
}

class H { //Hotspot
  int x, y, w, h;
  String url;
  boolean active;
  H(int _x, int _y, int _w, int _h, String _u) { x=_x; y=_y; w=_w; h=_h; url=_u; active=false;}
  void paint() {
    pushMatrix();
    stroke(255,100,100);
    strokeWeight(3);
    noFill();
    translate(x,y);
    rect(0,0,w,h);
    popMatrix();
  }
}

class F { // Where is my Finger
  PVector[] p;
  boolean[] state;
  F() {
    p = new PVector[2];
    state = new boolean[2];
    p[0] = new PVector(mouseX, mouseY);
    state[0] = false;
  }
  void check() {
    state[1] = state[0]; state[0] = mousePressed;
    if (state[0] == true) {
      p[1] = p[0].get();
      p[0].x = mouseX;
      p[0].y = mouseY;
    }
    if (state[0] != state[1]) {
      // Stops erratic jumps
      p[1].x = mouseX;
      p[1].y = mouseY;
    }
  }
  boolean isPressed() { return state[0]; }
  PVector offset() { return PVector.sub(p[0], p[1]); }
  void paint() { line(p[0].x, p[0].y, p[1].x, p[1].y); }
}

class L { // A Layer
  PImage img;
  float velocity, gearing;
  ArrayList<H> h;
  int offset, baseline;
  L(String _l, int _b, int _o) { this(_l, _b, _o, 1.0); }
  L(String _l, int _b, int _o, float _g) {
    h = new ArrayList<H>();
    img = loadImage(_l);
    baseline = _b;
    offset = _o;
    gearing = _g;
  }
  void addHotspot(H _h) { h.add(_h); }
  void update(F _f) {
    if ( _f.isPressed() ) {
      velocity = _f.offset().x * gearing;
    } else {
      if (abs(velocity) > 0) {
        velocity = velocity * DRAG;
        if (abs(velocity) < 0.01) velocity = 0;
      }
    }
    offset += velocity;
    while (offset > img.width) offset -= img.width;
    while (offset < 0) offset += img.width;
  }
  void paint() {
    pushMatrix();
    translate(offset-img.width, baseline-img.height);
    drawMe();
    translate(img.width,0);
    drawMe();
    translate(img.width,0);
    drawMe();
    popMatrix();
  }
  void drawMe() {
    image(img, 0, 0);
    for ( H _h: h) { _h.paint(); }
  }
}