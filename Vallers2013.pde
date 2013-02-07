/* */

Universe u;

void setup() {
  // size(400,400);
  size(window.innerWidth, window.innerHeight);
  u = new Universe();
  u.addLaw(new KillEdge());
  u.setBounds(-50,-50,width+50,height+50);
}

void draw() {
  background(255,0);
  emit(2);
  u.update();
  u.paint();
  // filter(BLUR,1);
}

void emit(int pct) {
  if ( random(100) < pct ) {
    Heart h = new Heart(
      new PVector(random(u.min_x, u.max_x), u.max_y),
      new PVector(random(-5.0, 5.0), -random(5.0,20.0))
    );
    u.addThing(h);
  }
}

class Heart extends Particle {
  PShape heart;
  Heart(PVector p, PVector v) {
    super(p, v);
    // heart = loadShape("heart.svg");
    heart = loadShape(heart_url);
    heart.disableStyle();
    float scale = random(0.05,0.1);
    float rotate = random(-0.3,0.3);
    heart.scale(scale);
    heart.rotate(rotate);
  }
  void paint() {
    pushMatrix();
    translate(position.x,position.y);
    noStroke();
    fill(255,0,0);
    shape(heart,0,0);
    popMatrix();
  }
}
/**
 * ScrambledPhysics
 * A rewrite of some earlier hacking.
 * The aim is to create a simple, portable physics library
 */

/**
 * The <code>Things</code> interface must be implemented for anything
 * that could be added to a universe. It defines the api which the
 * universe depends upon.
 */
interface Thing {
  /**
   * The <code>update</code> method will be called once per update
   * of the universe.
   */
  void update();
  /**
   * The <code>paint</code> method should draw the Thing, and will be
   * called when the universe is painted.
   */
  void paint();
  /**
   * The <code>removed</code> method is called if the particle is removed
   * from the universe, and can be overridden to perform some useful
   * behaviour like re-adding the particle to the universe, or cleaning up
   * other references 
   *
   * @param u Universe from which the particle has been removed.
   */
  void removed(Universe u);
}

/** 
 * The <code>Universe</code> class is the core of the simulation. Each
 * Universe can have laws applied to it, and things added to it.
 */
class Universe {
  /**
   * An <code>ArrayList</code> containing all the things that have been
   * added to the universe
   */
  ArrayList<Thing> things;
  /**
   * A series of floats containing the bounds of the defined universe
   */
  float max_x, min_x, max_y, min_y;
  /**
   * A <code>HashMap</code> of the laws that apply to the universe.
   */
  HashMap<String, Law> laws;

  /**
   * Default constructor, initialises the <code>things</code> ArrayList and
   * <code>laws</code> HashMap, and sets the bounds of the universe to the
   * size of the current sketch.
   */
  Universe() {
    things = new ArrayList<Thing>();
    laws = new HashMap<String, Law>();
    setBounds();
  }
  /**
   * Add a thing to the universe
   *
   * @param t Thing to add to the universe
   */
  void addThing(Thing t) {
    things.add(t);
  }
  /**
   * Get the full ArrayList of things in the universe
   */
  ArrayList<Thing> getThings() {
    return things;
  }
  /**
   * Get a thing from the universe
   */
  Thing getThing(int i) {
    return things.get(i);
  }
  /**
   * Count the number of things in the universe
   */
  int countThings() {
    return things.size();
  }
  /**
   * Add a law to the universe
   * Each law has a name, which is used to ensure that only one law of any type
   * is added to the universe (e.g. EdgeLaws all have the name "Edge"). The laws
   * are stored in a HashMap to ensure uniqueness.
   */
  void addLaw(Law l) {
    laws.put(l.getName(), l);
  }
  /**
   * Update the state of the universe. This should be called whenever you want
   * the universe to be updated - typically whenever the sketch is drawn
   */
  void update() {
    Law edge = null, drag = null;
    Law law;
    // Iterate through the laws applied to the universe
    for (String name : laws.keySet()) {
      law = laws.get(name);
      if (law instanceof DragLaw) {
        /*
         * We want to handle DragLaw laws last, as they are affected
         * by EdgeLaws laws.
         */
        drag = law;
        continue;
      } else if (law instanceof EdgeLaw ) {
        /*
         * We want to handle EdgeLaw laws second-to-last, as they affect
         * by DragLaw laws.
         */
        edge = law;
        continue;
      } else {
        /*
         * Apply the law to the universe. This will typically alter the state of the
         * members in the universe (e.g. applying forces, changing position, etc)
         * although it could do absolutely anything!
         */
        law.apply(this);
      }
    }
    /*
     * Iterate through all the things in the universe and update them. Typically
     * this will calculate the acceleration, velocity and position, but could do 
     * anything...
     */
    for (Thing t: things) t.update();
    // Apply any saved edge law
    if ( edge != null ) edge.apply(this);
    // Apply any saved drag law
    // TODO Ref issue #1 - may want to update the things in the universe again having done this
    if ( drag != null ) drag.apply(this);
  }
  /**
   * Paint the universe by calling the paint method of everything in the universe.
   * Things do not need to paint themselves using this method - in which case a separate way of 
   * painting them needs to be implemented.
   */
  void paint() {
    for (Thing t: things) { t.paint(); }
  /**
   * Set the bounds of the universe to between x_min, y_min and x_max, y_max
   */
  }
  void setBounds(float x_min, float y_min, float x_max, float y_max) {
    min_x = x_min;
    min_y = y_min;
    max_x = x_max;
    max_y = y_max;
  }
  /**
   * Set the bounds of the universe to the current screen size
   */
  void setBounds() { setBounds(0, 0, width, height); }
}

