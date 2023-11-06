import { useEffect, useRef, useState } from 'react'
import Matter, { Engine, Render, Bodies, World, } from 'matter-js'
import { Bird } from './game-objects/bird'
import { SlingShot } from './game-objects/slingshot'
import birdImage from './game-images/bird.gif'
import p5 from 'p5';


function Comp (props) {
  const [rerender, setRerender] = useState(false);
  const scene = useRef();
  const engine = useRef(Engine.create());
  const birdRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const slingshotRef = useRef(null);

  let sketch;
  let bird;
  let slingshot;

  useEffect(() => {
    const gameWindowHeight = 800
    const gameWindowWidth = 600
    const render = Render.create({
        element: scene.current,
        engine: engine.current,
        options: {
          width: gameWindowWidth,
          height: gameWindowHeight,
          wireframes: false,
          background: 'transparent',
        }
      })

      Matter.Events.on(engine.current, 'beforeUpdate', () => {
        if (birdRef.current && isDragging.current) {
          Matter.Body.setPosition(birdRef.current.body, mousePosition.current);
        }
      });

      
      bird = new Bird(300, 500, 25, engine.current.world, birdImage);
      birdRef.current = bird
      const bounce = 5 * (Math.random() - 0.5);
      slingshot = new SlingShot(300 + bounce, 600 + bounce, bird.body, engine.current.world);
      slingshotRef.current = slingshot
      const wallThickness = 20;
      
      World.add(engine.current.world, [
        Bodies.rectangle(gameWindowWidth / 2, wallThickness / 2, gameWindowWidth, wallThickness, { isStatic: true }), 
        Bodies.rectangle(wallThickness / 2, gameWindowHeight / 2, wallThickness, gameWindowHeight, { isStatic: true }), 
        Bodies.rectangle(gameWindowWidth / 2, gameWindowHeight - wallThickness / 2, gameWindowWidth, wallThickness, { isStatic: true }), 
        Bodies.rectangle(gameWindowWidth - wallThickness / 2, gameWindowHeight / 2, wallThickness, gameWindowHeight, { isStatic: true }) 
      ])
      

    Matter.Runner.run(engine.current)

    Render.run(render)



    return () => {
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
      
    }
  }, [rerender])

  const handleDown = (e) => {
    isDragging.current = true;
    const mousePosition = { x: e.clientX, y: e.clientY };
    const birdPosition = birdRef.current.body.position;
    const strength = 0.01;
    const force = {
      x: (birdPosition.x - mousePosition.x) * strength,
      y: (birdPosition.y - mousePosition.y) * strength,
    };
    Matter.Body.applyForce(birdRef.current.body, birdPosition, force);
  };

  const handleUp = () => {
    isDragging.current = false;
  
    if (slingshot) {
  
      slingshotRef.current.bodyB = null;
    }
}

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleAddCircle = e => {
      
      bird = new Bird(e.clientX, e.clientY, 25, engine.current.world, birdImage);
      birdRef.current = bird
      const bounce = 10 * (Math.random() - 0.5);
      slingshot = new SlingShot(e.clientX + bounce, e.clientY + bounce, bird.body, engine.current.world);
      slingshotRef.current = slingshot
    /*   const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 1,
          friction: 0.005,
          render: {
            fillStyle: '#0000ff'
          }
        }) */
      World.add(engine.current.world, [bird, slingshot])
    
  }

  return (
    <div className='game-window-and-button-container'>
    
    <div className='game-window'>
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onClick={handleAddCircle}
      onMouseMove={handleMouseMove}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    >
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
    </div>
    <img className="celeb-picture"
      src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4WDIftA0VVPf_h7bPuMHFkTK2WMyO6RPqvf_C5A6f&s'}
      alt="Bird Image"
    />
  </div>
    <button onClick={() => setRerender(!rerender)}>New Game</button>
    </div>
  )
}

export default Comp