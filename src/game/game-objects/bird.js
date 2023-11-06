import Matter, { Engine, Render, Bodies, World, Constraint} from 'matter-js'
import React, { Component } from 'react';

class Bird {
  constructor(x, y, r, world, birdImage) {
    const options = {
      restitution: 1.3
    };
    this.body = Matter.Bodies.circle(x, y, r, options);
    Matter.Body.setMass(this.body, this.body.mass * 4);
    Matter.World.add(world, this.body);
    this.r = r;
    this.birdImage = birdImage
  }

  show() {
    console.log('hello')  
    const pos = this.body.position;
    const angle = this.body.angle;
  }
}


/* class Bird extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engine: null,
      birdImage: null,
    };
  }

  componentDidMount() {
    const { x, y, r, world, birdImage } = this.props;
    const engine = Matter.Engine.create();

    const options = {
      restitution: 0.5,
    };

    const body = Matter.Bodies.circle(x, y, r, options);
    Matter.Body.setMass(body, body.mass * 4);
    Matter.World.add(world, body);

    Matter.Engine.run(engine);

    this.setState({
      engine,
      birdImage,
    });
  }

  show() {
    const { engine, birdImage, r } = this.state;
    const { position, angle } = this.state.engine.world.bodies[0];

    if (engine && birdImage) {
      // Use JSX to display the image
      return (
        <div>
          <img
            src={birdImage}
            alt="Bird Image"
            width={r * 20}
            height={r * 2}
            style={{
              position: 'absolute',
              top: position.y - r,
              left: position.x - r,
              transform: `rotate(${angle}rad)`,
            }}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.show()}
      </div>
    );
  }
}

export default Bird; */




export {Bird}