/**
 * Base class for all Laws subsequently added to the universe
 */
abstract class Law {
  /**
   * Name of the law - each Law which extends this abstract class must set this
   */
  final String name;
  
  /**
   * Default constructor
   * 
   * @param n Name to set for the class
   */
  Law(String n) {
    name = n;
  }

  /**
   * Apply the law to a given universe 
   *
   * @param u Universe to which this law should be applied
   */
  abstract void apply(Universe u);
  
  /**
   * Get the name of the law
   *
   * @return the name of the law as set by the construtor 
   */
  String getName() { return name; }
}

/**
 * Base class for all Drag laws added to the universe
 */
abstract class DragLaw extends Law {
  /**
   * Default constructor initialises all DragLaw subclasses with the name 'Drag'
   */
  DragLaw() { super("Drag"); }
}

abstract class EdgeLaw extends Law {
  EdgeLaw() { super("Edge"); }
  boolean inUniverse(Particle p, Universe u) {
    return ( p.position.x > u.min_x ) && ( p.position.x < u.max_x ) && ( p.position.y > u.min_y ) && ( p.position.y < u.max_y ); 
  }
}

class KillEdge extends EdgeLaw {
  void apply(Universe u) {
    for (int i = 0; i < u.things.size(); i++ ) {
      Thing t = u.things.get(i); 
      if ( ! ( t instanceof Particle ) ) continue;
      Particle p = (Particle)t;
      if ( ! inUniverse( p, u ) ) {
        u.things.remove(i);
        p.removed(u);
      }
    }
  }
}

abstract class ScrambledObject {
  HashMap<String, Property> properties;
  
  ScrambledObject() {
    properties = new HashMap<String, Property>();
  }

  void addProperty(Property p) {
    properties.put(p.getName(), p);
  }
  boolean hasProperty(String n) {
    return properties.containsKey(n);
  }
  float getProperty(String n) {
    return properties.get(n).getValue();
  }
}

class Particle extends ScrambledObject implements Thing {
  PVector position;
  PVector velocity;
  PVector acceleration;
  PVector force;
  boolean locked;
  boolean hidden;
  
  Particle(PVector p) {
    this(p,new PVector(0,0,0));
  }

  Particle(PVector p, PVector v) {
    super();
    position = p.get();
    velocity = v.get();
    acceleration = new PVector();
    force = new PVector();
    locked = false;
  }
  
  PVector getPosition() {
    return position.get();
  }
  
  void setPosition(PVector p) {
    position = p;
  } 
  
  void addForce(PVector a) {
    force.add(a);
  }
  
  void update() {
    if (!locked) {
      if ( hasProperty("Mass") ) acceleration = PVector.mult( force, 1/getProperty("Mass"));
      velocity.add(acceleration);
      position.add(PVector.mult( velocity, 1/frameRate) );
    }
    force.set(0,0,0);
  }
  
  void removed(Universe u) {
  }
  
  void paint() {
    if ( !hidden ) point(position.x, position.y);
  }
  
  void lock() { locked = true; }
  void unlock() { locked = false; }
  void hide() { hidden = true; }
  void show() { hidden = false; }
} 

/**
 * Properties - these apply to ScrambledObject classes
 */
abstract class Property {
  float value;
  final String name;
  
  Property(float v, String n) {
    value = v;
    name = n;
  }

  float getValue() {
    return value;
  }
  String getName() {
    return name;
  }
}