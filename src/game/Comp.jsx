import { useEffect, useRef, useState } from 'react'
import Matter, { Engine, Render, Bodies, World, } from 'matter-js'
import { Bird } from './game-objects/bird'
import { SlingShot } from './game-objects/slingshot'
import birdImage from './game-images/bird.gif'
import { getShowCharacters } from '../api.js'
import p5 from 'p5';


function Comp(props) {
  const [rerender, setRerender] = useState(false);
  const scene = useRef();
  const engine = useRef(Engine.create());
  const birdRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const slingshotRef = useRef(null);
  const [celebURL, setCelebURL] = useState('')
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
        background: 'rgba(100, 200, 100, 1)',
      }
    })

    Matter.Events.on(engine.current, 'beforeUpdate', () => {
      if (birdRef.current && isDragging.current) {
        Matter.Body.setPosition(birdRef.current.body, mousePosition.current);
      }
    });



    const wallThickness = 20;

    World.add(engine.current.world, [

      Bodies.rectangle(gameWindowWidth / 2, wallThickness / 2, gameWindowWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(wallThickness / 2, gameWindowHeight / 2, wallThickness, gameWindowHeight, { isStatic: true }),
      Bodies.rectangle(gameWindowWidth / 2, gameWindowHeight - wallThickness / 2, gameWindowWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(gameWindowWidth - wallThickness / 2, gameWindowHeight / 2, wallThickness, gameWindowHeight, { isStatic: true })
    ])


    Matter.Runner.run(engine.current)

    Render.run(render)

    bird = new Bird(300, 500, 25, engine.current.world, birdImage);
    birdRef.current = bird
    const bounce = 5 * (Math.random() - 0.5);
    slingshot = new SlingShot(300 + bounce, 600 + bounce, bird.body, engine.current.world);
    slingshotRef.current = slingshot



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



  const handleMouseMove = (e) => {
    if (isDragging.current) {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseClick = e => {
    if (birdRef.current && slingshotRef.current) {
      const mousePosition = { x: e.clientX, y: e.clientY };
      const birdPosition = birdRef.current.body.position;
      const strength = 0.01;
      const force = {
        x: (birdPosition.x - mousePosition.x) * strength,
        y: (birdPosition.y - mousePosition.y) * strength,
      };
      World.remove(engine.current.world, slingshotRef.current.sling);
      Matter.Body.applyForce(birdRef.current.body, birdPosition, force);
    }
  }

  const generateNewMole = (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      if (birdRef.current && slingshotRef.current) {
        World.remove(engine.current.world, birdRef.current.body);
        World.remove(engine.current.world, slingshotRef.current.sling);
      }
      bird = new Bird(300 * Math.random(), 500, 25, engine.current.world, birdImage);
      birdRef.current = bird
      const bounce = 5 * (Math.random() - 0.5);
      slingshot = new SlingShot(300 + bounce, 600 + bounce, bird.body, engine.current.world);
      slingshotRef.current = slingshot
    }
  }

  const displayNewCeleb = () => {
    getShowCharacters().then(({ data }) => {
      const randomId = Math.floor(data.length * Math.random())
      const celebURL = data[randomId].person.image.original;
      setCelebURL(celebURL);

    })
  }








  return (
    <>
      <div className='game-window-and-button-container'>

        <div className='game-window'>
          <div
            tabIndex={0}
            onKeyDown={generateNewMole}
            onClick={handleMouseClick}
            onMouseMove={handleMouseMove}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <div ref={scene} style={{ width: '100%', height: '100%' }} />
          </div>
          <img className="celeb-picture" src={celebURL} alt="a picture of a random celebrity" />
        </div>
        <button onClick={() => displayNewCeleb()}>New Game</button>
      </div>
    </>
  )
}



export default Comp